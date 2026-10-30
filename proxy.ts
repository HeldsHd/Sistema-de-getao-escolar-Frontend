import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("@gestao-escolar/token")?.value

    if(!token) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    try {
        jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        return NextResponse.next();
    } catch (e) {
        console.error(e);
        return NextResponse.redirect(new URL("/", request.url))
    }
}

export const config = {
    matcher: ["/profile"],
};