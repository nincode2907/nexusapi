import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import KeysManager from "./KeysManager";

export default async function KeysPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      maskedKey: true,
      name: true,
      createdAt: true,
      status: true,
      lastUsed: true,
    }
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col gap-2 border-b border-border/60 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Quản lý API Keys</h1>
        <div className="text-sm text-muted-foreground w-full max-w-3xl leading-relaxed mt-1 space-y-3">
          <p>
            Quản lý và cấp quyền truy cập vào hệ thống NexusAPI thông qua các khóa bảo mật dưới đây. Để đảm bảo an toàn cho tài khoản, vui lòng lưu ý:
          </p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li><span className="font-semibold text-foreground">Bảo mật tuyệt đối:</span> Không commit API Key lên các public repository (như GitHub) và tuyệt đối không gọi API trực tiếp từ phía máy khách (Trình duyệt/Frontend/Mobile App).</li>
            <li><span className="font-semibold text-foreground">Cơ chế phòng vệ:</span> Nhằm bảo vệ số dư Credit của bạn, hệ thống sẽ tự động vô hiệu hóa bất kỳ API Key nào nếu phát hiện dấu hiệu rò rỉ công khai trên Internet. Hoặc nếu bạn phát hiện, hãy nhanh chóng xóa API Key hoặc báo cáo với chúng tôi <span className="font-bold text-foreground">ngay lập tức</span>.</li>
            <li><span className="font-semibold text-foreground">Minh bạch chi phí:</span> Lượng token tiêu thụ và chi phí tương ứng của từng Key được thống kê chi tiết theo thời gian thực tại trang Dashboard.</li>
          </ul>
        </div>
      </div>

      <KeysManager initialKeys={keys} />
    </div>
  );
}
