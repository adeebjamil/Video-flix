"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between">
      <h1 className="text-xl">🎥 Video Hosting App</h1>
      <div>
        {session ? (
          <>
            <span>Welcome, {session.user?.name}</span>
            <button onClick={() => signOut()} className="ml-4 bg-red-500 px-3 py-1 rounded">
              Sign Out
            </button>
          </>
        ) : (
          <button onClick={() => signIn("google")} className="bg-blue-500 px-3 py-1 rounded">
            Sign In with Google
          </button>
        )}
      </div>
    </nav>
  );
}
