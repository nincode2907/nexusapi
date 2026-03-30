import prisma from "@/lib/prisma";
import { updateUserCredit } from "@/services/ledger.service";

// ─────────────────────────────────────────────
// Billing Service (Kế Toán API Usage)
// Handles credit calculation, deduction, usage
// logging, and ledger recording via atomic
// Prisma transactions.
// Supports Prompt Caching: cached input tokens
// are charged at 5% of base input price.
// ─────────────────────────────────────────────

// Transaction client type derived from the PrismaClient instance
type TransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];

// Fallback pricing when a model is not found in ModelPricing table
// Priced conservatively high to avoid under-charging
const DEFAULT_PRICING = {
  priceInPerToken: 0.000015, // ~$15/1M input tokens equivalent
  priceOutPerToken: 0.00006, // ~$60/1M output tokens equivalent
};

// Cached tokens are charged at 5% of the base input price
const CACHE_DISCOUNT_RATE = 0.05;

export interface BillingResult {
  success: boolean;
  totalCost: number;
  cachedCost: number; // How much was charged for cached tokens
  creditSaved: number; // How much credit the user saved thanks to caching
  modelFound: boolean;
  error?: string;
}

/**
 * Process billing for a completed API request.
 *
 * 1. Fetches ModelPricing for the given model (falls back to defaults).
 * 2. Splits input tokens into uncached vs cached.
 * 3. Calculates total cost:
 *    (uncachedTokens × priceIn) + (cachedTokens × priceIn × 5%) + (completionTokens × priceOut)
 * 4. Atomically:
 *    - Inserts a UsageLog record
 *    - Deducts credits via Ledger Service (ghi sổ cái)
 *    - Increments model usage count
 *
 * Designed to be called fire-and-forget after streaming completes.
 *
 * @param errorMessage - Error message from upstream (nếu statusCode != 200)
 */
export async function processBilling(
  apiKeyId: string,
  userId: string,
  modelName: string,
  promptTokens: number,
  completionTokens: number,
  cachedTokens: number,
  durationMs?: number,
  statusCode: number = 200,
  errorMessage?: string
): Promise<BillingResult> {
  try {
    // ── Step 1: Fetch model pricing ────────────────
    const pricing = await prisma.modelPricing.findUnique({
      where: { modelId: modelName },
    });

    let modelFound = true;
    let priceIn = DEFAULT_PRICING.priceInPerToken;
    let priceOut = DEFAULT_PRICING.priceOutPerToken;
    let priceCached = priceIn;

    if (pricing && pricing.isActive) {
      priceIn = pricing.priceInPerToken;
      priceOut = pricing.priceOutPerToken;
      priceCached = pricing.priceCachedPerToken ?? (priceIn * CACHE_DISCOUNT_RATE);
    } else {
      modelFound = false;
      // Fallback: treat ALL tokens as uncached for conservative billing
      cachedTokens = 0;
      console.warn(
        `[Billing] Model pricing not found for "${modelName}". ` +
        `Using fallback: in=${priceIn}, out=${priceOut}, cachedTokens forced to 0`
      );
    }

    // ── Step 2: Calculate costs with cache discount ──
    // Ensure cachedTokens never exceeds promptTokens
    cachedTokens = Math.min(cachedTokens, promptTokens);
    const uncachedTokens = promptTokens - cachedTokens;

    const uncachedCost = uncachedTokens * priceIn;
    const cachedCost = cachedTokens * priceCached;
    const outputCost = completionTokens * priceOut;
    const totalCost = uncachedCost + cachedCost + outputCost;

    // How much user saved compared to paying full price for all input tokens
    const creditSaved = cachedTokens * priceIn - cachedCost;

    // Guard: Skip billing if cost is effectively zero
    if (totalCost <= 0) {
      console.warn(
        `[Billing] Zero-cost request for model "${modelName}". ` +
        `Tokens: total=${promptTokens}, cached=${cachedTokens}, out=${completionTokens}. Skipping.`
      );
      return { success: true, totalCost: 0, cachedCost: 0, creditSaved: 0, modelFound };
    }

    // ── Step 3: Atomic transaction ────────────────
    // UsageLog + Ledger + Model usage count — all in one transaction
    await prisma.$transaction(async (tx: TransactionClient) => {
      // 3a. Insert usage log (bao gồm cachedTokens, creditSaved, errorMessage)
      const usageLog = await tx.usageLog.create({
        data: {
          userId,
          apiKeyId,
          modelName,
          promptTokens,
          completionTokens,
          cachedTokens,
          totalCostCredit: totalCost,
          creditSaved,
          duration: durationMs ?? null,
          statusCode,
          errorMessage: errorMessage ?? null,
        },
      });

      // 3b. Trừ tiền qua Ledger Service (ghi sổ cái kế toán kép)
      await updateUserCredit(
        userId,
        -totalCost,  // Số âm = trừ tiền
        "USAGE",
        `Gọi API ${modelName} — ${promptTokens + completionTokens} tokens`,
        usageLog.id, // referenceId = UsageLog ID
        tx  // Truyền transaction context
      );

      // 3c. Increment model usage count (if model exists in ModelPricing)
      if (pricing) {
        await tx.modelPricing.update({
          where: { id: pricing.id },
          data: { usageCount: { increment: 1 } },
        });
      }
    });

    // 3d. Update API key's lastUsed timestamp (non-critical, outside tx)
    prisma.apiKey
      .update({
        where: { id: apiKeyId },
        data: { lastUsed: new Date() },
      })
      .catch((err: Error) => {
        console.error("[Billing] Failed to update apiKey.lastUsed:", err);
      });

    console.log(
      `[Billing] Charged user=${userId} model=${modelName} ` +
      `tokens=[total=${promptTokens}, cached=${cachedTokens}, uncached=${uncachedTokens}, out=${completionTokens}] ` +
      `cost=${totalCost.toFixed(6)} saved=${creditSaved.toFixed(6)}`
    );

    return { success: true, totalCost, cachedCost, creditSaved, modelFound };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown billing error";
    console.error(`[Billing] FAILED for user=${userId}:`, message);
    return {
      success: false,
      totalCost: 0,
      cachedCost: 0,
      creditSaved: 0,
      modelFound: false,
      error: message,
    };
  }
}
