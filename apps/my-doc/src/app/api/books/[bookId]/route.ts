import { NextResponse } from "next/server";
import { getBookById } from "@/lib/books";

type RouteParams = {
  params: Promise<{
    bookId: string;
  }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const book = getBookById(resolvedParams.bookId);
    
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    
    return NextResponse.json({ book });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}
