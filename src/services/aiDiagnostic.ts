import OpenAI from 'openai';
import { PortfolioAllocation, InvestorProfile, AIAnalysis, DiagnosticFlag } from '@/types/portfolio';
import sectorsData from '@/data/sectors.json';

// Lazy initialization of OpenAI client
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY not configured - using fallback analysis');
    return null;
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

// Constants for portfolio analysis
const MAJOR_COINS = ['BTC', 'ETH', 'SOL'];
const MAJOR_STABLECOINS = ['USDC', 'USDT', 'DAI', 'PYUSD'];
const MEME_SECTOR = 'Meme';

interface PortfolioContext {
  allocation: PortfolioAllocation[];
  profile: InvestorProfile;
  totalValue?: number;
  sectorBreakdown: Record<string, number>;
  majorPercentage: number;
  stablecoinPercentage: number;
  memecoinPercentage: number;
  numAssets: number;
}

function buildPortfolioContext(
  allocation: PortfolioAllocation[],
  profile: InvestorProfile
): PortfolioContext {
  const sectorBreakdown: Record<string, number> = {};
  
  allocation.forEach(item => {
    const tokenInfo = sectorsData[item.token as keyof typeof sectorsData];
    const sector = tokenInfo?.sector || 'Outros';
    sectorBreakdown[sector] = (sectorBreakdown[sector] || 0) + item.percentage;
  });

  const majorPercentage = allocation
    .filter(a => MAJOR_COINS.includes(a.token.toUpperCase()))
    .reduce((sum, a) => sum + a.percentage, 0);

  const stablecoinPercentage = allocation
    .filter(a => MAJOR_STABLECOINS.includes(a.token.toUpperCase()))
    .reduce((sum, a) => sum + a.percentage, 0);

  const memecoinPercentage = allocation
    .filter(a => {
      const tokenInfo = sectorsData[a.token as keyof typeof sectorsData];
      return tokenInfo?.sector === MEME_SECTOR;
    })
    .reduce((sum, a) => sum + a.percentage, 0);

  return {
    allocation,
    profile,
    sectorBreakdown,
    majorPercentage,
    stablecoinPercentage,
    memecoinPercentage,
    numAssets: allocation.length,
  };
}

const SYSTEM_PROMPT = `Você é um analista de criptomoedas e gestor de portfólio profissional da Paradigma Education, uma das principais empresas de educação e pesquisa em criptoativos do Brasil.

Sua função é analisar portfólios de criptomoedas e fornecer diagnósticos personalizados baseados no perfil do investidor.

## REGRAS E PRINCÍPIOS QUE VOCÊ DEVE SEGUIR:

### Classificação de Ativos:
- **Major Tier 1**: BTC (Bitcoin) - tratamento especial, é o ativo mais seguro e estabelecido
- **Major Tier 2**: ETH (Ethereum), SOL (Solana) - muito seguros, alta liquidez
- **Major Stablecoins**: USDC, USDT, DAI, PYUSD - baixíssimo risco, servem como colchão de liquidez
- **Outras Stablecoins**: USDE, FRAX, LUSD, MIM, USDD - possuem riscos estruturais (depeg)
- **Memecoins**: DOGE, SHIB, PEPE, WIF, BONK, FLOKI, etc. - altíssimo risco especulativo

### Faixas de Stablecoins por Perfil:
- **Conservador**: 10-40% em major stablecoins
- **Moderado**: 10-20% em major stablecoins
- **Arrojado**: 0-20% em major stablecoins

### Limites de Memecoins:
- **Conservador**: 0% (não deve ter memecoins)
- **Moderado**: máximo 5%
- **Arrojado**: máximo 15%

### Concentração:
- ≥40% em um único ativo (exceto BTC) = crítico
- ≥20% em um único ativo (exceto BTC/ETH/SOL) = alerta
- >60% em qualquer ativo único = crítico (exceto BTC para conservador de longo prazo)

### Diversificação:
- 4-8 ativos = ideal
- <3 ativos = pouco diversificado
- >15 ativos = over-diversification

### Majors (BTC+ETH+SOL):
- <40% em majors = baixa base defensiva

### Por Objetivo:
- **Preservar Capital**: deve ter alta exposição em majors (>50%), zero memecoins
- **Renda Passiva**: deve ter ativos com potencial de yield (ETH, SOL, ATOM, etc.)
- **Multiplicar**: pode ter mais risco, mas deve ter base sólida

## FORMATO DA RESPOSTA:

Você DEVE responder em formato JSON válido com a seguinte estrutura:
{
  "summary": "Resumo executivo de 2-3 frases sobre o portfólio",
  "riskAssessment": "Avaliação detalhada do nível de risco do portfólio (2-3 parágrafos)",
  "strengths": ["Lista de pontos fortes do portfólio"],
  "weaknesses": ["Lista de pontos fracos ou riscos identificados"],
  "recommendations": ["Lista de recomendações específicas e acionáveis"],
  "overallScore": número de 0-100 representando aderência ao perfil,
  "detailedAnalysis": "Análise completa e detalhada do portfólio (3-5 parágrafos)"
}

Seja direto, profissional, mas também acessível. Use linguagem clara e evite jargões excessivos.
Sempre contextualize suas análises com o perfil do investidor.
Não seja excessivamente alarmista, mas seja honesto sobre riscos.
Para portfólios focados em BTC, seja mais flexível - é uma estratégia válida para muitos perfis.`;

