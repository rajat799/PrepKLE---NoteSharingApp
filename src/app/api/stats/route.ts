import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";

export async function GET() {
  try {
    await dbConnect();
    
    const notes = await Note.find({ status: "approved" });

    const branches = new Set(notes.map((n) => n.branch));
    const subjects = new Set(notes.map((n) => n.subject));

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUploads = notes.filter((n) => n.createdAt && new Date(n.createdAt) >= sevenDaysAgo).length;

    return NextResponse.json({
      totalNotes: notes.length,
      totalBranches: branches.size,
      totalSubjects: subjects.size,
      recentUploads: recentUploads,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
