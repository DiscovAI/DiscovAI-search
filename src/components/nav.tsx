"use client";

import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { useChatStore } from "@/stores";
import { useRouter } from "next/navigation";
import { SiteConfig, LinkConfig } from "@/config/sites";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Icons } from "./shared/icons";
import { cn } from "@/lib/utils";
const NewChatButton = () => {
  return (
    <Button variant="secondary" size="sm" onClick={() => (location.href = "/")}>
      <PlusIcon className="w-4 h-4" />
    </Button>
  );
};

const TextLogo = () => {
  return (
    <div className="text-2xl font-bold font-mono hidden sm:block">
      DigiMedic
    </div>
  );
};

export function Navbar() {
  const router = useRouter();
  const { theme } = useTheme();
  const { messages } = useChatStore();

  const onHomePage = messages.length === 0;

  return (
    <header className="w-full flex fixed p-1 z-50 px-2 bg-background/95 justify-between items-center">
      <div className="flex items-center gap-2 p-2">
        <Link href="/" className="flex items-center space-x-2">
          <img src="https://utfs.io/f/NyKlEsePJFL1S6Kx7l2O8nK5CrB9quV1ojygEkAcI7Xe6WzT" alt="Logo" className="w-8 h-8" />
          <span className="font-bold">{SiteConfig.name}</span>
        </Link>
        {onHomePage ? <TextLogo /> : <NewChatButton />}
      </div>
      <div className="flex items-center gap-4 pr-2">
        <ModeToggle />
        {LinkConfig.github && (
          <Link
            href={LinkConfig.github}
            target="_blank"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <GitHubLogoIcon />
          </Link>
        )}
        {LinkConfig.twitter && (
          <Link
            href={LinkConfig.twitter}
            target="_blank"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <Icons.twitter className="w-3 h-3" />
          </Link>
        )}
      </div>
    </header>
  );
}
