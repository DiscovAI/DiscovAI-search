"use client";

import { useEffect, useState } from "react";
import {
  TypewriterEffect,
  TypewriterEffectSmooth,
} from "../ui/typewriter-effect";
const typingTextList = [
  {
    text: "Your",
  },
  {
    text: "Serach ",
  },
  {
    text: "Engine",
  },
  {
    text: "for ",
  },
  {
    text: "Anything",
  },
  {
    text: "About AI",
    className: "text-tint dark:text-tint",
  },
];

export function TypingTitle() {
  const [textList, setTextList] = useState(typingTextList);
  // useEffect(() => {
  //   let effect;
  //   setTimeout(() => {
  //     effect = setInterval(() => {
  //       console.log("setting");
  //       const newTextList = [...textList];
  //       newTextList[newTextList.length - 1].text = "Models";
  //       setTextList(newTextList);
  //     }, 1000);
  //   }, 2000);
  // }, []);
  return (
    <>
      <h1 className="flex lg:hidden items-center text-balance text-3xl font-extrabold tracking-tight md:text-5xl">
        Your Serach Engine for Anything About AI
      </h1>
      <h1 className="hidden lg:flex items-center text-balance text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
        <TypewriterEffectSmooth words={textList} />
      </h1>
    </>
  );
}
