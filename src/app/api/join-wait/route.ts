import { NextRequest } from "next/server";
import { supabase } from "@/db/supabase";

async function postHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify("Invalid email format"), {
        status: 400,
      });
    }
    const { error, data } = await supabase
      .from("searchzero-waitlist")
      .insert({
        email_address: email,
      })
      .select();
    if (error) {
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({
            isSuc: true,
            code: 0,
            msg: "Already subscribed",
          })
        );
      }
      throw error;
    }
    if (data && data.length) {
      return new Response(
        JSON.stringify({
          isSuc: true,
          code: 0,
          msg: "Subscription successful",
        })
      );
    }
  } catch (error) {
    console.error(error);

    return new Response("Failed to subscribe, pleas Try again", {
      status: 501,
    });
  }
}

export const POST = postHandler;
export const runtime = "edge";
