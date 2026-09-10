"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuizProps {
  question: string;
  options: string[];
  answer: string | number;
}

export function Quiz({ question, options, answer }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const correctAnswerIndex =
    typeof answer === "number" ? answer : options.indexOf(answer);

  const handleSelect = (index: number) => {
    if (!hasSubmitted) {
      setSelected(index);
    }
  };

  const handleSubmit = async () => {
    if (selected !== null && !hasSubmitted) {
      setHasSubmitted(true);
      const isCorrect = selected === correctAnswerIndex;
      
      try {
        await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            isCorrect
          }),
        });
      } catch (err) {
        console.error("Failed to save score", err);
      }
    }
  };

  return (
    <div className="my-6 rounded-lg border border-fd-border bg-fd-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-fd-card-foreground">
        {question}
      </h3>
      <div className="flex flex-col gap-3">
        {options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = hasSubmitted && index === correctAnswerIndex;
          const isWrong = hasSubmitted && isSelected && index !== correctAnswerIndex;

          let buttonClass =
            "flex items-center justify-between rounded-md border p-3 text-left transition-colors ";

          if (hasSubmitted) {
            if (isCorrect) {
              buttonClass += "border-green-500 bg-green-500/10 text-green-900 dark:text-green-300";
            } else if (isWrong) {
              buttonClass += "border-red-500 bg-red-500/10 text-red-900 dark:text-red-300";
            } else {
              buttonClass += "border-fd-border bg-fd-muted opacity-50";
            }
          } else {
            if (isSelected) {
              buttonClass += "border-fd-primary bg-fd-primary/10 ring-1 ring-fd-primary";
            } else {
              buttonClass += "border-fd-border bg-fd-background hover:bg-fd-accent";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={hasSubmitted}
              className={buttonClass}
            >
              <span>{option}</span>
              {hasSubmitted && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {hasSubmitted && isWrong && <XCircle className="h-5 w-5 text-red-500" />}
            </button>
          );
        })}
      </div>
      {!hasSubmitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="mt-6 rounded-md bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground transition-opacity disabled:opacity-50"
        >
          Submit Answer
        </button>
      )}
      {hasSubmitted && (
        <div className="mt-4 text-sm font-medium">
          {selected === correctAnswerIndex ? (
            <span className="text-green-600 dark:text-green-400">Correct! Well done.</span>
          ) : (
            <span className="text-red-600 dark:text-red-400">
              Incorrect. The right answer is {options[correctAnswerIndex]}.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
