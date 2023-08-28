"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import logo from "src/images/logo.png";

export const revalidate = 1;

const screenMinusMenu = "calc(100dvh-48px)";

export default function BetaPage() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      window.location.href = "/";
    }
  }, [user]);

  return (
    <main className={`min-h-[${screenMinusMenu}] flex flex-col justify-begin`}>
      <div
        className={`h-[${screenMinusMenu}] max-h-screen flex flex-col justify-center items-center bg-zinc-900`}
      >
        <div className="h-[10%]"></div>
        <div className="h-[50%] w-full flex flex-col justify-center items-center">
          <img src={logo.src} style={{ maxHeight: "40%" }} />
          <div className="text-3xl md:text-7xl">Paperflow</div>
        </div>
        <div className="h-[40%] w-full flex justify-center items-center">
          FORM
        </div>
      </div>
    </main>
  );
}
