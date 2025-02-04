"use client";
import { useEffect, useState } from "react";
import VideoCard from "@/components/VideoCard";

interface Video {
  _id: string;
  title: string;
  url: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch("/api/videos/getVideos");
      const data = await res.json();
      setVideos(data);
    };

    fetchVideos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Uploaded Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <VideoCard key={video._id} title={video.title} url={video.url} />
        ))}
      </div>
    </div>
  );
}
