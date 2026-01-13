import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { PortfolioAllocation, InvestorProfile, PortfolioDiagnostic } from '@/types/portfolio';
import Header from '@/components/Header';
import PortfolioForm from '@/components/PortfolioForm';
import ProfileQuiz from '@/components/ProfileQuiz';
import DiagnosticResults from '@/components/DiagnosticResults';

const DEFAULT_ALLOCATION: PortfolioAllocation[] = [
  { token: 'BTC', percentage: 40 },
  { token: 'ETH', percentage: 30 },
  { token: 'SOL', percentage: 20 },
  { token: 'USDC', percentage: 10 },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'portfolio' | 'quiz' | 'results'>('portfolio');
  const [portfolioAllocation, setPortfolioAllocation] = useState<PortfolioAllocation[]>(DEFAULT_ALLOCATION);
  const [diagnostic, setDiagnostic] = useState<PortfolioDiagnostic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepNumber = currentStep === 'portfolio' ? 1 : currentStep === 'quiz' ? 2 : 3;

  const handlePortfolioSubmit = (allocation: PortfolioAllocation[]) => {
    setPortfolioAllocation(allocation);
    setCurrentStep('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizSubmit = async (profile: InvestorProfile) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allocation: portfolioAllocation,
          profile,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate diagnostic');
      }

      const result = await response.json();
      setDiagnostic(result);
      setCurrentStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao gerar diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentStep('portfolio');
    setDiagnostic(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPortfolio = () => {
    setCurrentStep('portfolio');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Diagnóstico de Portfólio Cripto | Paradigma</title>
        <meta
          name="description"
          content="Analise sua carteira de criptomoedas com inteligência artificial e receba um diagnóstico personalizado baseado no seu perfil de investidor."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-paradigma-dark">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Gradient blobs */}
          <div className="hero-blob w-[600px] h-[600px] bg-paradigma-mint/10 top-[-200px] left-[-200px]" />
          <div
            className="hero-blob w-[500px] h-[500px] bg-coral/10 bottom-[-200px] right-[-100px]"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="hero-blob w-[400px] h-[400px] bg-warning/10 top-[50%] left-[60%]"
            style={{ animationDelay: '4s' }}
          />
          
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(62, 207, 142, 0.5) 1px, transparent 1px), 
                               linear-gradient(90deg, rgba(62, 207, 142, 0.5) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Header */}
        <Header currentStep={stepNumber} totalSteps={3} />

        {/* Main Content */}
        <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
          {/* Error Alert */}
          {error && (
            <div className="mb-8 p-4 bg-danger/10 border border-danger/30 rounded-xl text-danger flex items-center gap-3 animate-slide-down">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-medium">{error}</p>
                <p className="text-sm opacity-80">Tente novamente ou verifique sua conexão.</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-danger hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {/* Step Content */}
          {currentStep === 'portfolio' && (
            <PortfolioForm
              initialAllocation={portfolioAllocation}
              onSubmit={handlePortfolioSubmit}
            />
          )}

          {currentStep === 'quiz' && (
            <ProfileQuiz
              onSubmit={handleQuizSubmit}
              onBack={handleBackToPortfolio}
              loading={loading}
            />
          )}

          {currentStep === 'results' && diagnostic && (
            <DiagnosticResults
              diagnostic={diagnostic}
              onNewAnalysis={handleNewAnalysis}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-paradigma-navy mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <img
                    src="https://app.paradigma.education/static/media/logo-mobile.412f0d5cd6f39d2c80bc.png"
                    alt="Paradigma"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <div className="text-white font-bold">Paradigma Education</div>
                  <div className="text-gray-500 text-sm">© {new Date().getFullYear()}</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://x.com/ParadigmaEdu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-paradigma-navy hover:bg-paradigma-mint/20 rounded-xl flex items-center justify-center text-gray-400 hover:text-paradigma-mint transition-all"
                >
                  <span className="text-lg">𝕏</span>
                </a>
                <a
                  href="https://www.instagram.com/paradigma.education/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-paradigma-navy hover:bg-paradigma-mint/20 rounded-xl flex items-center justify-center text-gray-400 hover:text-paradigma-mint transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@ParadigmaEducation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-paradigma-navy hover:bg-paradigma-mint/20 rounded-xl flex items-center justify-center text-gray-400 hover:text-paradigma-mint transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://paradigma.education/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-paradigma-navy hover:bg-paradigma-mint/20 rounded-xl flex items-center justify-center text-gray-400 hover:text-paradigma-mint transition-all"
                  aria-label="Site Oficial"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.486 2 12.014 2 17.53 6.477 22 12 22s10-4.47 10-9.986C22 6.486 17.523 2 12 2zm6.93 9h-2.033c-.09-1.765-.482-3.398-1.114-4.77A8.01 8.01 0 0 1 18.93 11zm-4 0h-3.86V5.343A10.87 10.87 0 0 1 14.93 11zm-5 0H5.07a8.01 8.01 0 0 1 3.147-4.77A13.3 13.3 0 0 0 7.93 11zm0 2c.1 1.781.504 3.434 1.15 4.82A8.007 8.007 0 0 1 5.07 13h2.86zm1.93 0h3.858A10.87 10.87 0 0 1 11.86 18.657V13zm4.93 0h2.033a8.01 8.01 0 0 1-3.147 4.82c.632-1.372 1.024-3.005 1.114-4.82zM11 5.343V11H7.14C7.508 8.954 8.375 6.992 9.62 5.343zM12 4c1.263 1.514 2.086 3.95 2.206 7h-4.412C9.914 7.95 10.737 5.514 12 4zm0 16c-1.263-1.514-2.086-3.95-2.206-7h4.412C14.086 16.05 13.263 18.486 12 20z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
