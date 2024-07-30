"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  duration?: number;
  className?: string;
  textList: string[];
}

export default function TypingAnimation({
  duration = 200,
  className,
  textList,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [i, setI] = useState<number>(0);
  const [wordI, setWordI] = useState(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < textList[wordI].length) {
        setDisplayedText(textList[wordI].substring(0, i + 1));
        setI(i + 1);
      } else {
        setTimeout(() => {
          setWordI((wordI + 1) % textList.length);
          setI(0);
        }, 1000);
        // clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [duration, i, wordI]);

  return (
    <h1
      className={cn(
        "font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
        className
      )}
    >
      {displayedText ? displayedText : textList[wordI]}
    </h1>
  );
}
