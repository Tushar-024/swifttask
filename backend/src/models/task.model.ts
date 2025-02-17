import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, required: true, enum: ["Pending", "Completed"] },
    priority: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
taskSchema.set("toJSON", {});
taskSchema.plugin(paginate);

const Task = mongoose.model("Task", taskSchema);

export default Task;
