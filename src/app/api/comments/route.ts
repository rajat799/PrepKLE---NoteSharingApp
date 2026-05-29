import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("noteId");

    const query = noteId ? { noteId } : {};
    
    // Sort by createdAt descending
    const comments = await Comment.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(comments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const newComment = new Comment(body);
    await newComment.save();
    
    return NextResponse.json({ id: newComment._id.toString(), ...newComment.toJSON() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
