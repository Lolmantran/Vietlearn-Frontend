"use client";

import { useState } from "react";
import { BookOpen, MessageSquare, PenLine, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { GeneratedLesson } from "@/types";
import { cn } from "@/lib/utils/cn";

interface GeneratedLessonViewProps {
  lesson: GeneratedLesson;
  onAddVocabToDeck?: (words: string[]) => void;
}

export function GeneratedLessonView({ lesson, onAddVocabToDeck }: GeneratedLessonViewProps) {
  const [expandedDialogue, setExpandedDialogue] = useState(true);
  const [expandedVocab, setExpandedVocab] = useState(true);
  const [expandedPractice, setExpandedPractice] = useState(false);
  const [checkedAnswers, setCheckedAnswers] = useState<Record<number, string>>({});

  return (
    <div className="max-w-2xl space-y-4">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 text-white p-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="info" className="capitalize text-xs">{lesson.level?.replace("_", " ")}</Badge>
          <Badge variant="default" className="text-xs">{lesson.topic}</Badge>
        </div>
        <h2 className="text-xl font-bold mb-1">{lesson.title}</h2>
        {lesson.culturalNote && (
          <p className="text-teal-100 text-sm mt-2 border-t border-white/20 pt-2">
            💡 {lesson.culturalNote}
          </p>
        )}
      </div>

      {/* Vocabulary */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          onClick={() => setExpandedVocab((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-teal-600" />
            <span className="font-semibold text-slate-800">Vocabulary ({lesson.vocabulary.length} words)</span>
          </div>
          {expandedVocab ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        {expandedVocab && (
          <div>
            <div className="divide-y divide-slate-100">
              {lesson.vocabulary.map((v, i) => (
                <div key={i} className="px-5 py-3 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-semibold text-teal-700 mr-2">{v.vietnamese}</span>
                    <span className="text-xs text-slate-400">{v.pronunciation}</span>
                    <p className="text-sm text-slate-600 mt-0.5">{v.english}</p>
                    <p className="text-xs text-slate-400 italic mt-0.5">{v.exampleSentence}</p>
                  </div>
                </div>
              ))}
            </div>
            {onAddVocabToDeck && (
              <div className="px-5 py-3 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Plus size={14} />}
                  onClick={() => onAddVocabToDeck(lesson.vocabulary.map((v) => v.vietnamese))}
                >
                  Add all to deck
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialogue */}
      {lesson.dialogue.length > 0 && (
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          onClick={() => setExpandedDialogue((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-teal-600" />
            <span className="font-semibold text-slate-800">Dialogue ({lesson.dialogue.length} lines)</span>
          </div>
          {expandedDialogue ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        {expandedDialogue && (
          <div className="px-5 pb-4 space-y-3">
            {lesson.dialogue.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3",
                  line.speaker === "B" ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    line.speaker === "A" ? "bg-teal-100 text-teal-700" : "bg-amber-100 text-amber-700"
                  )}
                >
                  {line.speaker}
                </div>
                <div className={cn("max-w-xs", line.speaker === "B" ? "text-right" : "")}>
                  <p className="text-sm font-semibold text-slate-800">{line.vietnamese}</p>
                  <p className="text-xs text-slate-400">{line.pronunciation}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{line.english}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Practice tasks */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          onClick={() => setExpandedPractice((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <PenLine size={16} className="text-teal-600" />
            <span className="font-semibold text-slate-800">Practice ({lesson.practiceTasks.length} tasks)</span>
          </div>
          {expandedPractice ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        {expandedPractice && (
          <div className="divide-y divide-slate-100">
            {lesson.practiceTasks.map((task, i) => {
              const answered = checkedAnswers[i];
              const isCorrect = answered?.toLowerCase() === task.answer.toLowerCase();
              return (
                <div key={i} className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-700 mb-3">{task.prompt}</p>
                  {task.type === "multiple_choice" && task.options ? (
                    <div className="grid grid-cols-2 gap-2">
                      {task.options.map((opt) => (
                        <button
                          key={opt}
                          disabled={!!answered}
                          onClick={() => setCheckedAnswers((a) => ({ ...a, [i]: opt }))}
                          className={cn(
                            "rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all text-left",
                            !answered && "border-slate-200 hover:border-teal-400",
                            answered && opt === task.answer && "border-emerald-400 bg-emerald-50 text-emerald-700",
                            answered && opt === answered && opt !== task.answer && "border-red-400 bg-red-50 text-red-700",
                            answered && opt !== task.answer && opt !== answered && "border-slate-200 text-slate-400"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        disabled={!!answered}
                        placeholder="Your answer…"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setCheckedAnswers((a) => ({ ...a, [i]: (e.target as HTMLInputElement).value }));
                          }
                        }}
                        className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                      />
                      <button
                        className="rounded-xl bg-teal-600 text-white px-3 py-2 text-sm font-medium hover:bg-teal-700"
                        onClick={(e) => {
                          const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                          setCheckedAnswers((a) => ({ ...a, [i]: input.value }));
                        }}
                      >Check</button>
                    </div>
                  )}
                  {answered && (
                    <p className={cn("mt-2 text-xs font-medium", isCorrect ? "text-emerald-600" : "text-red-600")}>
                      {isCorrect ? "✓ Correct!" : `✗ Answer: ${task.answer}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
