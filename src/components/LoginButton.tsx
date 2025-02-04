"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ Redirect after sign-in (ONLY when status is "authenticated")
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home"); // Change to "/dashboard" if you prefer
    }
  }, [status, router]);

  return (
    <div className="flex items-center gap-4">
      {session ? (
        <div className="flex items-center space-x-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md">
          {/* Profile Image */}
          <img
            src={session.user?.image || "/default-avatar.png"}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          {/* Welcome Text */}
          <p className="text-sm font-medium">Welcome, {session.user?.name}!</p>
          {/* Logout Button */}
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2 transition-all"
        >
          <ArrowRightCircleIcon className="w-6 h-6" /> Sign in with Google
        </button>
      )}
    </div>
  );
}