export async function generateAIDiagnostic(
  allocation: PortfolioAllocation[],
  profile: InvestorProfile
): Promise<AIAnalysis> {
  const context = buildPortfolioContext(allocation, profile);
  
  const horizonLabel = {
    short: 'Curto prazo (até 1 ano)',
    medium: 'Médio prazo (1-3 anos)',
    long: 'Longo prazo (mais de 3 anos)',
  }[profile.horizon];

  const riskLabel = {
    low: 'Conservador',
    medium: 'Moderado',
    high: 'Arrojado',
  }[profile.riskTolerance];

  const objectiveLabels = profile.objective.map(obj => ({
    preserve: 'Preservar Capital',
    passive_income: 'Renda Passiva',
    multiply: 'Multiplicar Capital',
  }[obj])).join(', ');

  const userPrompt = `
## PERFIL DO INVESTIDOR:
- Horizonte: ${horizonLabel}
- Tolerância ao Risco: ${riskLabel}
- Objetivos: ${objectiveLabels}

## COMPOSIÇÃO DO PORTFÓLIO:
${allocation.map(a => `- ${a.token}: ${a.percentage.toFixed(1)}%`).join('\n')}

## MÉTRICAS CALCULADAS:
- Número de ativos: ${context.numAssets}
- Exposição em Majors (BTC+ETH+SOL): ${context.majorPercentage.toFixed(1)}%
- Exposição em Major Stablecoins: ${context.stablecoinPercentage.toFixed(1)}%
- Exposição em Memecoins: ${context.memecoinPercentage.toFixed(1)}%

## DISTRIBUIÇÃO POR SETOR:
${Object.entries(context.sectorBreakdown).map(([sector, pct]) => `- ${sector}: ${pct.toFixed(1)}%`).join('\n')}

Por favor, analise este portfólio e forneça um diagnóstico completo considerando o perfil do investidor.
`;

  const client = getOpenAIClient();
  
  // If no API key, use fallback analysis
  if (!client) {
    return generateFallbackAnalysis(context);
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from AI');
    }

    const analysis = JSON.parse(responseContent) as AIAnalysis;
    
    // Ensure all required fields exist
    return {
      summary: analysis.summary || 'Análise não disponível',
      riskAssessment: analysis.riskAssessment || 'Avaliação de risco não disponível',
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      recommendations: analysis.recommendations || [],
      overallScore: Math.min(100, Math.max(0, analysis.overallScore || 50)),
      detailedAnalysis: analysis.detailedAnalysis || 'Análise detalhada não disponível',
    };
  } catch (error) {
    console.error('Error generating AI diagnostic:', error);
    
    // Return fallback analysis
    return generateFallbackAnalysis(context);
  }
}

