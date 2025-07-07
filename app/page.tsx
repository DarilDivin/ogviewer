"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { motion } from "motion/react";
import WebAnalyzerForm, { AnalysisType } from "@/components/WebAnalyzerForm";
import SEOAnalysis from "@/components/SEOAnalysis";
import TechnologyDetection from "@/components/TechnologyDetection";
import PerformanceAnalysis from "@/components/PerformanceAnalysis";
import Link from "next/link";
import DarkModeToggle from "@/components/dark-mode-togggle";

type Metadata = {
  title: string;
  description: string;
  image?: string;
  url: string;
  seo?: any;
  technologies?:
    | {
        frameworks: string[];
        cms: string[];
        analytics: string[];
        libraries: string[];
        cdn: string[];
        servers: string[];
        languages: string[];
        databases: string[];
        ecommerce: string[];
        marketing: string[];
      }
    | string[];
  technologiesDetailed?: {
    technologies: Array<{
      name: string;
      confidence: number;
      icon?: string;
      website?: string;
      categories: string[];
      version?: string;
    }>;
    categorized: {
      [category: string]: Array<{
        name: string;
        confidence: number;
        icon?: string;
        website?: string;
        categories: string[];
        version?: string;
      }>;
    };
    stats?: {
      totalPatternsChecked: number;
      detectionTime: number;
      htmlSize: number;
    };
  };
  performance?: any;
};

