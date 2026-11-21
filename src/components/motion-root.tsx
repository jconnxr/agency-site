"use client";

import { MotionConfig } from "motion/react";
import { IntakeProvider } from "./intake";

// reducedMotion="user": Motion drops transform/layout animation for people who
// ask for reduced motion. Loops and parallax also check it themselves and stop.
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <IntakeProvider>{children}</IntakeProvider>
    </MotionConfig>
  );
}
