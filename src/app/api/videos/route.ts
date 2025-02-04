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
  
      return new Promise((resolve, reject) => {
        const headers = Object.fromEntries(req.headers.entries());
        const busboy = Busboy({ headers });
  
        let title = "";
        let uploadPromise: Promise<string> | null = null;
  
        busboy.on("file", (_, file, info) => {
          uploadPromise = new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { resource_type: "video", folder: "videos" },
              (error, result) => {
                if (error) {
                  console.error("Cloudinary Upload Error:", error);
                  return reject(error);
                }
                resolve(result?.secure_url || "");
              }
            );
            file.pipe(uploadStream);
          });
        });
  
        busboy.on("field", (name, val) => {
          if (name === "title") title = val;
        });
  
        busboy.on("finish", async () => {
          if (!title || !uploadPromise) {
            return resolve(
              NextResponse.json({ message: "Title and video file are required" }, { status: 400 })
            );
          }
  
          try {
            const cloudinaryUrl = await uploadPromise;
            const newVideo = new Video({ title, videoUrl: cloudinaryUrl });
            await newVideo.save();
            
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
          const nodeStream = stream.Readable.from(req.body as any);
          nodeStream.pipe(busboy);
        } else {
          reject(NextResponse.json({ message: "Request body is null" }, { status: 400 }));
        }
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      return NextResponse.json({ message: "Failed to upload video", error: (error as Error).message }, { status: 500 });
    }
  }