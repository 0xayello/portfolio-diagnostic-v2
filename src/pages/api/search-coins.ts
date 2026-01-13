import type { NextApiRequest, NextApiResponse } from 'next';
import { CoinGeckoService } from '@/services/coingecko';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, top } = req.query;

  try {
    const coinGeckoService = new CoinGeckoService();

    // Return top coins
    if (top === 'true') {
      const results = await coinGeckoService.getTopCoins(200);
      // Filter out common ones that are usually pre-selected
      const filtered = results.filter(
        r => !['BTC', 'ETH', 'SOL', 'USDC', 'USDT'].includes(r.symbol)
      );
      return res.status(200).json(filtered);
    }

    // Search by query
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const results = await coinGeckoService.searchCoins(q, 50);
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error in search-coins:', error);
    return res.status(500).json({ error: 'Failed to search coins' });
  }
}
