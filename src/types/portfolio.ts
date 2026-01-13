export interface TokenData {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  fullyDilutedValuation?: number;
  totalSupply?: number;
  circulatingSupply?: number;
  volume24h?: number;
  priceChange24h?: number;
  sector?: string;
  category?: string;
  chain?: string;
  ecosystem?: string;
  image?: string;
}

export interface PortfolioAllocation {
  token: string;
  percentage: number;
  tokenData?: TokenData;
}

export interface InvestorProfile {
  horizon: 'short' | 'medium' | 'long';
  riskTolerance: 'low' | 'medium' | 'high';
  cryptoPercentage: number;
  objective: Array<'preserve' | 'passive_income' | 'multiply'>;
}

export interface DiagnosticFlag {
  type: 'red' | 'yellow' | 'green';
  category: 'asset' | 'sector' | 'liquidity' | 'fdv_mcap' | 'unlocks' | 'profile' | 'other_stablecoins' | 'correlation' | 'objective';
  message: string;
  actionable?: string;
  severity: number;
}

export interface BacktestResult {
  period: '30d' | '90d' | '180d';
  portfolioReturn: number;
  tokenReturns: { [token: string]: number };
  benchmarkReturns?: {
    btc: number;
    eth: number;
  };
}

export interface BacktestPoint {
  date: string;
  portfolio: number;
  btc: number;
  tokens?: { [token: string]: number };
}

export interface UnlockAlert {
  token: string;
  unlockDate: string;
  percentage: number;
  amount: number;
  type: 'token_unlock' | 'vesting_release';
  severity: 'yellow' | 'red';
}

export interface RebalanceSuggestion {
  token: string;
  currentPercentage: number;
  suggestedPercentage: number;
  reason: string;
}

export interface AIAnalysis {
  summary: string;
  riskAssessment: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  overallScore: number;
  detailedAnalysis: string;
}

export interface PortfolioDiagnostic {
  profile: InvestorProfile;
  allocation: PortfolioAllocation[];
  adherenceScore: number;
  adherenceLevel: 'high' | 'medium' | 'low';
  flags: DiagnosticFlag[];
  backtest: BacktestResult[];
  backtestSeries?: BacktestPoint[];
  unlockAlerts: UnlockAlert[];
  rebalanceSuggestions: RebalanceSuggestion[];
  sectorBreakdown: { [sector: string]: number };
  aiAnalysis?: AIAnalysis;
  metrics: {
    volatility: number;
    liquidity: number;
    stablecoinPercentage: number;
    diversificationScore: number;
  };
}

export interface AutocompleteOption {
  symbol: string;
  name: string;
  marketCap: number;
  image?: string;
  id?: string;
}

// Token categories for analysis
export const MAJOR_TIER_1 = ['BTC'];
export const MAJOR_TIER_2 = ['ETH', 'SOL'];
export const MAJOR_COINS = [...MAJOR_TIER_1, ...MAJOR_TIER_2];
export const MAJOR_STABLECOINS = ['USDC', 'USDT', 'DAI', 'PYUSD'];
export const OTHER_STABLECOINS = ['USDE', 'FRAX', 'LUSD', 'MIM', 'USDD', 'TUSD', 'FDUSD', 'BUSD'];
export const YIELD_ASSETS = [
  'ETH', 'SOL', 'DOT', 'ATOM', 'AVAX', 'NEAR', 'MATIC', 'ADA', 'ALGO', 'FTM',
  'SUI', 'APT', 'SEI', 'INJ', 'ENA', 'HYPE', 'AAVE', 'TIA', 'LDO', 'PENDLE',
];
