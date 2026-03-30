import { NextResponse } from "next/server";

// Hàm tạo JSON chuẩn format lỗi của OpenAI
const notFoundResponse = (req: Request) => {
    return NextResponse.json(
        {
            error: {
                message: `Endpoint không tồn tại (404 Not Found). Bạn đang gọi sai đường dẫn hoặc sai phương thức HTTP.`,
                type: "invalid_request_error",
                code: 404
            }
        },
        { status: 404 }
    );
};

// Bắt trọn ổ TẤT CẢ các phương thức HTTP
export const GET = notFoundResponse;
export const POST = notFoundResponse;
export const PUT = notFoundResponse;
export const PATCH = notFoundResponse;
export const DELETE = notFoundResponse;
export const OPTIONS = notFoundResponse;