import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function GET() {
  try {
    await dbConnect();
    const admins = await Admin.find().sort({ createdAt: -1 });
    return NextResponse.json(admins);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const emailLower = body.email.trim().toLowerCase();
    
    // Check if already exists
    let admin = await Admin.findOne({ email: emailLower });
    if (!admin) {
      admin = new Admin({
        email: emailLower,
        addedBy: body.addedBy,
      });
      await admin.save();
    }
    
    return NextResponse.json({ id: admin._id.toString(), ...admin.toJSON() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const emailLower = email.trim().toLowerCase();
    await Admin.findOneAndDelete({ email: emailLower });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
