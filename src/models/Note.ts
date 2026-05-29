import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: String, required: true },
    subject: { type: String, required: true },
    courseCode: { type: String, required: false },
    description: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    noteType: { type: String, required: true },
    examType: { type: String, required: false },
    tags: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    uploadedBy: { type: String, required: false },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Transform _id to id when returning JSON
NoteSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
