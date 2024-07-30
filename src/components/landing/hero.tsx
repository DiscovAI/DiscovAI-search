import { Icons } from "@/components/shared/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TypingTitle } from "./typing-title";
import { SubscribeForm } from "./wailtlist";

export default async function HeroLanding() {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <Link
          href="https://x.com/ruiyanghim/status/1816801501161062674"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4"
          )}
          target="_blank"
        >
          <span className="mr-3">🎉</span>
          <span className="hidden md:flex">Introducing&nbsp;</span> DiscovAI on{" "}
          <Icons.twitter className="ml-2 size-3.5" />
        </Link>

        <TypingTitle />

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-base sm:leading-8 lg:text-xl"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Stay ahead in AI with DiscovAI, Your Go-To Source for the Latest
          <span className="text-tint">
            {" "}
            AI Products | News | Companies | Models
          </span>
        </p>
        <SubscribeForm />
      </div>
    </section>
  );
}