function generateFallbackAnalysis(context: PortfolioContext): AIAnalysis {
  const { profile, allocation, majorPercentage, stablecoinPercentage, memecoinPercentage, numAssets, sectorBreakdown } = context;
  
  let score = 70;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  // Risk tolerance labels
  const riskLabel = {
    low: 'conservador',
    medium: 'moderado',
    high: 'arrojado',
  }[profile.riskTolerance];

  // Check consolidated (majors) coins exposure
  if (majorPercentage >= 50) {
    strengths.push(`Excelente base em criptos consolidadas: ${majorPercentage.toFixed(0)}% em BTC, ETH e SOL`);
    score += 15;
  } else if (majorPercentage >= 40) {
    strengths.push(`Boa base em criptos consolidadas: ${majorPercentage.toFixed(0)}% em BTC, ETH e SOL`);
    score += 10;
  } else if (majorPercentage >= 20) {
    weaknesses.push(`Apenas ${majorPercentage.toFixed(0)}% de exposição a criptos consolidadas (BTC, ETH, SOL)`);
    recommendations.push('Considere aumentar a exposição em BTC, ETH e SOL para ao menos 40%');
    score -= 5;
  } else {
    weaknesses.push(`Exposição muito baixa em criptos consolidadas: apenas ${majorPercentage.toFixed(0)}% em BTC, ETH e SOL`);
    recommendations.push('É fundamental ter ao menos 40% em criptos consolidadas (BTC, ETH, SOL) para proteção');
    score -= 15;
  }

  // Check diversification
  if (numAssets >= 4 && numAssets <= 8) {
    strengths.push(`Diversificação equilibrada: ${numAssets} ativos no portfólio`);
    score += 5;
  } else if (numAssets < 4) {
    weaknesses.push(`Pouca diversificação: apenas ${numAssets} ativo(s)`);
    recommendations.push('Considere adicionar mais ativos para reduzir risco específico');
    score -= 5;
  } else if (numAssets > 12) {
    weaknesses.push(`Possível over-diversification: ${numAssets} ativos`);
    recommendations.push('Considere consolidar posições - muitos ativos podem diluir retornos');
    score -= 5;
  }

  // Check stablecoins based on risk profile
  const stableRanges = {
    low: { min: 15, max: 40, ideal: 25 },
    medium: { min: 10, max: 25, ideal: 15 },
    high: { min: 0, max: 15, ideal: 5 },
  };
  const range = stableRanges[profile.riskTolerance];

  // Only count as strength if stablecoins are at an ideal level (not just acceptable)
  if (stablecoinPercentage >= range.ideal && stablecoinPercentage <= range.max) {
    strengths.push(`Posição estratégica em stablecoins: ${stablecoinPercentage.toFixed(0)}% para liquidez e proteção`);
    score += 10;
  } else if (stablecoinPercentage >= range.min && stablecoinPercentage < range.ideal) {
    // Within acceptable range but not ideal - no strength, no weakness, just neutral
    score += 3;
  } else if (stablecoinPercentage < range.min && profile.riskTolerance === 'low') {
    weaknesses.push(`Baixa exposição em stablecoins para perfil ${riskLabel}: ${stablecoinPercentage.toFixed(0)}%`);
    recommendations.push(`Aumente sua posição em stablecoins (USDC, USDT) para ${range.min}-${range.max}%`);
    score -= 10;
  } else if (stablecoinPercentage > range.max) {
    weaknesses.push(`Alta concentração em stablecoins: ${stablecoinPercentage.toFixed(0)}%`);
    recommendations.push('Considere alocar parte das stablecoins em ativos com potencial de valorização');
    score -= 5;
  }
  // Note: 0% stablecoins for aggressive profile is acceptable (within range), not a strength

  // Check memecoins
  const memeLimit = { low: 0, medium: 5, high: 15 }[profile.riskTolerance];
  if (memecoinPercentage > memeLimit) {
    weaknesses.push(`Exposição excessiva em memecoins: ${memecoinPercentage.toFixed(0)}% (limite para ${riskLabel}: ${memeLimit}%)`);
    recommendations.push(`Reduza memecoins para no máximo ${memeLimit}% do portfólio`);
    score -= 15;
  } else if (memecoinPercentage > 0) {
    if (memecoinPercentage <= memeLimit / 2) {
      strengths.push(`Exposição controlada em memecoins: ${memecoinPercentage.toFixed(0)}%`);
    }
  }

  // Check concentration
  const maxConcentration = Math.max(...allocation.map(a => a.percentage));
  const mostConcentrated = allocation.find(a => a.percentage === maxConcentration);
  
  if (mostConcentrated && maxConcentration > 50 && !['BTC', 'ETH'].includes(mostConcentrated.token)) {
    weaknesses.push(`Alta concentração em ${mostConcentrated.token}: ${maxConcentration.toFixed(0)}%`);
    recommendations.push(`Considere diversificar a posição de ${mostConcentrated.token}`);
    score -= 10;
  } else if (mostConcentrated && maxConcentration >= 40 && mostConcentrated.token === 'BTC') {
    strengths.push(`Posição estratégica em BTC: ${maxConcentration.toFixed(0)}%`);
    score += 5;
  }

  // Check objectives alignment
  if (profile.objective.includes('passive_income')) {
    const yieldAssets = ['ETH', 'SOL', 'ATOM', 'ADA', 'DOT', 'MATIC', 'AVAX', 'NEAR'];
    const yieldExposure = allocation
      .filter(a => yieldAssets.includes(a.token.toUpperCase()))
      .reduce((sum, a) => sum + a.percentage, 0);
    
    if (yieldExposure >= 20) {
      strengths.push(`Boa exposição em ativos com potencial de yield: ${yieldExposure.toFixed(0)}%`);
    } else {
      weaknesses.push('Objetivo de renda passiva com baixa exposição em ativos de yield');
      recommendations.push('Para renda passiva, considere ETH, SOL ou outros ativos com staking');
    }
  }

  // Sector analysis
  const sectors = Object.entries(sectorBreakdown).sort((a, b) => b[1] - a[1]);
  if (sectors.length >= 3) {
    strengths.push(`Diversificação setorial: exposição em ${sectors.length} setores diferentes`);
  }

  // Build summary
  const scoreLevel = score >= 80 ? 'alta' : score >= 60 ? 'moderada' : 'baixa';
  const summaryParts = [];
  
  if (majorPercentage >= 40) {
    summaryParts.push(`uma base sólida em criptos consolidadas (${majorPercentage.toFixed(0)}%)`);
  }
  if (numAssets >= 4) {
    summaryParts.push(`boa diversificação com ${numAssets} ativos`);
  }
  
  const summary = summaryParts.length > 0
    ? `Seu portfólio apresenta ${summaryParts.join(' e ')}. Aderência ${scoreLevel} ao perfil ${riskLabel}.`
    : `Portfólio analisado com aderência ${scoreLevel} ao perfil ${riskLabel}.`;

  // Risk assessment
  let riskAssessment = '';
  if (score >= 80) {
    riskAssessment = `O portfólio está bem alinhado com seu perfil ${riskLabel}. A distribuição de ativos demonstra consciência dos riscos e objetivos estabelecidos.`;
  } else if (score >= 60) {
    riskAssessment = `O portfólio apresenta alinhamento moderado com seu perfil ${riskLabel}. Existem alguns ajustes que podem otimizar a relação risco-retorno.`;
  } else {
    riskAssessment = `O portfólio necessita atenção para melhor adequação ao perfil ${riskLabel}. Os pontos de melhoria identificados são importantes para seus objetivos.`;
  }

  // Detailed analysis
  const detailedAnalysis = `
**Composição Geral**: Seu portfólio conta com ${numAssets} ativo(s), sendo ${majorPercentage.toFixed(0)}% em criptos consolidadas (BTC, ETH, SOL) e ${stablecoinPercentage.toFixed(0)}% em stablecoins.

**Setores**: A distribuição setorial inclui ${sectors.slice(0, 3).map(([s, p]) => `${s} (${p.toFixed(0)}%)`).join(', ')}.

**Análise de Risco**: Para seu perfil ${riskLabel}, ${majorPercentage >= 40 ? 'a base defensiva está adequada' : 'recomendamos aumentar a exposição em criptos consolidadas (BTC, ETH, SOL)'}. ${memecoinPercentage > 0 ? `A exposição de ${memecoinPercentage.toFixed(0)}% em memecoins ${memecoinPercentage <= memeLimit ? 'está dentro do aceitável' : 'excede o recomendado'}.` : ''}

${recommendations.length > 0 ? `**Próximos Passos**: ${recommendations[0]}` : ''}
  `.trim();

  return {
    summary,
    riskAssessment,
    strengths,
    weaknesses,
    recommendations,
    overallScore: Math.min(100, Math.max(0, score)),
    detailedAnalysis,
  };
}

