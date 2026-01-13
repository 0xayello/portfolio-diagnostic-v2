import type { NextApiRequest, NextApiResponse } from 'next';
import { PortfolioAllocation, InvestorProfile, PortfolioDiagnostic, DiagnosticFlag } from '@/types/portfolio';
import { CoinGeckoService } from '@/services/coingecko';
import { generateAIDiagnostic, generateFlagsFromAnalysis } from '@/services/aiDiagnostic';
import sectorsData from '@/data/sectors.json';

// Constants
const MAJOR_COINS = ['BTC', 'ETH', 'SOL'];
const MAJOR_STABLECOINS = ['USDC', 'USDT', 'DAI', 'PYUSD'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { allocation, profile } = req.body;

    // Validate input
    if (!allocation || !Array.isArray(allocation) || allocation.length === 0) {
      return res.status(400).json({ error: 'Invalid allocation data' });
    }

    if (!profile || typeof profile !== 'object') {
      return res.status(400).json({ error: 'Invalid profile data' });
    }

    // Validate allocation percentages
    const totalPercentage = allocation.reduce(
      (sum: number, item: PortfolioAllocation) => sum + (item.percentage || 0),
      0
    );

    if (Math.abs(totalPercentage - 100) > 0.5) {
      return res.status(400).json({
        error: 'Allocation percentages must sum to 100%',
        currentTotal: totalPercentage,
      });
    }

    // Validate profile fields
    const requiredFields = ['horizon', 'riskTolerance', 'objective'];
    for (const field of requiredFields) {
      if (!profile[field]) {
        return res.status(400).json({ error: `Missing required profile field: ${field}` });
      }
    }

    // Fetch token data from CoinGecko
    const coinGeckoService = new CoinGeckoService();
    const symbols = allocation.map((a: PortfolioAllocation) => a.token);
    
    let tokenDataMap: any[] = [];
    try {
      tokenDataMap = await coinGeckoService.getTokenData(symbols);
    } catch (error) {
      console.error('Error fetching token data:', error);
      // Continue without token data
    }

    // Enrich allocation with token data
    const enrichedAllocation = allocation.map((item: PortfolioAllocation) => ({
      ...item,
      tokenData: tokenDataMap.find(t => t.symbol === item.token.toUpperCase()),
    }));

    // Calculate sector breakdown
    const sectorBreakdown: Record<string, number> = {};
    enrichedAllocation.forEach((item: PortfolioAllocation) => {
      const tokenInfo = sectorsData[item.token as keyof typeof sectorsData];
      const sector = tokenInfo?.sector || 'Outros';
      sectorBreakdown[sector] = (sectorBreakdown[sector] || 0) + item.percentage;
    });

    // Calculate metrics
    const majorPercentage = enrichedAllocation
      .filter((a: PortfolioAllocation) => MAJOR_COINS.includes(a.token.toUpperCase()))
      .reduce((sum: number, a: PortfolioAllocation) => sum + a.percentage, 0);

    const stablecoinPercentage = enrichedAllocation
      .filter((a: PortfolioAllocation) => MAJOR_STABLECOINS.includes(a.token.toUpperCase()))
      .reduce((sum: number, a: PortfolioAllocation) => sum + a.percentage, 0);

    // Generate AI diagnostic
    let aiAnalysis;
    let flags: DiagnosticFlag[] = [];
    let adherenceScore = 70;

    try {
      aiAnalysis = await generateAIDiagnostic(enrichedAllocation, profile);
      adherenceScore = aiAnalysis.overallScore;
      flags = generateFlagsFromAnalysis(enrichedAllocation, profile, aiAnalysis);
    } catch (error) {
      console.error('Error generating AI diagnostic:', error);
      // Generate basic flags without AI
      flags = generateBasicFlags(enrichedAllocation, profile);
      adherenceScore = calculateBasicScore(flags);
    }

    // Determine adherence level
    const adherenceLevel = adherenceScore >= 80 ? 'high' : adherenceScore >= 60 ? 'medium' : 'low';

    // Build response
    const diagnostic: PortfolioDiagnostic = {
      profile: profile as InvestorProfile,
      allocation: enrichedAllocation,
      adherenceScore,
      adherenceLevel,
      flags,
      backtest: [],
      unlockAlerts: [],
      rebalanceSuggestions: [],
      sectorBreakdown,
      aiAnalysis,
      metrics: {
        volatility: 0.7,
        liquidity: majorPercentage + stablecoinPercentage,
        stablecoinPercentage,
        diversificationScore: Math.min(100, enrichedAllocation.length * 15),
      },
    };

    return res.status(200).json(diagnostic);
  } catch (error) {
    console.error('Error generating diagnostic:', error);
    return res.status(500).json({
      error: 'Failed to generate diagnostic',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Fallback functions when AI is not available
function generateBasicFlags(
  allocation: PortfolioAllocation[],
  profile: InvestorProfile
): DiagnosticFlag[] {
  const flags: DiagnosticFlag[] = [];
  
  const majorPercentage = allocation
    .filter(a => MAJOR_COINS.includes(a.token.toUpperCase()))
    .reduce((sum, a) => sum + a.percentage, 0);

  const stablecoinPercentage = allocation
    .filter(a => MAJOR_STABLECOINS.includes(a.token.toUpperCase()))
    .reduce((sum, a) => sum + a.percentage, 0);

  const memeSectors = allocation.filter(a => {
    const info = sectorsData[a.token as keyof typeof sectorsData];
    return info?.sector === 'Meme';
  });
  const memecoinPercentage = memeSectors.reduce((sum, a) => sum + a.percentage, 0);

  // Check majors
  if (majorPercentage >= 40) {
    flags.push({
      type: 'green',
      category: 'asset',
      message: `✅ Boa exposição em criptos consolidadas: ${majorPercentage.toFixed(1)}% em BTC/ETH/SOL`,
      severity: 0,
    });
  } else {
    flags.push({
      type: 'yellow',
      category: 'asset',
      message: `⚠️ Exposição baixa em criptos consolidadas: ${majorPercentage.toFixed(1)}%`,
      actionable: 'Considere aumentar exposição em BTC, ETH ou SOL para uma base mais sólida.',
      severity: 2,
    });
  }

  // Check stablecoins for conservative profile
  if (profile.riskTolerance === 'low' && stablecoinPercentage < 10) {
    flags.push({
      type: 'red',
      category: 'profile',
      message: '🚨 Stablecoins insuficientes para perfil conservador',
      actionable: 'Adicione 10-40% em stablecoins como USDC ou USDT.',
      severity: 4,
    });
  }

  // Check memecoins
  const memeLimits: Record<string, number> = { low: 0, medium: 5, high: 15 };
  const maxMeme = memeLimits[profile.riskTolerance] || 5;
  
  if (memecoinPercentage > maxMeme) {
    flags.push({
      type: memecoinPercentage > maxMeme * 2 ? 'red' : 'yellow',
      category: 'sector',
      message: `🎲 Exposição em Memecoins: ${memecoinPercentage.toFixed(1)}% (máximo recomendado: ${maxMeme}%)`,
      actionable: 'Reduza exposição em memecoins para diminuir risco especulativo.',
      severity: memecoinPercentage > maxMeme * 2 ? 4 : 2,
    });
  }

  // Diversification
  if (allocation.length >= 4 && allocation.length <= 8) {
    flags.push({
      type: 'green',
      category: 'asset',
      message: `✅ Diversificação adequada: ${allocation.length} ativos`,
      severity: 0,
    });
  }

  return flags.sort((a, b) => b.severity - a.severity);
}

function calculateBasicScore(flags: DiagnosticFlag[]): number {
  let score = 100;
  
  flags.forEach(flag => {
    switch (flag.severity) {
      case 5: score -= 25; break;
      case 4: score -= 15; break;
      case 3: score -= 12; break;
      case 2: score -= 8; break;
      case 1: score -= 3; break;
    }
  });
  
  return Math.max(0, Math.min(100, score));
}
