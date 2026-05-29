import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    addedBy: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

AdminSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
