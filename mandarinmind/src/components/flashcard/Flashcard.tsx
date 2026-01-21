"use client";

import { useState } from "react";
import { Vocabulary } from "@/types/vocabulary";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Volume2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getGoogleTTSUrl } from "@/lib/utils/audio";

interface FlashcardProps {
  vocabulary: Vocabulary;
  mode: "chinese-to-english" | "english-to-chinese";
  onKnow: () => void;
  onDontKnow: () => void;
  showAnswer?: boolean;
}

export function Flashcard({ vocabulary, mode, onKnow, onDontKnow, showAnswer = false }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(showAnswer);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePlayAudio = async () => {
    setIsPlayingAudio(true);
    try {
      const audioUrl = vocabulary.audioUrl || getGoogleTTSUrl(vocabulary.chinese);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlayingAudio(false);
    }
  };

  const frontContent = mode === "chinese-to-english" ? vocabulary.chinese : vocabulary.english;
  const backContent = mode === "chinese-to-english" ? vocabulary.english : vocabulary.chinese;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Flashcard */}
      <Card
        variant="elevated"
        className={cn(
          "w-full min-h-[400px] cursor-pointer transition-all duration-300",
          "flex items-center justify-center p-8",
          isFlipped && "bg-blue-50"
        )}
        onClick={handleFlip}
      >
        <div className="text-center space-y-4">
          {!isFlipped ? (
            <>
              <div className="text-6xl font-bold text-gray-900">{frontContent}</div>
              <p className="text-gray-500 mt-4">Click to reveal</p>
            </>
          ) : (
            <>
              <div className="text-5xl font-bold text-gray-900 mb-4">{backContent}</div>
              {mode === "chinese-to-english" && (
                <div className="text-3xl text-blue-600 font-medium mb-2">{vocabulary.pinyin}</div>
              )}
              {mode === "english-to-chinese" && (
                <>
                  <div className="text-3xl text-blue-600 font-medium mb-2">{vocabulary.pinyin}</div>
                  <div className="text-2xl text-gray-700">{vocabulary.english}</div>
                </>
              )}
              
              {/* Example sentences */}
              {vocabulary.exampleSentences && vocabulary.exampleSentences.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 text-left">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Example:</p>
                  <p className="text-lg text-gray-900">{vocabulary.exampleSentences[0].chinese}</p>
                  <p className="text-sm text-blue-600 mt-1">{vocabulary.exampleSentences[0].pinyin}</p>
                  <p className="text-sm text-gray-600 mt-1">{vocabulary.exampleSentences[0].english}</p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Controls */}
      <div className="flex items-center gap-4 w-full">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePlayAudio}
          disabled={isPlayingAudio}
          className="flex-1"
        >
          <Volume2 className="mr-2 h-5 w-5" />
          Play Audio
        </Button>
        <Button variant="ghost" size="lg" onClick={handleFlip}>
          <RotateCcw className="mr-2 h-5 w-5" />
          Flip
        </Button>
      </div>

      {/* Answer buttons */}
      {isFlipped && (
        <div className="flex gap-4 w-full">
          <Button variant="danger" size="lg" onClick={onDontKnow} className="flex-1">
            I Don&apos;t Know
          </Button>
          <Button variant="primary" size="lg" onClick={onKnow} className="flex-1">
            I Know It!
          </Button>
        </div>
      )}
    </div>
  );
}
