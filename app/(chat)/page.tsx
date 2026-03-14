"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { createNewChat } from "@/app/actions/chat";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowRightIcon } from "lucide-react";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease },
  },
};

export default function ChatHomePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNewChat = () => {
    startTransition(async () => {
      const { id } = await createNewChat();
      router.push(`/chat/${id}`);
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <motion.div
        className="flex flex-col items-center gap-5 text-center"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div className="flex items-center gap-3" variants={fadeUp}>
          <div className="size-14 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/archon-logo.png"
              alt="Archon"
              width={96}
              height={96}
              className="size-14 scale-[2.75] object-contain"
            />
          </div>

          <h1 className="font-serif text-3xl font-medium tracking-tight">
            Archon
          </h1>
        </motion.div>

        <motion.p
          className="max-w-sm text-sm leading-relaxed text-muted-foreground"
          variants={fadeUp}
        >
          Your expert cloud architect. Describe a system and I&apos;ll design
          the infrastructure for it.
        </motion.p>

        <motion.button
          type="button"
          onClick={handleNewChat}
          disabled={isPending}
          className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          variants={fadeUp}
        >
          Start a conversation
          <ArrowRightIcon className="size-3.5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
