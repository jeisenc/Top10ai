import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/auscultadores");
  revalidatePath("/robots-aspiradores");
  revalidatePath("/sapatilhas");
  revalidatePath("/fritadeiras-de-ar");
  revalidatePath("/portateis");
  revalidatePath("/protetor-solar");
  revalidatePath("/moda-verao");

  return NextResponse.json({ revalidated: true });
}
