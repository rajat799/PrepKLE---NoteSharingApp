import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";
import { verifyAdminToken } from "@/lib/auth-server";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const branch = searchParams.get("branch");
    const semester = searchParams.get("semester");
    const subject = searchParams.get("subject");

    const query: any = {};
    if (branch) query.branch = branch;
    if (semester) query.semester = semester;
    if (subject) query.subject = subject;

    if (status) {
      if (status === "pending") {
        const isAdmin = await verifyAdminToken(req);
        if (!isAdmin) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        query.status = "pending";
      } else {
        query.status = status;
      }
    } else {
      // By default, if no status is specified, only return approved notes
      // unless they are authenticated as admins.
      const isAdmin = await verifyAdminToken(req);
      if (!isAdmin) {
        query.status = "approved";
      }
    }

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
