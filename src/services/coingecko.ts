import { TokenData, AutocompleteOption, BacktestResult } from '@/types/portfolio';
import { SYMBOL_TO_COINGECKO_ID, getTokenLogo } from '@/data/tokenLogos';

interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  large?: string;
  thumb?: string;
  market_cap_rank?: number;
}

interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply?: number | null;
  market_cap_rank?: number;
  price_change_percentage_24h?: number;
}

interface CoinGeckoHistoricalData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export class CoinGeckoService {
  private readonly BASE_URL = 'https://api.coingecko.com/api/v3';
  private readonly API_KEY = process.env.COINGECKO_API_KEY;
  private idCache: Record<string, string> = { ...SYMBOL_TO_COINGECKO_ID };

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.API_KEY) {
      headers['x-cg-demo-api-key'] = this.API_KEY;
    }
    
    return headers;
  }

  private async resolveCoinId(symbol: string): Promise<string | null> {
    const upper = symbol.toUpperCase();
    if (this.idCache[upper]) return this.idCache[upper];

    try {
      const response = await fetch(
        `${this.BASE_URL}/search?query=${encodeURIComponent(symbol)}`,
        { headers: this.getHeaders() }
      );
      if (!response.ok) return null;
      const data = await response.json();
      const coins: CoinGeckoCoin[] = data.coins || [];
      const match = coins.find(c => c.symbol.toUpperCase() === upper);
      if (match) {
        this.idCache[upper] = match.id;
        return match.id;
      }
      return null;
    } catch {
      return null;
    }
  }

  async searchCoins(query: string, limit: number = 50): Promise<AutocompleteOption[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/search?query=${encodeURIComponent(query)}`,
        { headers: this.getHeaders() }
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const coins: CoinGeckoCoin[] = data.coins || [];
      
      return coins.slice(0, limit).map(coin => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        marketCap: 0,
        image: coin.large || coin.thumb || getTokenLogo(coin.symbol),
        id: coin.id,
      }));
    } catch (error) {
      console.error('Failed to search coins:', error);
      return [];
    }
  }

  async getTopCoins(limit: number = 200): Promise<AutocompleteOption[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`,
        { headers: this.getHeaders() }
      );
      
      if (!response.ok) throw new Error('CoinGecko markets error');
      
      const markets: CoinGeckoMarket[] = await response.json();
      
      return markets.map(m => ({
        symbol: m.symbol.toUpperCase(),
        name: m.name,
        marketCap: m.market_cap,
        image: m.image || getTokenLogo(m.symbol),
        id: m.id,
      }));
    } catch (error) {
      console.error('Failed to fetch top coins:', error);
      return [];
    }
  }

  async getTokenData(symbols: string[]): Promise<TokenData[]> {
    try {
      // Resolve all coin IDs
      const idPromises = symbols.map(s => this.resolveCoinId(s));
      const ids = await Promise.all(idPromises);
      const validIds = ids.filter(Boolean) as string[];
      
      if (validIds.length === 0) return [];

      const idsParam = validIds.join(',');
      const response = await fetch(
        `${this.BASE_URL}/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&per_page=250&page=1`,
        { headers: this.getHeaders() }
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const markets: CoinGeckoMarket[] = await response.json();
      
      return markets.map(market => ({
        symbol: market.symbol.toUpperCase(),
        name: market.name,
        price: market.current_price,
        marketCap: market.market_cap,
        fullyDilutedValuation: market.fully_diluted_valuation || undefined,
        totalSupply: market.total_supply || undefined,
        circulatingSupply: market.circulating_supply,
        volume24h: market.total_volume,
        priceChange24h: market.price_change_percentage_24h,
        image: market.image || getTokenLogo(market.symbol),
      }));
    } catch (error) {
      console.error('Failed to fetch token data:', error);
      throw error;
    }
  }

  async getHistoricalData(symbols: string[], days: number): Promise<{ [symbol: string]: BacktestResult }> {
    const results: { [symbol: string]: BacktestResult } = {};
    
    for (const symbol of symbols) {
      const coinId = await this.resolveCoinId(symbol);
      if (!coinId) continue;

      try {
        const response = await fetch(
          `${this.BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
          { headers: this.getHeaders() }
        );
        
        if (!response.ok) continue;
        
        const data: CoinGeckoHistoricalData = await response.json();
        const prices = data.prices;
        
        if (prices.length < 2) continue;
        
        const startPrice = prices[0][1];
        const endPrice = prices[prices.length - 1][1];
        const returnPercentage = ((endPrice - startPrice) / startPrice) * 100;
        
        results[symbol.toUpperCase()] = {
          period: days === 30 ? '30d' : days === 90 ? '90d' : '180d',
          portfolioReturn: returnPercentage,
          tokenReturns: { [symbol.toUpperCase()]: returnPercentage }
        };
      } catch (error) {
        console.error(`Failed to fetch historical data for ${symbol}:`, error);
      }
    }
    
    return results;
  }

  async getHistoricalSeries(symbols: string[], days: number): Promise<{ [symbol: string]: { date: string; price: number }[] }> {
    const results: { [symbol: string]: { date: string; price: number }[] } = {};
    
    for (const symbol of symbols) {
      const coinId = await this.resolveCoinId(symbol);
      if (!coinId) continue;

      try {
        const response = await fetch(
          `${this.BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
          { headers: this.getHeaders() }
        );
        
        if (!response.ok) continue;
        
        const data: CoinGeckoHistoricalData = await response.json();
        results[symbol.toUpperCase()] = (data.prices || []).map(([ts, price]) => ({
          date: new Date(ts).toISOString(),
          price
        }));
      } catch (error) {
        console.error(`Failed to fetch historical series for ${symbol}:`, error);
      }
    }
    
    return results;
  }
}
