"use client";
import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const [video, setVideo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false); // Ensure client-side rendering

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid SSR mismatch

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!video) return toast.error("Please select a video");

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", video);
    formData.append("title", "Sample Video");

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/videos", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 201) {
          toast.success("Video uploaded successfully!");
          setVideo(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          toast.error("Upload failed: " + xhr.responseText);
        }
        setUploading(false);
        setProgress(0);
      };

      xhr.onerror = () => {
        toast.error("Upload failed!");
        setUploading(false);
        setProgress(0);
      };

      xhr.send(formData);
    } catch (error) {
      toast.error("An error occurred during upload");
      console.error("Upload error:", error);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold">Upload Video</h1>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="my-4"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
      {uploading && (
        <div className="w-full max-w-xs mt-4 bg-gray-200 rounded">
          <div
            className="bg-blue-500 text-xs text-white text-center py-1 rounded"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
}
