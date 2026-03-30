import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ModelsClient from "./ModelsClient";

export const revalidate = 60;

export default async function ModelsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const rawModels = await prisma.modelPricing.findMany({
    where: { isActive: true },
    orderBy: [
      { provider: "asc" },
      { priceInPerToken: "asc" }
    ]
  });

  // Enrich with fallback status and real usage count
  const enhancedModels = rawModels.map((model: any) => {
    const modelIdLower = (model.modelId || "").toLowerCase();
    let badge = model.badge || null;
    let badgeColor = model.badgeColor || null;
    const usageCount = model.usageCount || 0; // Luôn dùng dữ liệu thực từ DB

    if (!badge && (modelIdLower.includes("gpt-4o") || modelIdLower.includes("claude-3-5"))) { 
      badge = "HOT"; 
      badgeColor = "#ef4444"; 
    } else if (!badge && (modelIdLower.includes("mini") || modelIdLower.includes("flash") || modelIdLower.includes("qwq"))) { 
      badge = "NEW"; 
      badgeColor = "#8b5cf6"; 
    }

    return { ...model, badge, badgeColor, usageCount };
  });

  return (
    <ModelsClient models={enhancedModels} />
  );
}
