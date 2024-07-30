import { PlusIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
export default function MoreResults({
  results,
}: {
  results: { url: string; title: string; screenshot_url: string }[];
}) {
  return (
    <div className="divide-y border-t mt-2">
      <Accordion type="single" collapsible className="w-full">
        {results.map((res, i) => (
          <AccordionItem value={res.url} key={i}>
            <AccordionTrigger>
              <div className="text-left">{res.title}</div>
            </AccordionTrigger>
            <AccordionContent>
              <a href={res.url} target="_blank">
                <img
                  src={res.screenshot_url}
                  alt={res.title}
                  width={1920}
                  height={1080}
                  className="rounded-lg"
                />
              </a>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
