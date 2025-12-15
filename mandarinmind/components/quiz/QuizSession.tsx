"use client";

import { useState } from "react";
import { QuizQuestion, QuizAnswer } from "@/types/quiz";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";

interface QuizSessionProps {
  questions: QuizQuestion[];
  onComplete: (results: QuizSessionResults) => void;
}

export interface QuizSessionResults {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number; // percentage
  answers: QuizAnswer[];
  timeSpent: number; // in seconds
}

export function QuizSession({ questions, onComplete }: QuizSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (userAnswer: string, isCorrect: boolean) => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      vocabularyId: currentQuestion.vocabularyId,
      userAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      const correctCount = updatedAnswers.filter((a) => a.isCorrect).length;
      const totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      onComplete({
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        incorrectAnswers: questions.length - correctCount,
        score: Math.round((correctCount / questions.length) * 100),
        answers: updatedAnswers,
        timeSpent: totalTimeSpent,
      });
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setQuestionStartTime(Date.now());
      }, 1500);
    }
  };

  const correctAnswers = answers.filter((a) => a.isCorrect).length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress header */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="text-lg">
            Question {currentQuestionIndex + 1} of {questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={currentQuestionIndex + 1}
            max={questions.length}
            color="purple"
            showPercentage
          />
          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Correct: {correctAnswers}</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span>Incorrect: {answers.length - correctAnswers}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span>
                Score: {answers.length > 0 ? Math.round((correctAnswers / answers.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz question */}
      <QuizQuestionCard question={currentQuestion} onAnswer={handleAnswer} />
    </div>
  );
}
