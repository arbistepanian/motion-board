export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import prisma from "@/app/lib/prisma";

export async function GET() {
    const count = await prisma.board.count();
    return new Response(JSON.stringify({ ok: true, boards: count }), {
        headers: { "content-type": "application/json" },
    });
}
