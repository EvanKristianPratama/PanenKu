import { NextResponse } from "next/server";
import { mongoService } from "@/services/mongoService";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
        }

        const result = await mongoService.register(name, email, password);
        return NextResponse.json({ success: true, user: result.user });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Gagal mendaftar" }, { status: 400 });
    }
}
