"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signInWithGoogle, getSession, signOut } from "@/utils/auth";
import Image from "next/image";

export default function Header() {
  const [session, setSession] = useState(null);
  async function fetchSession() {
    const session = await getSession();
    console.log("User session:", session);
    setSession(session);
  }

  useEffect(() => {
    (async () => {
      await fetchSession();
    })();
  }, [session]);
  return (
    <header className="w-full flex flex-wrap justify-evenly h-16 py-4 bg-black/5 border-b border-gray-800">
      <Link href="/">
        <h1 className="text-4xl text-center text-white font-bold">Dashboard</h1>
      </Link>
      <nav className=" self-center flex text-white flex-row gap-3">
        <Link href={"/create"}>Create</Link>
        <Link href={"/vehicles"}>Vehicles</Link>
        <Link href={"/locations"}>Locations</Link>
      </nav>
      {session?.user ? (
        <div className="hidden sm:flex items-center gap-1">
          <div className="flex items-center gap-2 p-1 rounded-full">
            {session.user.user_metadata.avatar_url && (
              <Image
                src={session.user.user_metadata.avatar_url}
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full border border-white/12 bg-white/6"
              />
            )}
            <p className="text-[13px] text-white/45">{session.user.name}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="text-[13px] cursor-pointer text-white/45 p-2 font-medium rounded-full hover:text-white/85 hover:bg-white/5 no-underline transition-colors duration-150"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={signInWithGoogle}
          className=" border border-transparent rounded-sm text-lg font-medium text-white bg-blue-800 px-4 py-2"
        >
          Signin with google
        </button>
      )}
    </header>
  );
}
