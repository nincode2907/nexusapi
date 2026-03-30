import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { proxyRequest } from "@/services/proxy.service";
import { processBilling } from "@/services/billing.service";
import { createHash } from "crypto";

export const maxDuration = 10;

function errorResponse(message: string, status: number, type = "invalid_request_error") {
    return NextResponse.json(
        { error: { message, type, code: status } },
        { status }
    );
}

export async function POST(req: NextRequest) {
    const startTime = Date.now();

    try {
        // ── Step A: Auth ────────
        const authHeader = req.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer sk-nexus-'))
            return errorResponse('Missing/Invalid key.', 401, "authentication_error");

        const hashedKey = createHash("sha256")
            .update(authHeader.replace("Bearer ", "").trim())
            .digest("hex");

        const keyRecord = await prisma.apiKey.findUnique({
            where: { hashedKey },
            include: { user: true }
        });

        if (!keyRecord || keyRecord.status !== "ACTIVE")
            return errorResponse('Invalid key.', 401, "authentication_error");

        const user = keyRecord.user;
        if (user.totalCredit <= 0)
            return errorResponse(
                `Hết tiền. Số dư: ${user.totalCredit.toFixed(4)}.`,
                402,
                "insufficient_credits"
            );

        // ── Step B: Parse Body ────────
        let body: any;
        try {
            body = await req.json();
        } catch {
            return errorResponse("Invalid JSON", 400);
        }
        if (!body.model || !body.input)
            return errorResponse("Thiếu 'model' hoặc 'input'.", 400);

        // ── Step C: Model Validation ────────
        const requestedModel = body.model;
        const modelPricing = await prisma.modelPricing.findUnique({
            where: { modelId: requestedModel }
        });
        if (!modelPricing && user.role !== "ADMIN")
            return errorResponse(`Mô hình '${requestedModel}' không hỗ trợ.`, 404, "unsupported_model");

        // ── Step D: Proxy ────────
        let proxyResult;
        try {
            proxyResult = await proxyRequest({ body, endpoint: "embeddings" }); // 🌟 Gọi Embeddings URL
        } catch (error) {
            const status = (error as Error & { status?: number }).status || 502;
            const message = error instanceof Error ? error.message : "Upstream error";
            return errorResponse(`Upstream error: ${message}`, status, "upstream_error");
        }

        const { response: upstreamResponse, model } = proxyResult;
        const responseData = await upstreamResponse.json();
        const durationMs = Date.now() - startTime;

        // ── Step E: Handle Response ────────
        if (!upstreamResponse.ok) {
            // Trích xuất error message từ upstream để lưu vào UsageLog
            const upstreamError = responseData?.error?.message || JSON.stringify(responseData).slice(0, 500);
            processBilling(
                keyRecord.id,
                user.id,
                requestedModel,
                0,
                0,
                0,
                durationMs,
                upstreamResponse.status,
                upstreamError
            ).catch(console.error);
            return NextResponse.json(
                responseData,
                { status: upstreamResponse.status }
            );
        }

        if (responseData.usage) {
            processBilling(
                keyRecord.id,
                user.id,
                model,
                responseData.usage.prompt_tokens || 0,
                0,
                0,
                durationMs,
                200
            ).catch(console.error);
        }

        return NextResponse.json(responseData, {
            status: 200,
            headers: { "X-NexusAPI-Model": model }
        });

    } catch (error) {
        return errorResponse('Internal Server Error', 500);
    }
}