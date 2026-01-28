import { NextResponse } from "next/server";
import { getDocsTree } from "@/lib/docs";

export async function GET() {
  try {
    const tree = getDocsTree();
    return NextResponse.json({ tree });
  } catch (error) {
    console.error("Error fetching docs tree:", error);
    return NextResponse.json({ error: "Failed to fetch docs tree" }, { status: 500 });
  }
}
