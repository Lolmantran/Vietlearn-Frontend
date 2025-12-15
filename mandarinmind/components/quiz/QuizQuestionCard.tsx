"use client";

import { useState } from "react";
import { QuizQuestion } from "@/types/quiz";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getGoogleTTSUrl } from "@/lib/utils/audio";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  onAnswer: (answer: string, isCorrect: boolean) => void;
}

export function QuizQuestionCard({ question, onAnswer }: QuizQuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSelectAnswer = (answer: string) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answer);
    setHasAnswered(true);
    const isCorrect = answer === question.correctAnswer;
    
    // Delay to show feedback before moving to next question
    setTimeout(() => {
      onAnswer(answer, isCorrect);
    }, 1500);
  };

  const handlePlayAudio = async () => {
    if (!question.audioUrl && !question.chinese) return;
    
    setIsPlayingAudio(true);
    try {
      const audioUrl = question.audioUrl || getGoogleTTSUrl(question.chinese!);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Question */}
      <Card variant="bordered">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-gray-900">{question.question}</div>
            {question.pinyin && (
              <div className="text-2xl text-blue-600 font-medium">{question.pinyin}</div>
            )}
            
            {/* Audio button for audio questions */}
            {(question.type === "audio" || question.audioUrl) && (
              <Button
                variant="outline"
                onClick={handlePlayAudio}
                disabled={isPlayingAudio}
                className="mt-4"
              >
                <Volume2 className="mr-2 h-5 w-5" />
                {question.type === "audio" ? "Play Audio" : "Hear Pronunciation"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options?.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === question.correctAnswer;
          const showFeedback = hasAnswered && (isSelected || isCorrect);

          return (
            <button
              key={index}
              onClick={() => handleSelectAnswer(option)}
              disabled={hasAnswered}
              className={cn(
                "p-6 rounded-xl border-2 text-left transition-all duration-200",
                "hover:border-blue-400 hover:bg-blue-50",
                "disabled:cursor-not-allowed",
                !hasAnswered && "border-gray-200 bg-white",
                showFeedback && isCorrect && "border-green-500 bg-green-50",
                showFeedback && isSelected && !isCorrect && "border-red-500 bg-red-50",
                !showFeedback && hasAnswered && "border-gray-200 bg-gray-50"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{option}</span>
                {showFeedback && (
                  <span className="text-2xl">
                    {isCorrect ? "✓" : isSelected ? "✗" : ""}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback message */}
      {hasAnswered && (
        <div
          className={cn(
            "text-center p-4 rounded-lg font-medium",
            selectedAnswer === question.correctAnswer
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          )}
        >
          {selectedAnswer === question.correctAnswer ? "Correct! 🎉" : "Incorrect. Keep practicing!"}
        </div>
      )}
    </div>
  );
}
