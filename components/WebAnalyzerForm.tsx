"use client";

import { useState } from "react";
import {
  Loader2,
  Search,
  Globe,
  BarChart3,
  Zap,
  Rocket,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type AnalysisType = "basic" | "seo" | "tech" | "performance" | "full";

interface WebAnalyzerFormProps {
  onSubmit: (url: string, analysisType: AnalysisType) => void;
  loading?: boolean;
  defaultUrl?: string;
}

const analysisOptions = [
  {
    id: "basic" as AnalysisType,
    label: "OG Viewer",
    icon: Image,
  },
  // {
  //   id: "seo" as AnalysisType,
  //   label: "SEO",
  //   icon: BarChart3,
  // },
  // {
  //   id: "performance" as AnalysisType,
  //   label: "Performance",
  //   icon: Zap,
  // },
  {
    id: "full" as AnalysisType,
    label: "Analyse complète",
    icon: Rocket,
  },
];

export default function WebAnalyzerForm({
  onSubmit,
  loading = false,
  defaultUrl = "",
}: WebAnalyzerFormProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [selectedAnalysis, setSelectedAnalysis] =
    useState<AnalysisType>("basic");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim(), selectedAnalysis);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* URL Input Section */}
        <div className="space-y-4">
          <div className="flex">
            <div className="relative flex-1">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 pl-12 pr-4 text-base border-border rounded-xl focus:border-primary focus:ring-primary bg-background"
                disabled={loading}
                required
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Button
                type="submit"
                disabled={loading || !url.trim()}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyse...
                  </>
                ) : (
                  "Analyser"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Analysis Type Selection */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {analysisOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedAnalysis === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedAnalysis(option.id)}
                  className={cn(
                    "inline-flex items-center justify-center gap-1 rounded-lg p-2 text-xs font-medium transition-colors",
                    "border border-border hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background"
                  )}
                  disabled={loading}
                >
                  <Icon className="w-4 h-4 text-foreground/70" />
                  <span className="">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}
