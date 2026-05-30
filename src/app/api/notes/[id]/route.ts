import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";
import { verifyAdminToken } from "@/lib/auth-server";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await dbConnect();
    const note = await Note.findById(params.id);
    if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(note);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await dbConnect();
    const body = await req.json();
    
    const updateData: any = {};
    if (body.action === "approve") {
      const isAdmin = await verifyAdminToken(req);
      if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      updateData.status = "approved";
    } else if (body.action === "like") {
      updateData.$inc = { likes: body.delta || 1 };
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedNote = await Note.findByIdAndUpdate(params.id, updateData, { new: true });
    return NextResponse.json(updatedNote);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdminToken(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    await dbConnect();
    await Note.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