// Generate flags based on AI analysis and portfolio context
export function generateFlagsFromAnalysis(
  allocation: PortfolioAllocation[],
  profile: InvestorProfile,
  aiAnalysis: AIAnalysis
): DiagnosticFlag[] {
  const flags: DiagnosticFlag[] = [];
  const context = buildPortfolioContext(allocation, profile);

  // Convert weaknesses to red/yellow flags
  aiAnalysis.weaknesses.forEach((weakness, index) => {
    const isCritical = weakness.toLowerCase().includes('crítico') || 
                       weakness.toLowerCase().includes('extremo') ||
                       weakness.toLowerCase().includes('urgente');
    
    flags.push({
      type: isCritical ? 'red' : 'yellow',
      category: 'profile',
      message: weakness,
      actionable: aiAnalysis.recommendations[index] || undefined,
      severity: isCritical ? 4 : 2,
    });
  });

  // Convert strengths to green flags
  aiAnalysis.strengths.forEach(strength => {
    flags.push({
      type: 'green',
      category: 'asset',
      message: strength,
      severity: 0,
    });
  });

  // Add specific checks
  if (context.memecoinPercentage > 0 && profile.riskTolerance === 'low') {
    flags.push({
      type: 'red',
      category: 'sector',
      message: `🚨 Memecoins em perfil conservador: ${context.memecoinPercentage.toFixed(1)}%`,
      actionable: 'Para perfil conservador, elimine exposição em memecoins.',
      severity: 5,
    });
  }

  if (context.stablecoinPercentage === 0 && profile.riskTolerance === 'low') {
    flags.push({
      type: 'red',
      category: 'profile',
      message: '🚨 Zero stablecoins em perfil conservador',
      actionable: 'Adicione 10-40% em stablecoins para proteção e liquidez.',
      severity: 4,
    });
  }

  return flags.sort((a, b) => b.severity - a.severity);
}
