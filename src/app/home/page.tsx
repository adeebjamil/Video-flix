"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftOnRectangleIcon, FilmIcon, UserCircleIcon, VideoCameraIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) {
          console.error("Failed to fetch videos: ", res.statusText);
          throw new Error("Failed to fetch videos");
        }
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-700">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-black/30 backdrop-blur-xl p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-2">
            <VideoCameraIcon className="h-8 w-8 text-purple-500" />
            VideoFlix
          </h2>
          
          <nav className="space-y-4">
            <a className="flex items-center gap-2 text-white/80 hover:text-white transition-colors" href="#">
              <FilmIcon className="h-5 w-5" />
              My Videos
            </a>
          </nav>
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Profile Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Profile" className="h-20 w-20 rounded-full" />
            ) : (
              <UserCircleIcon className="h-20 w-20 text-white/80" />
            )}
            <div>
              <h1 className="text-4xl font-bold text-white">Welcome, {session?.user?.name}!</h1>
              <p className="text-purple-400">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* My Uploaded Videos */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">My Uploaded Videos</h2>
          {videos.length === 0 ? (
            <p className="text-white/80">No videos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.map((video: any) => (
                <div key={video._id} className="bg-gray-800 p-4 rounded-lg">
                  <video controls className="w-full h-48 object-cover rounded-lg">
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                  <h3 className="text-white text-lg mt-2">{video.title}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
