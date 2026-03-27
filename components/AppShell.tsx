"use client";

import { useState } from "react";
import IntroLoader from "@/components/IntroLoader";
import { motion } from "framer-motion";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {!introComplete && <IntroLoader onFinish={() => setIntroComplete(true)} />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
