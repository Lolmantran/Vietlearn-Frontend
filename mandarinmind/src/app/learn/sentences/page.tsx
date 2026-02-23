"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs } from "@/components/ui/Tabs";
import { TranslationPractice } from "@/components/sentences/TranslationPractice";
import { PatternDrill } from "@/components/sentences/PatternDrill";
import { Shuffle, Languages } from "lucide-react";

export default function SentencesPage() {
  return (
    <AppLayout title="Sentence Practice">
      <Tabs
        tabs={[
          { id: "pattern", label: "Pattern drills", icon: <Shuffle size={14} /> },
          { id: "translation", label: "Translation practice", icon: <Languages size={14} /> },
        ]}
        variant="underline"
      >
        {(active) => (
          <>
            {active === "pattern" && <PatternDrill />}
            {active === "translation" && <TranslationPractice />}
          </>
        )}
      </Tabs>
    </AppLayout>
  );
}
