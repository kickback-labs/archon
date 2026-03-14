"use client";

import Image from "next/image";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-accent)_0%,transparent_60%)] opacity-60" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-10 flex items-center justify-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 shrink-0 overflow-hidden rounded-full">
              <Image
                src="/archon-logo.png"
                alt="Archon"
                width={96}
                height={96}
                className="size-8 scale-[2.75] object-contain"
              />
            </div>
            <span className="font-serif text-xl font-medium tracking-tight">
              Archon
            </span>
          </Link>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
