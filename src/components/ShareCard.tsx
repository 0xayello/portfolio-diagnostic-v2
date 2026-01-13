import React, { forwardRef } from 'react';
import { PortfolioDiagnostic, PortfolioAllocation } from '@/types/portfolio';
import { SpiritAnimal, Badge, MotivationalPhrase } from '@/utils/gamification';

interface ShareCardProps {
  diagnostic: PortfolioDiagnostic;
  format: 'twitter' | 'instagram';
  spiritAnimal?: SpiritAnimal;
  topBadge?: Badge;
  motivationalPhrase?: MotivationalPhrase;
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ 
  diagnostic, 
  format,
  spiritAnimal,
  topBadge,
  motivationalPhrase,
}, ref) => {
  const { aiAnalysis, flags, allocation, adherenceScore, adherenceLevel } = diagnostic;
  const score = aiAnalysis?.overallScore || adherenceScore;
  
  const redFlags = flags.filter(f => f.type === 'red').length;
  const yellowFlags = flags.filter(f => f.type === 'yellow').length;
  const greenFlags = flags.filter(f => f.type === 'green').length;
  
  const topTokens = allocation
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4);

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#3ecf8e';
    if (s >= 60) return '#ff9f43';
    return '#ff6b6b';
  };

  const getScoreLabel = (level: string) => {
    switch (level) {
      case 'high': return 'Excelente';
      case 'medium': return 'Bom';
      case 'low': return 'Precisa Atenção';
      default: return 'Indefinido';
    }
  };

  const dateStr = new Date().toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

  const isTwitter = format === 'twitter';
  const width = isTwitter ? 1200 : 1080;
  const height = isTwitter ? 675 : 1920;

  return (
    <div
      ref={ref}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        fontFamily: "'Space Grotesk', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
      className="relative overflow-hidden"
    >
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1b4b 40%, #252659 70%, #1a1b4b 100%)',
        }}
      />
      
      {/* Decorative elements */}
      <div 
        className="absolute rounded-full blur-3xl opacity-30"
        style={{
          width: isTwitter ? '400px' : '600px',
          height: isTwitter ? '400px' : '600px',
          background: 'radial-gradient(circle, #3ecf8e 0%, transparent 70%)',
          top: isTwitter ? '-100px' : '-150px',
          right: isTwitter ? '-100px' : '-150px',
        }}
      />
      <div 
        className="absolute rounded-full blur-3xl opacity-20"
        style={{
          width: isTwitter ? '300px' : '500px',
          height: isTwitter ? '300px' : '500px',
          background: 'radial-gradient(circle, #3ecf8e 0%, transparent 70%)',
          bottom: isTwitter ? '-50px' : '-100px',
          left: isTwitter ? '-50px' : '-100px',
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(62, 207, 142, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(62, 207, 142, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: isTwitter ? '40px 40px' : '60px 60px',
        }}
      />

      {/* Content */}
      <div 
        className="relative z-10 h-full flex flex-col"
        style={{ padding: isTwitter ? '48px' : '72px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/paradigma-logo.png" 
              alt="Paradigma" 
              style={{ height: isTwitter ? '48px' : '72px' }}
              className="object-contain"
            />
            <div>
              <div 
                className="font-bold text-white"
                style={{ fontSize: isTwitter ? '28px' : '42px' }}
              >
                Paradigma
              </div>
              <div 
                className="text-gray-400"
                style={{ fontSize: isTwitter ? '14px' : '20px' }}
              >
                Portfolio Diagnostic
              </div>
            </div>
          </div>
          <div 
            className="text-gray-500"
            style={{ fontSize: isTwitter ? '14px' : '20px' }}
          >
            {dateStr}
          </div>
        </div>

        {/* Main Content */}
        <div 
          className={`flex-1 flex ${isTwitter ? 'flex-row items-center' : 'flex-col justify-center'}`}
          style={{ gap: isTwitter ? '48px' : '40px' }}
        >
          {/* Score Section */}
          <div className={`flex flex-col items-center ${isTwitter ? '' : 'mb-4'}`}>
            {/* Score Ring */}
            <div className="relative" style={{ 
              width: isTwitter ? '200px' : '280px', 
              height: isTwitter ? '200px' : '280px' 
            }}>
              <svg 
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 200 200"
              >
                <circle cx="100" cy="100" r="90" fill="none" stroke="#252659" strokeWidth="12" />
                <circle
                  cx="100" cy="100" r="90" fill="none"
                  stroke={getScoreColor(score)}
                  strokeWidth="12" strokeLinecap="round"
                  strokeDasharray="565.48"
                  strokeDashoffset={565.48 - (565.48 * score / 100)}
                  style={{ filter: `drop-shadow(0 0 10px ${getScoreColor(score)}50)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span 
                  className="font-bold"
                  style={{ 
                    fontSize: isTwitter ? '64px' : '80px',
                    color: getScoreColor(score),
                    textShadow: `0 0 30px ${getScoreColor(score)}40`,
                  }}
                >
                  {score}
                </span>
                <span 
                  className="text-gray-400"
                  style={{ fontSize: isTwitter ? '16px' : '22px' }}
                >
                  de 100
                </span>
              </div>
            </div>
            
            {/* Score Label */}
            <div 
              className="flex items-center gap-2 px-5 py-2 rounded-full mt-3"
              style={{
                background: `${getScoreColor(score)}20`,
                border: `2px solid ${getScoreColor(score)}40`,
              }}
            >
              <span 
                className="font-bold"
                style={{ 
                  fontSize: isTwitter ? '18px' : '24px',
                  color: getScoreColor(score),
                }}
              >
                {getScoreLabel(adherenceLevel)}
              </span>
            </div>

            {/* Spirit Animal */}
            {spiritAnimal && (
              <div 
                className="flex items-center gap-3 mt-4 px-5 py-3 rounded-2xl"
                style={{
                  background: 'rgba(37, 38, 89, 0.8)',
                  border: '2px solid rgba(62, 207, 142, 0.3)',
                }}
              >
                <span style={{ fontSize: isTwitter ? '36px' : '48px' }}>{spiritAnimal.emoji}</span>
                <div>
                  <div 
                    className="font-bold text-white"
                    style={{ fontSize: isTwitter ? '18px' : '24px' }}
                  >
                    {spiritAnimal.name}
                  </div>
                  <div 
                    className="text-gray-400"
                    style={{ fontSize: isTwitter ? '12px' : '16px' }}
                  >
                    Spirit Animal
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className={`flex-1 ${isTwitter ? '' : 'w-full'}`}>
            {/* Top Badge */}
            {topBadge && (
              <div 
                className="flex items-center gap-3 mb-5 px-5 py-3 rounded-2xl"
                style={{
                  background: 'rgba(62, 207, 142, 0.15)',
                  border: '2px solid rgba(62, 207, 142, 0.4)',
                  width: 'fit-content',
                }}
              >
                <span style={{ fontSize: isTwitter ? '28px' : '36px' }}>{topBadge.emoji}</span>
                <div>
                  <div 
                    className="font-bold"
                    style={{ 
                      fontSize: isTwitter ? '16px' : '22px',
                      color: '#3ecf8e',
                    }}
                  >
                    {topBadge.name}
                  </div>
                  <div 
                    className="text-gray-400"
                    style={{ fontSize: isTwitter ? '11px' : '14px' }}
                  >
                    Conquista Desbloqueada
                  </div>
                </div>
              </div>
            )}

            {/* Top Holdings */}
            <div className="mb-5">
              <div 
                className="text-gray-400 mb-3 uppercase tracking-wider"
                style={{ fontSize: isTwitter ? '11px' : '14px' }}
              >
                Top Holdings
              </div>
              <div 
                className="flex flex-wrap gap-2"
                style={{ gap: isTwitter ? '10px' : '14px' }}
              >
                {topTokens.map((token) => (
                  <div 
                    key={token.token}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{
                      background: 'rgba(37, 38, 89, 0.8)',
                      border: '1px solid rgba(62, 207, 142, 0.2)',
                    }}
                  >
                    <span 
                      className="font-bold text-white"
                      style={{ fontSize: isTwitter ? '14px' : '18px' }}
                    >
                      {token.token}
                    </span>
                    <span 
                      className="font-medium"
                      style={{ 
                        fontSize: isTwitter ? '12px' : '16px',
                        color: '#3ecf8e',
                      }}
                    >
                      {token.percentage.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flags Summary */}
            <div className="mb-5">
              <div 
                className="text-gray-400 mb-3 uppercase tracking-wider"
                style={{ fontSize: isTwitter ? '11px' : '14px' }}
              >
                Análise
              </div>
              <div 
                className="flex gap-3"
                style={{ gap: isTwitter ? '12px' : '18px' }}
              >
                {greenFlags > 0 && (
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(62, 207, 142, 0.15)', border: '1px solid rgba(62, 207, 142, 0.3)' }}
                  >
                    <span style={{ fontSize: isTwitter ? '18px' : '24px' }}>✅</span>
                    <span className="font-bold" style={{ fontSize: isTwitter ? '16px' : '20px', color: '#3ecf8e' }}>{greenFlags}</span>
                  </div>
                )}
                {yellowFlags > 0 && (
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(255, 159, 67, 0.15)', border: '1px solid rgba(255, 159, 67, 0.3)' }}
                  >
                    <span style={{ fontSize: isTwitter ? '18px' : '24px' }}>⚠️</span>
                    <span className="font-bold" style={{ fontSize: isTwitter ? '16px' : '20px', color: '#ff9f43' }}>{yellowFlags}</span>
                  </div>
                )}
                {redFlags > 0 && (
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(255, 107, 107, 0.15)', border: '1px solid rgba(255, 107, 107, 0.3)' }}
                  >
                    <span style={{ fontSize: isTwitter ? '18px' : '24px' }}>🚨</span>
                    <span className="font-bold" style={{ fontSize: isTwitter ? '16px' : '20px', color: '#ff6b6b' }}>{redFlags}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Motivational Phrase - Instagram only */}
            {!isTwitter && motivationalPhrase && (
              <div 
                className="px-5 py-4 rounded-2xl"
                style={{
                  background: 'rgba(37, 38, 89, 0.6)',
                  border: '1px solid rgba(62, 207, 142, 0.2)',
                }}
              >
                <p 
                  className="text-gray-200 italic leading-relaxed"
                  style={{ fontSize: '20px' }}
                >
                  {motivationalPhrase.emoji} "{motivationalPhrase.text}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-between"
          style={{ paddingTop: isTwitter ? '24px' : '40px' }}
        >
          <div 
            className="text-gray-500"
            style={{ fontSize: isTwitter ? '14px' : '18px' }}
          >
            paradigma.education
          </div>
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(62, 207, 142, 0.1)',
              border: '1px solid rgba(62, 207, 142, 0.2)',
            }}
          >
            <span style={{ fontSize: isTwitter ? '16px' : '20px' }}>🔗</span>
            <span 
              className="font-medium"
              style={{ 
                fontSize: isTwitter ? '14px' : '18px',
                color: '#3ecf8e',
              }}
            >
              Faça seu diagnóstico gratuito
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';

export default ShareCard;
