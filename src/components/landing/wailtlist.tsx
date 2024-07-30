"use client";

import { Input } from "@/components/ui/input";
import { cn, nFormatter } from "@/lib/utils";
import { Button } from "../ui/button";
import { Icons } from "../shared/icons";
import { useState, FC } from "react";
import toast from "react-hot-toast";

import { Loader2, ChevronRight } from "lucide-react";

export function WailtList() {
  return (
    <div
      className="flex justify-center space-x-2 md:space-x-4"
      style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
    >
      <Input
        type="email"
        placeholder="Email"
        className="h-10 rounded-md px-8"
      />
      <Button size={"lg"} rounded={"full"} className={"gap-2"}>
        <span>Join Waitlist Now</span>
        <Icons.arrowRight className="size-4" />
      </Button>
    </div>
  );
}

export const SubscribeForm: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast("Please enter a valid email address", {
        id: "subscripe-toast",
      });
      return;
    }

    try {
      setLoading(true);
      toast.loading("🙏 Thank you...", { id: "subscripe-toast" });
      const response = await fetch("/api/join-waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      toast.success("👍 You have joined the wailt list of DiscovAI !", {
        id: "subscripe-toast",
      });
      setMessage("Subscription successful!");
      setEmail("");
    } catch (error: any) {
      toast.error("Something wrong happens, please try again!", {
        id: "subscripe-toast",
      });

      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubscribe}
      className="flex justify-center space-x-2 md:space-x-4"
      style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
    >
      <div className="flex-1">
        <label htmlFor="email" className="sr-only">
          Email
        </label>

        <Input
          type="email"
          placeholder="Your Email address"
          value={email}
          className="h-10 rounded-md px-8"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        size={"lg"}
        rounded={"full"}
        className={"gap-2"}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          <>
            <ChevronRight className="mr-2 h-4 w-4" />
            Join Waitlist
            {/* <Icons.arrowRight className="size-4" /> */}
          </>
        )}
      </Button>
    </form>
  );
};