export default function Lookup() {
  const [url, setUrl] = useState("https://daril.fr");
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const handleAnalysis = async (
    newUrl: string,
    newAnalysisType: AnalysisType
  ) => {
    setUrl(newUrl);
    await fetchMetadata(newUrl, newAnalysisType);
  };

  const fetchMetadata = async (
    targetUrl: string,
    targetAnalysis: AnalysisType
  ) => {
    setError("");
    setMetadata(null);
    setScreenshot(null);
    setLoading(true);

    if (!/^https?:\/\//.test(targetUrl)) {
      setError(
        "Veuillez entrer une URL valide commençant par http:// ou https://."
      );
      setLoading(false);
      return;
    }

    try {
      // Fetch metadata with selected analysis type
      const response = await axios.get(
        `/api/metadata?url=${encodeURIComponent(
          targetUrl
        )}&analysis=${targetAnalysis}`
      );
      setMetadata(response.data);
      console.log(response);

      // Fetch screenshot only for basic analysis to avoid long loading times
      if (targetAnalysis === "basic" || targetAnalysis === "full") {
        try {
          const screenshotResponse = await axios.post(
            `/api/metadata?url=${encodeURIComponent(targetUrl)}`,
            null,
            {
              responseType: "arraybuffer",
            }
          );
          const base64Image = `data:image/png;base64,${Buffer.from(
            screenshotResponse.data,
            "binary"
          ).toString("base64")}`;
          setScreenshot(base64Image);
        } catch (screenshotError) {
          console.warn("Screenshot failed:", screenshotError);
          // Continue without screenshot
        }
      }
    } catch (err) {
      setError("Impossible de récupérer les métadonnées. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-background/80 border-b border-border backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-sm">OG</span>
              </div>
              <span className="font-semibold text-xl text-foreground">
                ogviewer
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <DarkModeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto">
        {" "}
        {/* px-4 sm:px-6 lg:px-8 */}
        <section className="border-b border-border relative">
          {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.3)_1px,transparent_0)] [background-size:20px_20px] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_0%,transparent_100%)]"></div> */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.3)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.2)_1px,transparent_0)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_90%_80%_at_center_bottom,black_0%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_90%_60%_at_center_bottom,black_0%,transparent_100%)]"></div>

            <div className="pt-20 pb-16 px-4 text-center max-w-5xl mx-auto border-x border-border relative z-10 bg-linear-to-t from-primary/30 to-transparent to-80%">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground mb-8"
            >
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Découvrez l'analyse avancée
              <span className="ml-2 text-muted-foreground">→</span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="text-5xl md:text-6xl font-normal text-foreground mb-4">
              Analysez votre site web avec
              <br />
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                des super-pouvoirs
              </span>
              </h1>
              <p className="text-lg text-muted-foreground/60 max-w-xl mx-auto leading-relaxed">
              Ogviewer est la plateforme moderne d’analyse de sites web pour les développeurs,
              marketeurs et équipes de croissance
              </p>
            </motion.div>

            {/* Analyzer Section */}
            <motion.div
              id="analyzer"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-muted/50 max-w-2xl mx-auto rounded-2xl p-8 shadow-sm border border-border">
                <WebAnalyzerForm
                  onSubmit={handleAnalysis}
                  loading={loading}
                  defaultUrl={url}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
        {!metadata && <div className="h-36 md:h-84"></div>}
        {/* Results Section */}
        <section className="border-b">
          <div className="text-center max-w-5xl mx-auto border-x border-border relative z-10">
            {metadata && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto pb-20"
              >
                {/* Basic Metadata Display */}
                <div className="p-8 flex flex-col md:flex-row gap-4">
                  <div className="bg-card rounded-xl border border-border w-full md:w-1/2">
                    {metadata.image && (
                      <div>
                        <div className="relative w-full mb-1 rounded-t-xl overflow-hidden bg-muted">
                          <Image
                            src={metadata.image}
                            // src={"/og.png"}
                            alt="Preview"
                            width={1200}
                            height={630}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        </div>
                        <div className="h-fit w-full bg-background/100 p-4 text-left rounded-xl">
                          <h3 className="text-xl font-bold text-foreground">
                            {metadata.title}
                            {/* Titre de la page */}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-2 mb-4 text-ellipsis line-clamp-2">
                            {metadata.description}
                          </p>
                          <a
                            href={metadata.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                          >
                            {metadata.url}
                            {/* https://example.com */}
                            <span className="ml-1">↗</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col gap-4">
                    {/* PageSpeed Insights Scores Block */}
                    {metadata?.performance && (
                      <div className="bg-card rounded-xl  border-border p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-sm">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </div>
                          <div>
                            <span className="text-lg text-left font-semibold text-foreground">
                              PageSpeed Insights Scores
                            </span>
                            <p className="text-xs text-left text-muted-foreground">
                              Performance Overview
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {metadata.performance.performanceScore !==
                            undefined && (
                            <div
                              className={`rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 ${
                                metadata.performance.performanceScore >= 90
                                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                                  : metadata.performance.performanceScore >= 50
                                  ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                                  : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                  Performance
                                </span>
                                <div
                                  className={`w-3 h-3 rounded-full shadow-sm ${
                                    metadata.performance.performanceScore >= 90
                                      ? "bg-green-500"
                                      : metadata.performance.performanceScore >=
                                        50
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}
                                ></div>
                              </div>
                              <div
                                className={`text-3xl font-black ${
                                  metadata.performance.performanceScore >= 90
                                    ? "text-green-700 dark:text-green-400"
                                    : metadata.performance.performanceScore >=
                                      50
                                    ? "text-amber-700 dark:text-amber-400"
                                    : "text-red-700 dark:text-red-400"
                                }`}
                              >
                                {metadata.performance.performanceScore}
                              </div>
                            </div>
                          )}

                          {metadata.performance.accessibilityScore !==
                            undefined && (
                            <div
                              className={`rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 ${
                                metadata.performance.accessibilityScore >= 90
                                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                                  : metadata.performance.accessibilityScore >=
                                    50
                                  ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                                  : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                  Accessibilité
                                </span>
                                <div
                                  className={`w-3 h-3 rounded-full shadow-sm ${
                                    metadata.performance.accessibilityScore >=
                                    90
                                      ? "bg-green-500"
                                      : metadata.performance
                                          .accessibilityScore >= 50
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}
                                ></div>
                              </div>
                              <div
                                className={`text-3xl font-black ${
                                  metadata.performance.accessibilityScore >= 90
                                    ? "text-green-700 dark:text-green-400"
                                    : metadata.performance.accessibilityScore >=
                                      50
                                    ? "text-amber-700 dark:text-amber-400"
                                    : "text-red-700 dark:text-red-400"
                                }`}
                              >
                                {metadata.performance.accessibilityScore}
                              </div>
                            </div>
                          )}

                          {metadata.performance.bestPracticesScore !==
                            undefined && (
                            <div
                              className={`rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 ${
                                metadata.performance.bestPracticesScore >= 90
                                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                                  : metadata.performance.bestPracticesScore >=
                                    50
                                  ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                                  : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                  Pratiques
                                </span>
                                <div
                                  className={`w-3 h-3 rounded-full shadow-sm ${
                                    metadata.performance.bestPracticesScore >=
                                    90
                                      ? "bg-green-500"
                                      : metadata.performance
                                          .bestPracticesScore >= 50
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}
                                ></div>
                              </div>
                              <div
                                className={`text-3xl font-black ${
                                  metadata.performance.bestPracticesScore >= 90
                                    ? "text-green-700 dark:text-green-400"
                                    : metadata.performance.bestPracticesScore >=
                                      50
                                    ? "text-amber-700 dark:text-amber-400"
                                    : "text-red-700 dark:text-red-400"
                                }`}
                              >
                                {metadata.performance.bestPracticesScore}
                              </div>
                            </div>
                          )}

                          {metadata.performance.seoScore !== undefined && (
                            <div
                              className={`rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 ${
                                metadata.performance.seoScore >= 90
                                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                                  : metadata.performance.seoScore >= 50
                                  ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                                  : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                  SEO
                                </span>
                                <div
                                  className={`w-3 h-3 rounded-full shadow-sm ${
                                    metadata.performance.seoScore >= 90
                                      ? "bg-green-500"
                                      : metadata.performance.seoScore >= 50
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}
                                ></div>
                              </div>
                              <div
                                className={`text-3xl font-black ${
                                  metadata.performance.seoScore >= 90
                                    ? "text-green-700 dark:text-green-400"
                                    : metadata.performance.seoScore >= 50
                                    ? "text-amber-700 dark:text-amber-400"
                                    : "text-red-700 dark:text-red-400"
                                }`}
                              >
                                {metadata.performance.seoScore}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Analysis Results Grid */}
                {/* <div className="grid gap-8 p-4 md:p-8">
                  {metadata?.performance && (
                    <PerformanceAnalysis 
                      performance={metadata.performance} 
                      screenshot={screenshot}
                    />
                  )}
                </div> */}
              </motion.div>
            )}
          </div>
        </section>
        <section className="border-b">
          <div className="text-center max-w-5xl mx-auto border-x border-border relative z-10">
            {metadata?.performance && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto"
              >
                {/* Analysis Results Grid */}
                {metadata && (
                  <div className="grid gap-8 p-4 md:p-8">
                    {/* {metadata?.seo && <SEOAnalysis seo={metadata.seo} />}
                  {metadata?.technologies && (
                    <TechnologyDetection
                      technologies={metadata.technologies}
                      // technologiesDetailed={metadata.technologiesDetailed}
                    />
                  )} */}
                    {metadata?.performance && (
                      <PerformanceAnalysis
                        performance={metadata.performance}
                        screenshot={screenshot}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </section>
        <footer className="bg-background/80 border-t border-border backdrop-blur-md py-8 w-full  z-40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 text-center flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Made with ❤️ by{" "}
              <Link
                href="https://daril.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                Daril
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} ogviewer. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
