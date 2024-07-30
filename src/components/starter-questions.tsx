import { ArrowRight, ArrowUpRight } from "lucide-react";

const starterQuestions = [
  "I want to make old photos high definition",
  "Tools that can help me market better on Twitter",
  "Auto-generated seo friendly blogs from my website",
  "I need an AI girlfriend with multiple roles to choose from",
];

export const StarterQuestionsList = ({
  handleSend,
}: {
  handleSend: (question: string) => void;
}) => {
  return (
    <ul className="flex flex-col space-y-2 pt-2">
      {starterQuestions.map((question) => (
        <li key={question} className="flex items-center space-x-2">
          <button
            onClick={() => handleSend(question)}
            className="flex gap-1 items-center font-normal hover:underline decoration-tint underline-offset-4 transition-all duration-200 ease-in-out transform hover:scale-[1.02] text-left break-words normal-case"
          >
            {question}
            <ArrowUpRight size={18} className="text-tint" />
          </button>
        </li>
      ))}
    </ul>
  );
};
