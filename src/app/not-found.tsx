import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 text-zinc-700 font-sans px-4">
            <div className="flex flex-col items-center text-center max-w-md">

                <div className="bg-yellow-100 p-4 rounded-full mb-6">
                    <AlertTriangle className="w-10 h-10 text-yellow-600" />
                </div>

                <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                    Không tìm thấy trang
                </h1>

                <p className="text-zinc-500 mb-8 leading-relaxed">
                    Trang bạn đang tìm có thể đã bị xoá, đổi đường dẫn hoặc không tồn tại.
                    Vui lòng kiểm tra lại hoặc quay về trang chính.
                </p>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    );
}