"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { motion } from "motion/react";
import SEOAnalysis from "@/components/SEOAnalysis";
import TechnologyDetection from "@/components/TechnologyDetection";
import PerformanceAnalysis from "@/components/PerformanceAnalysis";

type Metadata = {
  title: string;
  description: string;
  image?: string;
  url: string;
  seo?: any;
  technologies?: {
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
  } | string[];
  performance?: any;
};

export default function Lookup() {
  const [url, setUrl] = useState("https://daril.fr");
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState("basic");

  const fetchMetadata = async () => {
    setError("");
    setMetadata(null);
    setScreenshot(null);
    setLoading(true);

    if (!/^https?:\/\//.test(url)) {
      setError("Veuillez entrer une URL valide commençant par http:// ou https://.");
      setLoading(false);
      return;
    }

    try {
      // Fetch metadata with selected analysis type
      const response = await axios.get(`/api/metadata?url=${encodeURIComponent(url)}&analysis=${analysisType}`);
      setMetadata(response.data);
      console.log(response);

      // Fetch screenshot only for basic analysis to avoid long loading times
      if (analysisType === 'basic') {
        try {
          const screenshotResponse = await axios.post(`/api/metadata?url=${encodeURIComponent(url)}`, null, {
            responseType: 'arraybuffer',
          });
          const base64Image = `data:image/png;base64,${Buffer.from(screenshotResponse.data, 'binary').toString('base64')}`;
          setScreenshot(base64Image);
        } catch (screenshotError) {
          console.warn('Screenshot failed:', screenshotError);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-start p-6 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
      >
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Analyseur de Site Web</h1>
        
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <input
            type="text"
            placeholder="Entrez une URL (ex: https://exemple.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-lg"
          />
          
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setAnalysisType("basic")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                analysisType === "basic" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              🔍 Analyse de base
            </button>
            <button
              onClick={() => setAnalysisType("seo")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                analysisType === "seo" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              📈 SEO
            </button>
            <button
              onClick={() => setAnalysisType("tech")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                analysisType === "tech" 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              ⚛️ Technologies
            </button>
            <button
              onClick={() => setAnalysisType("performance")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                analysisType === "performance" 
                  ? "bg-orange-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              ⚡ Performance
            </button>
            <button
              onClick={() => setAnalysisType("full")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                analysisType === "full" 
                  ? "bg-red-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              🚀 Analyse complète
            </button>
          </div>
          
          <button
            onClick={fetchMetadata}
            className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Analyse en cours..." : "Analyser"}
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full mt-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-center"
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Basic Metadata Display */}
      {metadata && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-8 w-full max-w-4xl bg-white border border-gray-200 rounded-xl shadow-lg p-6"
        >
          {metadata.image && (
            <div className="w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
              <Image
                src={metadata.image}
                alt="Preview"
                width={400}
                height={192}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{metadata.title}</h2>
          <p className="text-gray-700 mb-4">{metadata.description}</p>
          <a
            href={metadata.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {metadata.url}
          </a>
        </motion.div>
      )}

      {/* Screenshot Display */}
      {screenshot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6 w-full max-w-4xl bg-white border border-gray-200 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Capture d'écran</h3>
          <img src={screenshot} alt="Screenshot" className="w-full rounded-lg border border-gray-300" />
        </motion.div>
      )}

      {/* Analysis Results */}
      <div className="w-full max-w-4xl">
        {metadata?.seo && <SEOAnalysis seo={metadata.seo} />}
        {metadata?.technologies && <TechnologyDetection technologies={metadata.technologies} />}
        {metadata?.performance && <PerformanceAnalysis performance={metadata.performance} />}
      </div>
    </div>
  );
}
