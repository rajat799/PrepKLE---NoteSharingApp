import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    noteId: { type: String, required: true },
    name: { type: String, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

CommentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
