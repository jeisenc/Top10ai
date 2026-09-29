import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { CATEGORIES } from "../../../lib/site";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("secret") !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  for (const c of CATEGORIES) revalidatePath(`/${c.slug}`);

  return NextResponse.json({ revalidated: true });
}
