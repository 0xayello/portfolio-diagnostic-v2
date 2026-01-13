import React, { useState, useMemo } from 'react';
import { PortfolioDiagnostic } from '@/types/portfolio';
import { getTokenLogo } from '@/data/tokenLogos';
import ShareModal from './ShareModal';
import {
  calculateSpiritAnimal,
  calculateBadges,
  calculateFOMOMeter,
  calculateCelebrityMatch,
  calculateTimeMachine,
  getMotivationalPhrase,
  SPIRIT_ANIMALS,
  SpiritAnimal,
  Badge,
} from '@/utils/gamification';

interface DiagnosticResultsProps {
  diagnostic: PortfolioDiagnostic;
  onNewAnalysis: () => void;
}

type TabId = 'ai' | 'details' | 'allocation' | 'spirit' | 'badges' | 'timemachine' | 'celebrity';

export default function DiagnosticResults({ diagnostic, onNewAnalysis }: DiagnosticResultsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('ai');
  const [showShareModal, setShowShareModal] = useState(false);

  const { aiAnalysis, flags, allocation, adherenceScore, adherenceLevel, sectorBreakdown } = diagnostic;
  const score = aiAnalysis?.overallScore || adherenceScore;
  const sectorCount = sectorBreakdown ? Object.keys(sectorBreakdown).length : 0;

  // Calculate gamification data
  const spiritAnimal = useMemo(() => calculateSpiritAnimal(allocation, score), [allocation, score]);
  const badges = useMemo(() => calculateBadges(allocation, score, sectorCount), [allocation, score, sectorCount]);
  const fomoMeter = useMemo(() => calculateFOMOMeter(allocation), [allocation]);
  const celebrityMatch = useMemo(() => calculateCelebrityMatch(allocation), [allocation]);
  const timeMachineResults = useMemo(() => calculateTimeMachine(allocation), [allocation]);
  
  const hasMemecoins = allocation.some(a => ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK', 'WIF', 'MEME'].includes(a.token));
  const memecoinPercent = allocation
    .filter(a => ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK', 'WIF', 'MEME'].includes(a.token))
    .reduce((sum, a) => sum + a.percentage, 0);
  
  const motivationalPhrase = useMemo(
    () => getMotivationalPhrase(score, hasMemecoins, memecoinPercent),
    [score, hasMemecoins, memecoinPercent]
  );

  const unlockedBadges = badges.filter(b => b.unlocked);

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-paradigma-mint';
    if (s >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getScoreLabel = (level: string) => {
    switch (level) {
      case 'high': return 'Excelente';
      case 'medium': return 'Bom';
      case 'low': return 'Precisa Atenção';
      default: return 'Indefinido';
    }
  };

  const getScoreRingColor = (s: number) => {
    if (s >= 80) return '#3ecf8e';
    if (s >= 60) return '#ff9f43';
    return '#ff6b6b';
  };

  const ringOffset = 553 - (553 * score / 100);

  const redFlags = flags.filter(f => f.type === 'red');
  const yellowFlags = flags.filter(f => f.type === 'yellow');
  const greenFlags = flags.filter(f => f.type === 'green');

  const tabs = [
    { id: 'ai' as TabId, label: 'Análise', icon: '🤖' },
    { id: 'spirit' as TabId, label: 'Perfil', icon: spiritAnimal.emoji },
    { id: 'badges' as TabId, label: 'Conquistas', icon: '🏆' },
    { id: 'timemachine' as TabId, label: 'Time Machine', icon: '⏰' },
    { id: 'celebrity' as TabId, label: 'Celebridade', icon: '👥' },
    { id: 'details' as TabId, label: 'Alertas', icon: '📋' },
    { id: 'allocation' as TabId, label: 'Alocação', icon: '📊' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero Section with Score */}
      <div className="glass-card-solid rounded-3xl p-8 md:p-12 relative overflow-hidden border-2 border-paradigma-navy/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-paradigma-mint/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">
              Diagnóstico do seu Portfólio
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Score Circle */}
            <div className="relative flex-shrink-0">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" fill="none" stroke="#252659" strokeWidth="12" />
                <circle
                  cx="96" cy="96" r="88" fill="none"
                  stroke={getScoreRingColor(score)}
                  strokeWidth="12" strokeLinecap="round"
                  className="score-ring"
                  style={{ '--ring-offset': ringOffset } as React.CSSProperties}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</span>
                <span className="text-gray-400 text-sm mt-1">de 100</span>
              </div>
            </div>

            {/* Summary + Spirit Animal */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  adherenceLevel === 'high' 
                    ? 'bg-paradigma-mint/20 text-paradigma-mint' 
                    : adherenceLevel === 'medium'
                    ? 'bg-warning/20 text-warning'
                    : 'bg-danger/20 text-danger'
                }`}>
                  {adherenceLevel === 'high' ? '✅' : adherenceLevel === 'medium' ? '⚠️' : '🚨'}
                  {getScoreLabel(adherenceLevel)}
                </div>
                
                {/* Spirit Animal Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-paradigma-navy/60 text-white border border-paradigma-mint/20">
                  <span className="text-xl">{spiritAnimal.emoji}</span>
                  {spiritAnimal.name}
                </div>
              </div>
              
              {/* Motivational Phrase */}
              <div className="bg-paradigma-navy/40 rounded-xl p-4 mb-4 border border-paradigma-navy/60">
                <p className="text-gray-200 text-lg italic flex items-start gap-2">
                  <span className="text-2xl">{motivationalPhrase.emoji}</span>
                  <span>"{motivationalPhrase.text}"</span>
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-danger/10 rounded-lg">
                  <span className="text-danger">🚨</span>
                  <span className="text-gray-300 text-sm">{redFlags.length} críticos</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 rounded-lg">
                  <span className="text-warning">⚠️</span>
                  <span className="text-gray-300 text-sm">{yellowFlags.length} atenção</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-lg">
                  <span className="text-paradigma-mint">✅</span>
                  <span className="text-gray-300 text-sm">{greenFlags.length} positivos</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-paradigma-mint/10 rounded-lg">
                  <span>🏆</span>
                  <span className="text-gray-300 text-sm">{unlockedBadges.length} conquistas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOMO vs HODL Meter */}
      <div className="glass-card-solid rounded-2xl p-6 border border-paradigma-navy/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>🌡️</span> Termômetro FOMO vs HODL
          </h3>
          <span className="text-2xl">{fomoMeter.emoji}</span>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>🧊 HODL</span>
            {fomoMeter.label && <span className="font-bold text-white">{fomoMeter.label}</span>}
            <span>FOMO 🔥</span>
          </div>
          <div className="h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-full relative">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-4 border-paradigma-dark shadow-lg transition-all"
              style={{ left: `calc(${fomoMeter.percentage}% - 12px)` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-3 text-center italic">"{fomoMeter.description}"</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
              activeTab === tab.id
                ? 'bg-paradigma-mint text-paradigma-dark'
                : 'bg-paradigma-navy/50 text-gray-400 hover:text-white hover:bg-paradigma-navy'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-card-solid rounded-3xl p-8 border border-paradigma-navy/50">
        
        {/* AI Analysis Tab */}
        {activeTab === 'ai' && aiAnalysis && (
          <div className="space-y-8 animate-fade-in">
            <div className="p-5 bg-paradigma-navy/20 border border-paradigma-navy/40 rounded-2xl">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span> Avaliação de Risco
              </h3>
              <div className="bg-paradigma-darker/50 border border-paradigma-navy/30 rounded-xl p-5">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{aiAnalysis.riskAssessment}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {aiAnalysis.strengths.length > 0 && (
                <div className="p-5 bg-success/5 border border-success/20 rounded-2xl">
                  <h3 className="text-lg font-semibold text-paradigma-mint mb-4 flex items-center gap-2">
                    <span>💪</span> Pontos Fortes
                  </h3>
                  <ul className="space-y-3">
                    {aiAnalysis.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <span className="text-paradigma-mint mt-0.5 text-lg">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiAnalysis.weaknesses.length > 0 && (
                <div className="p-5 bg-warning/5 border border-warning/20 rounded-2xl">
                  <h3 className="text-lg font-semibold text-warning mb-4 flex items-center gap-2">
                    <span>⚠️</span> Pontos de Atenção
                  </h3>
                  <ul className="space-y-3">
                    {aiAnalysis.weaknesses.map((weakness, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <span className="text-warning mt-0.5 text-lg">!</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {aiAnalysis.recommendations.length > 0 && (
              <div className="p-5 bg-paradigma-navy/30 border border-paradigma-mint/15 rounded-2xl">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">💡</span> Recomendações
                </h3>
                <div className="grid gap-3">
                  {aiAnalysis.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-paradigma-mint/5 border-2 border-paradigma-mint/25 rounded-xl">
                      <div className="w-8 h-8 bg-paradigma-mint/20 border border-paradigma-mint/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-paradigma-mint font-bold">{i + 1}</span>
                      </div>
                      <p className="text-gray-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Perfil de Investidor Tab */}
        {activeTab === 'spirit' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{spiritAnimal.emoji}</div>
              <h3 className="text-3xl font-bold text-white mb-2">{spiritAnimal.name}</h3>
              <p className="text-xl text-paradigma-mint italic">"{spiritAnimal.description}"</p>
            </div>

            <div className="mt-8 pt-8 border-t border-paradigma-navy">
              <h4 className="text-lg font-semibold text-white mb-6 text-center">Todos os Animais</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SPIRIT_ANIMALS.map((animal) => (
                  <div 
                    key={animal.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      animal.id === spiritAnimal.id
                        ? 'bg-paradigma-mint/20 border-paradigma-mint'
                        : 'bg-paradigma-navy/30 border-paradigma-navy/50 opacity-60'
                    }`}
                  >
                    <div className="text-4xl mb-2">{animal.emoji}</div>
                    <div className="font-semibold text-white">{animal.name}</div>
                    <div className="text-gray-400 text-xs mt-1">{animal.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">🏆 Suas Conquistas</h3>
              <p className="text-gray-400">{unlockedBadges.length} de {badges.length} desbloqueadas</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    badge.unlocked
                      ? 'bg-paradigma-mint/10 border-paradigma-mint/50'
                      : 'bg-paradigma-navy/20 border-paradigma-navy/30 opacity-40 grayscale'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{badge.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-white flex items-center gap-2">
                        {badge.name}
                        {badge.unlocked && <span className="text-paradigma-mint text-sm">✓</span>}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{badge.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Machine Tab */}
        {activeTab === 'timemachine' && (() => {
          // Dados do gráfico com datas ordenadas cronologicamente
          const chartData = [
            { date: 'Jan 2021', month: 0, ...timeMachineResults.find(r => r.scenario.date === 'Janeiro 2021') },
            { date: 'Nov 2021', month: 10, ...timeMachineResults.find(r => r.scenario.date === 'Novembro 2021') },
            { date: 'Nov 2022', month: 22, ...timeMachineResults.find(r => r.scenario.date === 'Novembro 2022') },
            { date: 'Jan 2023', month: 24, ...timeMachineResults.find(r => r.scenario.date === 'Janeiro 2023') },
            { date: 'Abr 2024', month: 39, ...timeMachineResults.find(r => r.scenario.date === 'Abril 2024') },
            { date: 'Jan 2026', month: 60, portfolioChange: 0, scenario: { emoji: '📍', label: 'Hoje' } },
          ].filter(d => d.portfolioChange !== undefined);
          
          const maxChange = Math.max(...chartData.map(d => Math.abs(d.portfolioChange || 0)), 100);
          const chartHeight = 280;
          const chartWidth = 700;
          const padding = { top: 40, right: 40, bottom: 60, left: 70 };
          const innerWidth = chartWidth - padding.left - padding.right;
          const innerHeight = chartHeight - padding.top - padding.bottom;
          
          const xScale = (month: number) => padding.left + (month / 60) * innerWidth;
          const yScale = (value: number) => padding.top + innerHeight / 2 - (value / maxChange) * (innerHeight / 2);
          
          const linePath = chartData
            .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.month)} ${yScale(d.portfolioChange || 0)}`)
            .join(' ');

          return (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">⏰ Time Machine</h3>
                <p className="text-gray-400">Valorização do seu portfólio ao longo do tempo</p>
              </div>

              {/* Gráfico SVG */}
              <div className="bg-paradigma-navy/30 rounded-2xl p-4 border border-paradigma-navy/50 overflow-x-auto">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[600px]">
                  {/* Grid horizontal */}
                  {[-100, -50, 0, 50, 100, 200, 300, 400, 500].filter(v => Math.abs(v) <= maxChange).map(value => (
                    <g key={value}>
                      <line
                        x1={padding.left}
                        y1={yScale(value)}
                        x2={chartWidth - padding.right}
                        y2={yScale(value)}
                        stroke={value === 0 ? '#3ecf8e' : '#252659'}
                        strokeWidth={value === 0 ? 2 : 1}
                        strokeDasharray={value === 0 ? '' : '4,4'}
                      />
                      <text
                        x={padding.left - 10}
                        y={yScale(value)}
                        fill="#9ca3af"
                        fontSize="12"
                        textAnchor="end"
                        dominantBaseline="middle"
                      >
                        {value >= 0 ? `+${value}%` : `${value}%`}
                      </text>
                    </g>
                  ))}

                  {/* Área preenchida */}
                  <path
                    d={`${linePath} L ${xScale(chartData[chartData.length - 1].month)} ${yScale(0)} L ${xScale(chartData[0].month)} ${yScale(0)} Z`}
                    fill="url(#areaGradient)"
                    opacity="0.3"
                  />
                  
                  {/* Gradiente */}
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3ecf8e" />
                      <stop offset="100%" stopColor="#3ecf8e" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Linha principal */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#3ecf8e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Pontos e labels */}
                  {chartData.map((d, i) => (
                    <g key={i}>
                      <circle
                        cx={xScale(d.month)}
                        cy={yScale(d.portfolioChange || 0)}
                        r="6"
                        fill={(d.portfolioChange || 0) >= 0 ? '#3ecf8e' : '#ff6b6b'}
                        stroke="#1a1b4b"
                        strokeWidth="2"
                      />
                      <text
                        x={xScale(d.month)}
                        y={chartHeight - 20}
                        fill="#9ca3af"
                        fontSize="11"
                        textAnchor="middle"
                      >
                        {d.date}
                      </text>
                      <text
                        x={xScale(d.month)}
                        y={chartHeight - 6}
                        fill="#6b7280"
                        fontSize="9"
                        textAnchor="middle"
                      >
                        {d.scenario?.label}
                      </text>
                      {/* Valor no ponto */}
                      <text
                        x={xScale(d.month)}
                        y={yScale(d.portfolioChange || 0) - 12}
                        fill={(d.portfolioChange || 0) >= 0 ? '#3ecf8e' : '#ff6b6b'}
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {(d.portfolioChange || 0) >= 0 ? `+${(d.portfolioChange || 0).toFixed(0)}%` : `${(d.portfolioChange || 0).toFixed(0)}%`}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Legenda */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                {timeMachineResults.map((result, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-paradigma-navy/20 border border-paradigma-navy/30">
                    <span className="text-xl">{result.scenario.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{result.scenario.label}</div>
                      <div className={`text-xs font-bold ${result.portfolioChange >= 0 ? 'text-paradigma-mint' : 'text-danger'}`}>
                        {result.wouldBe}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Celebrity Tab */}
        {activeTab === 'celebrity' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">👥 Seu Portfólio Parece Com...</h3>
            </div>

            <div className="max-w-md mx-auto">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-paradigma-navy/60 to-paradigma-darker border-2 border-paradigma-mint/30 text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-paradigma-navy/60 border-4 border-paradigma-mint/40 overflow-hidden">
                  <img 
                    src={celebrityMatch.image} 
                    alt={celebrityMatch.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initial letters if image fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-4xl font-bold text-paradigma-mint">${celebrityMatch.name.split(' ').map(n => n[0]).join('')}</span>`;
                        parent.classList.add('flex', 'items-center', 'justify-center');
                      }
                    }}
                  />
                </div>
                <div className="text-2xl font-bold text-white mb-2">{celebrityMatch.name}</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-paradigma-mint/20 rounded-full mb-4">
                  <span className="text-paradigma-mint font-bold">{celebrityMatch.match}%</span>
                  <span className="text-gray-300 text-sm">de similaridade</span>
                </div>
                <p className="text-gray-300 mb-4">{celebrityMatch.description}</p>
                <div className="bg-paradigma-navy/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">Estilo de portfólio:</div>
                  <div className="text-white font-medium">{celebrityMatch.portfolio}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6 animate-fade-in">
            {redFlags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-danger mb-4 flex items-center gap-2">
                  <span>🚨</span> Alertas Críticos ({redFlags.length})
                </h3>
                <div className="space-y-3">
                  {redFlags.map((flag, i) => (
                    <div key={i} className="flag-red">
                      <p className="text-gray-200 font-medium">{flag.message}</p>
                      {flag.actionable && <p className="text-gray-400 text-sm mt-2">💡 {flag.actionable}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {yellowFlags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-warning mb-4 flex items-center gap-2">
                  <span>⚠️</span> Pontos de Atenção ({yellowFlags.length})
                </h3>
                <div className="space-y-3">
                  {yellowFlags.map((flag, i) => (
                    <div key={i} className="flag-yellow">
                      <p className="text-gray-200 font-medium">{flag.message}</p>
                      {flag.actionable && <p className="text-gray-400 text-sm mt-2">💡 {flag.actionable}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {greenFlags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-paradigma-mint mb-4 flex items-center gap-2">
                  <span>✅</span> Pontos Positivos ({greenFlags.length})
                </h3>
                <div className="space-y-3">
                  {greenFlags.map((flag, i) => (
                    <div key={i} className="flag-green">
                      <p className="text-gray-200 font-medium">{flag.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {flags.length === 0 && (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">✨</span>
                <p className="text-gray-400">Nenhum alerta identificado</p>
              </div>
            )}
          </div>
        )}

        {/* Allocation Tab */}
        {activeTab === 'allocation' && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-semibold text-white mb-6">Sua Alocação Atual</h3>
            <div className="space-y-4">
              {allocation.sort((a, b) => b.percentage - a.percentage).map((item) => (
                <div key={item.token} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-paradigma-navy flex-shrink-0">
                    <img
                      src={getTokenLogo(item.token)}
                      alt={item.token}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.token}&background=3ecf8e&color=1a1b4b&size=48&bold=true`;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">{item.token}</span>
                      <span className="text-paradigma-mint font-bold">{item.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {sectorBreakdown && Object.keys(sectorBreakdown).length > 0 && (
              <div className="mt-8 pt-8 border-t border-paradigma-navy">
                <h4 className="text-lg font-semibold text-white mb-4">Por Setor</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(sectorBreakdown).sort(([, a], [, b]) => b - a).map(([sector, percentage]) => (
                    <div key={sector} className="bg-paradigma-navy/30 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">{sector}</div>
                      <div className="text-white font-bold text-lg">{percentage.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={onNewAnalysis} className="btn-secondary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Nova Análise
        </button>
        <button onClick={() => setShowShareModal(true)} className="btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Compartilhar
        </button>
      </div>

      {/* Footer Disclaimer */}
      <div className="bg-paradigma-navy/30 rounded-2xl p-6 text-center">
        <p className="text-gray-500 text-sm leading-relaxed">
          ⚠️ Este diagnóstico analisa se sua carteira está alinhada com seu perfil de risco, não a qualidade dos ativos investidos. Para uma análise aprofundada dos seus investimentos, recomendamos falar diretamente com um de nossos analistas.
        </p>
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        diagnostic={diagnostic}
        spiritAnimal={spiritAnimal}
        topBadge={unlockedBadges[0]}
        motivationalPhrase={motivationalPhrase}
      />
    </div>
  );
}
