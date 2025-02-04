import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";
import path from "path";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import Busboy from "busboy";
import stream from "stream";
import cloudinary from "@/lib/cloudinary";

const pump = promisify(pipeline);

export const config = {
    api: {
      bodyParser: false, // Disable body parsing
    },
  };

// ✅ GET: Fetch Videos
export async function GET() {
    try {
      await connectDB();
      const videos = await Video.find({});
      
      return NextResponse.json(videos, { status: 200 });
    } catch (error) {
      console.error("Error fetching videos:", error);
      return NextResponse.json({ message: "Failed to fetch videos", error: (error as Error).message }, { status: 500 });
    }
  }

// ✅ POST: Upload Video to Cloudinary
export async function POST(req: Request) {
    try {
      await connectDB();
      console.log("Connected to MongoDB");
  
      return new Promise((resolve, reject) => {
        const headers = Object.fromEntries(req.headers.entries());
        const busboy = Busboy({ headers });
  
        let title = "";
        let uploadPromise: Promise<string> | null = null;
  
        busboy.on("file", (_, file, info) => {
          console.log("File received:", info);
  
          uploadPromise = new Promise<string>((resolve, reject) => {
            console.log("Uploading to Cloudinary...");
  
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: "video",
                folder: "videos",
                format: "mp4",
                quality: "auto:best",
                transformation: [
                  { fetch_format: "mp4" },
                  { video_codec: "auto" },
                  { width: "1920", height: "1080", crop: "limit" },
                ],
              },
              (error, result) => {
                if (error) {
                  console.error("Cloudinary Upload Error:", error);
                  return reject(error);
                }
                console.log("Cloudinary Upload Successful:", result?.secure_url);
                resolve(result?.secure_url || "");
              }
            );
            file.pipe(uploadStream);
          });
        });
  
        busboy.on("field", (name, val) => {
          console.log(`Received field: ${name} = ${val}`);
          if (name === "title") title = val;
        });
  
        busboy.on("finish", async () => {
          console.log("Busboy finished processing");
  
          if (!title || !uploadPromise) {
            console.error("Missing title or upload promise");
            return resolve(NextResponse.json({ message: "Title and video file are required" }, { status: 400 }));
          }
  
          try {
            const cloudinaryUrl = await uploadPromise;
            console.log("Saving video to MongoDB:", cloudinaryUrl);
  
            const newVideo = new Video({ title, videoUrl: cloudinaryUrl });
            await newVideo.save();
            console.log("Video saved successfully!");
  
            resolve(NextResponse.json({ message: "Video uploaded successfully!", video: newVideo }, { status: 201 }));
          } catch (error) {
            console.error("Error saving video to database:", error);
            return resolve(NextResponse.json({ message: "Failed to save video", error }, { status: 500 }));
          }
        });
  
        busboy.on("error", (err) => {
          console.error("Busboy error:", err);
          reject(NextResponse.json({ message: "File upload failed", error: (err as Error).message }, { status: 500 }));
        });
  
        if (req.body) {
          console.log("Streaming request body...");
          const nodeStream = stream.Readable.from(req.body as any);
          nodeStream.pipe(busboy);
        } else {
          console.error("Request body is null");
          reject(NextResponse.json({ message: "Request body is null" }, { status: 400 }));
        }
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      return NextResponse.json({ message: "Failed to upload video", error: (error as Error).message }, { status: 500 });
    }
  }
  