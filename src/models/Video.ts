import mongoose, { Schema, Document, Model } from "mongoose";

// Define a TypeScript interface for video documents
interface IVideo extends Document {
  title: string;
  videoUrl: string;
  createdAt: Date;
}

// Define the Mongoose schema
const videoSchema = new Schema<IVideo>({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, immutable: true }, // Prevents modifications
});

// Ensure the model is only compiled once in Next.js hot reload
const Video: Model<IVideo> = mongoose.models.Video || mongoose.model<IVideo>("Video", videoSchema);

export default Video;
