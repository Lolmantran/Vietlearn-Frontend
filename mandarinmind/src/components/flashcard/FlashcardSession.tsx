"use client";

import { useState } from "react";
import { Vocabulary } from "@/types/vocabulary";
import { Flashcard } from "./Flashcard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle } from "lucide-react";

interface FlashcardSessionProps {
  vocabularyList: Vocabulary[];
  mode: "chinese-to-english" | "english-to-chinese";
  onComplete: (results: SessionResults) => void;
}

export interface SessionResults {
  totalCards: number;
  knownCards: number;
  unknownCards: number;
  vocabularyResults: Array<{
    vocabularyId: string;
    isCorrect: boolean;
  }>;
}

export function FlashcardSession({ vocabularyList, mode, onComplete }: FlashcardSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SessionResults>({
    totalCards: vocabularyList.length,
    knownCards: 0,
    unknownCards: 0,
    vocabularyResults: [],
  });

  const currentVocabulary = vocabularyList[currentIndex];
  const isLastCard = currentIndex === vocabularyList.length - 1;

  const handleKnow = () => {
    const newResults = {
      ...results,
      knownCards: results.knownCards + 1,
      vocabularyResults: [
        ...results.vocabularyResults,
        { vocabularyId: currentVocabulary.id, isCorrect: true },
      ],
    };
    setResults(newResults);

    if (isLastCard) {
      onComplete(newResults);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDontKnow = () => {
    const newResults = {
      ...results,
      unknownCards: results.unknownCards + 1,
      vocabularyResults: [
        ...results.vocabularyResults,
        { vocabularyId: currentVocabulary.id, isCorrect: false },
      ],
    };
    setResults(newResults);

    if (isLastCard) {
      onComplete(newResults);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress header */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="text-lg">
            Card {currentIndex + 1} of {vocabularyList.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={currentIndex + 1}
            max={vocabularyList.length}
            color="blue"
            showPercentage
          />
          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Known: {results.knownCards}</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span>Unknown: {results.unknownCards}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flashcard */}
      <Flashcard
        vocabulary={currentVocabulary}
        mode={mode}
        onKnow={handleKnow}
        onDontKnow={handleDontKnow}
      />
    </div>
  );
}
