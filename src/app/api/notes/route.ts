import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const branch = searchParams.get("branch");
    const semester = searchParams.get("semester");
    const subject = searchParams.get("subject");

    const query: any = {};
    if (status) query.status = status;
    if (branch) query.branch = branch;
    if (semester) query.semester = semester;
    if (subject) query.subject = subject;

    // Sort by createdAt descending
    const notes = await Note.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(notes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Create note with pending status
    const newNote = new Note({
      ...body,
      likes: 0,
      status: "pending",
    });

    await newNote.save();
    
    return NextResponse.json({ id: newNote._id.toString(), ...newNote.toJSON() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
