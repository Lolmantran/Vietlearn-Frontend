"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ContentForm } from "@/components/content/ContentForm";
import { GeneratedLessonView } from "@/components/content/GeneratedLessonView";
import { contentApi } from "@/lib/api/contentApi";
import type { GeneratedLesson, VietnameseLevel } from "@/types";

// Mock lesson for display without backend
const MOCK_LESSON: GeneratedLesson = {
  id: "mock-1",
  title: "Street Food in Vietnam",
  topic: "Street food",
  level: "beginner",
  vocabulary: [
    { english: "pho (beef noodle soup)", vietnamese: "phở", pronunciation: "fuh", exampleSentence: "Tôi muốn ăn một tô phở bò." },
    { english: "banh mi (Vietnamese sandwich)", vietnamese: "bánh mì", pronunciation: "bahn mee", exampleSentence: "Bánh mì này ngon lắm!" },
    { english: "delicious", vietnamese: "ngon", pronunciation: "ngawn", exampleSentence: "Phở ở đây rất ngon." },
    { english: "how much?", vietnamese: "bao nhiêu?", pronunciation: "bow nyew", exampleSentence: "Tô phở này bao nhiêu tiền?" },
    { english: "to eat", vietnamese: "ăn", pronunciation: "an", exampleSentence: "Bạn muốn ăn gì?" },
  ],
  dialogue: [
    { speaker: "A", vietnamese: "Cho tôi một tô phở bò.", pronunciation: "Chaw toy muht taw fuh bah.", english: "One bowl of beef pho, please." },
    { speaker: "B", vietnamese: "Vâng, to hay nhỏ?", pronunciation: "Vang, taw hay nyaw?", english: "Of course, large or small?" },
    { speaker: "A", vietnamese: "Tô lớn, cảm ơn!", pronunciation: "Taw lun, kahm uhn!", english: "Large, thank you!" },
    { speaker: "B", vietnamese: "Tô phở này là 50 nghìn đồng.", pronunciation: "Taw fuh nay la nam muoi ngin dong.", english: "This bowl is 50,000 dong." },
  ],
  practiceTasks: [
    { type: "translate", prompt: "Translate: 'One bowl of pho, please'", answer: "Cho tôi một tô phở" },
    { type: "multiple_choice", prompt: "What does 'ngon' mean?", options: ["expensive", "delicious", "big", "small"], answer: "delicious" },
    { type: "fill_blank", prompt: "Complete: Bánh mì này ___ lắm! (This bánh mì is very __).", answer: "ngon" },
  ],
  culturalNote: "Street food is central to Vietnamese culture. Phở is eaten at any time of day and represents the warmth of Vietnamese hospitality.",
};

export default function ContentPage() {
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async ({
    type,
    content,
    level,
  }: {
    type: "text" | "topic";
    content: string;
    level: VietnameseLevel;
  }) => {
    setIsLoading(true);
    setLesson(null);
    try {
      const res = await contentApi.generateLesson({
        inputType: type === "text" ? "text" : "topic",
        text: type === "text" ? content : undefined,
        topic: type === "topic" ? content : undefined,
        level,
      });
      setLesson(res);
    } catch {
      // Use mock lesson with the selected level
      setLesson({ ...MOCK_LESSON, level, title: `${content} — Vietnamese Lesson` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Content Generator">
      {!lesson ? (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Generate a lesson</h1>
            <p className="text-slate-500">
              Choose a topic or paste text to get vocabulary, dialogue, and practice exercises tailored to your level.
            </p>
          </div>
          <ContentForm isLoading={isLoading} onSubmit={handleGenerate} />
          {isLoading && (
            <div className="mt-8 flex items-center gap-3 text-teal-600">
              <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Generating your lesson…</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setLesson(null)}
            className="text-sm text-slate-500 hover:text-teal-600 mb-6 flex items-center gap-1 transition-colors"
          >
            ← Generate another lesson
          </button>
          <GeneratedLessonView lesson={lesson} />
        </div>
      )}
    </AppLayout>
  );
}
