import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { PortfolioDiagnostic } from '@/types/portfolio';
import ShareCard from './ShareCard';
import { SpiritAnimal, Badge, MotivationalPhrase } from '@/utils/gamification';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnostic: PortfolioDiagnostic;
  spiritAnimal?: SpiritAnimal;
  topBadge?: Badge;
  motivationalPhrase?: MotivationalPhrase;
}

export default function ShareModal({ 
  isOpen, 
  onClose, 
  diagnostic,
  spiritAnimal,
  topBadge,
  motivationalPhrase,
}: ShareModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<'twitter' | 'instagram'>('twitter');
  const cardRef = useRef<HTMLDivElement>(null);

  const generateImage = async (format: 'twitter' | 'instagram'): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const downloadImage = async (format: 'twitter' | 'instagram') => {
    setIsGenerating(true);
    setPreviewFormat(format);
    
    await new Promise(resolve => setTimeout(resolve, 100));

    const blob = await generateImage(format);
    
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `paradigma-portfolio-${format}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setIsGenerating(false);
  };

  const shareToTwitter = async () => {
    setIsGenerating(true);
    setPreviewFormat('twitter');
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const blob = await generateImage('twitter');
    
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `paradigma-portfolio-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    const score = diagnostic.aiAnalysis?.overallScore || diagnostic.adherenceScore;
    const animalText = spiritAnimal ? ` Meu spirit animal é ${spiritAnimal.emoji} ${spiritAnimal.name}!` : '';
    const tweetText = encodeURIComponent(
      `🎯 Meu portfólio cripto tirou ${score}/100 no diagnóstico da @ParadigmaEdu!${animalText}\n\n` +
      `Faça o seu diagnóstico gratuito em paradigma.education\n\n` +
      `#Crypto #Bitcoin #Portfolio #Paradigma`
    );
    
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
    
    setIsGenerating(false);
  };

  const prepareInstagramStory = async () => {
    setIsGenerating(true);
    setPreviewFormat('instagram');
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await downloadImage('instagram');
    
    setIsGenerating(false);
    
    alert('Imagem baixada! Abra o Instagram e compartilhe nos Stories.');
  };

  if (!isOpen) return null;

  const score = diagnostic.aiAnalysis?.overallScore || diagnostic.adherenceScore;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-paradigma-darker border border-paradigma-navy/50 rounded-3xl p-8 max-w-lg w-full mx-4 animate-scale-in shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-paradigma-mint/20 rounded-full mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Compartilhe seu Resultado!
          </h2>
          <p className="text-gray-400">
            Mostre para seus amigos seu score de <span className="text-paradigma-mint font-bold">{score}/100</span>
          </p>
        </div>

        {/* Preview Info */}
        {(spiritAnimal || topBadge) && (
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {spiritAnimal && (
              <div className="flex items-center gap-2 px-3 py-2 bg-paradigma-navy/50 rounded-full">
                <span className="text-xl">{spiritAnimal.emoji}</span>
                <span className="text-white text-sm font-medium">{spiritAnimal.name}</span>
              </div>
            )}
            {topBadge && (
              <div className="flex items-center gap-2 px-3 py-2 bg-paradigma-mint/10 rounded-full border border-paradigma-mint/30">
                <span className="text-xl">{topBadge.emoji}</span>
                <span className="text-paradigma-mint text-sm font-medium">{topBadge.name}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={shareToTwitter}
            disabled={isGenerating}
            className="w-full flex items-center gap-4 p-4 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 hover:border-[#1DA1F2]/50 rounded-2xl transition-all group disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-[#1DA1F2] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-semibold">Postar no X</div>
              <div className="text-gray-400 text-sm">Compartilhe com texto + imagem</div>
            </div>
            {isGenerating && previewFormat === 'twitter' ? (
              <div className="w-6 h-6 border-2 border-[#1DA1F2] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6 text-gray-400 group-hover:text-[#1DA1F2] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>

          <button
            onClick={prepareInstagramStory}
            disabled={isGenerating}
            className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10 hover:from-[#833AB4]/20 hover:via-[#FD1D1D]/20 hover:to-[#F77737]/20 border border-[#FD1D1D]/30 hover:border-[#FD1D1D]/50 rounded-2xl transition-all group disabled:opacity-50"
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%)' }}
            >
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-semibold">Instagram Stories</div>
              <div className="text-gray-400 text-sm">Baixe a imagem para os Stories</div>
            </div>
            {isGenerating && previewFormat === 'instagram' ? (
              <div className="w-6 h-6 border-2 border-[#FD1D1D] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6 text-gray-400 group-hover:text-[#FD1D1D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-paradigma-navy" />
            <span className="text-gray-500 text-sm">ou baixe direto</span>
            <div className="flex-1 h-px bg-paradigma-navy" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => downloadImage('twitter')}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-paradigma-navy/50 hover:bg-paradigma-navy border border-paradigma-navy/60 hover:border-paradigma-mint/30 rounded-xl transition-all text-gray-400 hover:text-white disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-sm font-medium">16:9 (X/Twitter)</span>
            </button>
            <button
              onClick={() => downloadImage('instagram')}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-paradigma-navy/50 hover:bg-paradigma-navy border border-paradigma-navy/60 hover:border-paradigma-mint/30 rounded-xl transition-all text-gray-400 hover:text-white disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-sm font-medium">9:16 (Stories)</span>
            </button>
          </div>
        </div>

        {/* Hidden Share Card for rendering */}
        <div 
          className="fixed pointer-events-none"
          style={{ left: '-9999px', top: 0, opacity: 0 }}
        >
          <ShareCard 
            ref={cardRef} 
            diagnostic={diagnostic} 
            format={previewFormat}
            spiritAnimal={spiritAnimal}
            topBadge={topBadge}
            motivationalPhrase={motivationalPhrase}
          />
        </div>
      </div>
    </div>
  );
}
