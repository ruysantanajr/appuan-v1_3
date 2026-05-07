"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [carregando, setCarregando] = useState(false);

  async function entrarComGoogle() {
    setCarregando(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: "#170024" }}
    >
      {/* Glow ambiente central */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(58,17,101,0.55) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8">
        {/* Logo + taglines */}
        <div className="flex select-none flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="appuan"
            width={220}
            height={80}
            priority
            className="object-contain"
            style={{ mixBlendMode: "screen" }}
          />
          <p className="mt-3 text-base font-normal text-white/80">
            tudo que importa, em um só lugar
          </p>
          <p
            className="mt-1 text-xs tracking-widest"
            style={{ color: "#d8b4fe", opacity: 0.6 }}
          >
            gerencie · organize · realize
          </p>
        </div>

        {/* Divider com glow */}
        <div
          className="h-px w-16"
          style={{
            background:
              "linear-gradient(90deg, transparent, #7C3AED 50%, transparent)",
          }}
        />

        {/* Card glassmorphism */}
        <div
          className="flex w-full flex-col items-center gap-5 rounded-2xl px-8 py-6"
          style={{
            background: "rgba(58, 17, 101, 0.45)",
            border: "1px solid rgba(192, 132, 252, 0.18)",
            boxShadow:
              "0 8px 40px rgba(124, 58, 237, 0.18), 0 1px 0 rgba(192,132,252,0.08) inset",
            backdropFilter: "blur(16px)",
          }}
        >
          <button
            onClick={entrarComGoogle}
            disabled={carregando}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-800 shadow-md transition-all duration-150 hover:scale-[1.02] hover:bg-gray-50 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            <GoogleIcon />
            {carregando ? "Redirecionando..." : "Entrar com Google"}
          </button>

          <p className="text-center text-xs leading-relaxed text-purple-300/40">
            Ao entrar, você concorda com os nossos{" "}
            <Link
              href="/termos"
              className="underline transition-colors hover:text-purple-300/70"
            >
              Termos de Uso
            </Link>
          </p>
        </div>
      </div>

      {/* Glow ambiente inferior */}
      <div
        className="pointer-events-none fixed bottom-0 left-1/2 h-[200px] w-[500px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(124,58,237,0.2) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
