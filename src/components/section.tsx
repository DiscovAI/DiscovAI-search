import { cn } from "@/lib/utils";
import {
  BookOpen,
  BookOpenIcon,
  CameraIcon,
  ListOrderedIcon,
  ListPlusIcon,
  SparkleIcon,
  SparklesIcon,
  StarIcon,
  TextSearchIcon,
} from "lucide-react";

import { motion } from "framer-motion";

export const Section = ({
  title,
  children,
  animate = true,
  streaming = false,
}: {
  title: "Sources" | "Answer" | "Related" | "Images" | "More Results";
  children: React.ReactNode;
  animate?: boolean;
  streaming?: boolean;
}) => {
  const iconMap = {
    Sources: BookOpenIcon,
    Answer: SparkleIcon,
    Related: ListPlusIcon,
    Images: CameraIcon,
    "More Results": ListOrderedIcon,
  };

  const IconComponent = iconMap[title] || StarIcon;

  return (
    <div
      className={cn(
        "flex flex-col mb-8",
        animate ? "animate-in fade-in duration-1000 ease-out" : ""
      )}
    >
      <div className="flex items-center space-x-2">
        {title === "Answer" && streaming ? (
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          >
            <IconComponent size={22} />
          </motion.div>
        ) : (
          <IconComponent size={22} />
        )}
        <div className="text-lg font-medium">{title}</div>
      </div>
      <div className="pt-1">{children}</div>
    </div>
  );
};
