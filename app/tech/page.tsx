import TechAnalyzer from '@/components/TechAnalyzer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analyseur de Technologies | OGViewer',
  description: 'Découvrez les technologies utilisées par n\'importe quel site web avec Wappalyzer',
};

export default function TechAnalyzerPage() {
  return <TechAnalyzer />;
}
