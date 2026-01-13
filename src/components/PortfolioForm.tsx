import React, { useState, useEffect, useRef } from 'react';
import { PortfolioAllocation, AutocompleteOption } from '@/types/portfolio';
import { getTokenLogo } from '@/data/tokenLogos';

interface PortfolioFormProps {
  initialAllocation: PortfolioAllocation[];
  onSubmit: (allocation: PortfolioAllocation[]) => void;
}

const DEFAULT_TOKENS = ['BTC', 'ETH', 'SOL', 'USDC'];

type PresetPortfolio = {
  name: string;
  allocation: PortfolioAllocation[];
};

const PRESET_PORTFOLIOS: PresetPortfolio[] = [
  {
    name: 'Dupla Clássica',
    allocation: [
      { token: 'BTC', percentage: 60 },
      { token: 'ETH', percentage: 40 },
    ],
  },
  {
    name: 'Blue Chips + Caixa',
    allocation: [
      { token: 'BTC', percentage: 45 },
      { token: 'ETH', percentage: 35 },
      { token: 'SOL', percentage: 10 },
      { token: 'USDC', percentage: 10 },
    ],
  },
  {
    name: 'Defensiva',
    allocation: [
      { token: 'BTC', percentage: 35 },
      { token: 'ETH', percentage: 25 },
      { token: 'USDC', percentage: 30 },
      { token: 'LINK', percentage: 10 },
    ],
  },
  {
    name: 'ETH + L2s',
    allocation: [
      { token: 'ETH', percentage: 40 },
      { token: 'BTC', percentage: 25 },
      { token: 'ARB', percentage: 10 },
      { token: 'OP', percentage: 10 },
      { token: 'USDC', percentage: 15 },
    ],
  },
  {
    name: 'DeFi Core',
    allocation: [
      { token: 'BTC', percentage: 30 },
      { token: 'ETH', percentage: 30 },
      { token: 'LINK', percentage: 10 },
      { token: 'UNI', percentage: 10 },
      { token: 'AAVE', percentage: 10 },
      { token: 'USDC', percentage: 10 },
    ],
  },
  {
    name: 'Agressiva L1',
    allocation: [
      { token: 'BTC', percentage: 25 },
      { token: 'ETH', percentage: 25 },
      { token: 'SOL', percentage: 18 },
      { token: 'AVAX', percentage: 12 },
      { token: 'LINK', percentage: 10 },
      { token: 'USDC', percentage: 10 },
    ],
  },
  {
    name: 'Alt Diversificada (8)',
    allocation: [
      { token: 'BTC', percentage: 20 },
      { token: 'ETH', percentage: 20 },
      { token: 'SOL', percentage: 15 },
      { token: 'AVAX', percentage: 10 },
      { token: 'LINK', percentage: 10 },
      { token: 'MATIC', percentage: 10 },
      { token: 'DOT', percentage: 10 },
      { token: 'USDC', percentage: 5 },
    ],
  },
  {
    name: 'DeFi Yield (LST + DeFi)',
    allocation: [
      { token: 'BTC', percentage: 20 },
      { token: 'ETH', percentage: 25 },
      { token: 'LDO', percentage: 15 }, // Lido
      { token: 'PENDLE', percentage: 10 },
      { token: 'AAVE', percentage: 10 },
      { token: 'UNI', percentage: 8 },
      { token: 'ETHFI', percentage: 7 },
      { token: 'USDC', percentage: 5 },
    ],
  },
  {
    name: 'Solana Ecosystem',
    allocation: [
      { token: 'BTC', percentage: 20 },
      { token: 'SOL', percentage: 35 },
      { token: 'JUP', percentage: 15 },
      { token: 'JITO', percentage: 10 },
      { token: 'RNDR', percentage: 10 }, // Render
      { token: 'USDC', percentage: 10 },
    ],
  },
  {
    name: 'RWA + Infra',
    allocation: [
      { token: 'BTC', percentage: 30 },
      { token: 'ETH', percentage: 25 },
      { token: 'ONDO', percentage: 15 },
      { token: 'LINK', percentage: 15 },
      { token: 'BNB', percentage: 10 },
      { token: 'USDC', percentage: 5 },
    ],
  },
  {
    name: 'Memes (Pimenta)',
    allocation: [
      { token: 'BTC', percentage: 35 },
      { token: 'ETH', percentage: 25 },
      { token: 'DOGE', percentage: 15 },
      { token: 'PEPE', percentage: 10 },
      { token: 'WIF', percentage: 7 },
      { token: 'DOG', percentage: 3 },
      { token: 'USDC', percentage: 5 },
    ],
  },
  {
    name: 'L1 Next Gen',
    allocation: [
      { token: 'BTC', percentage: 25 },
      { token: 'ETH', percentage: 20 },
      { token: 'APT', percentage: 10 }, // Aptos
      { token: 'SUI', percentage: 10 },
      { token: 'SEI', percentage: 10 },
      { token: 'STX', percentage: 10 }, // Stacks
      { token: 'BNB', percentage: 10 },
      { token: 'USDC', percentage: 5 },
    ],
  },
  {
    name: 'Perps + Infra',
    allocation: [
      { token: 'BTC', percentage: 30 },
      { token: 'ETH', percentage: 25 },
      { token: 'HYPE', percentage: 10 },
      { token: 'SOL', percentage: 10 },
      { token: 'LINK', percentage: 10 },
      { token: 'USDC', percentage: 15 },
    ],
  },
];

export default function PortfolioForm({ initialAllocation, onSubmit }: PortfolioFormProps) {
  const [allocation, setAllocation] = useState<PortfolioAllocation[]>(() => {
    // Initialize with initialAllocation or defaults
    if (initialAllocation && initialAllocation.length > 0) {
      return initialAllocation;
    }
    return [
      { token: 'BTC', percentage: 40 },
      { token: 'ETH', percentage: 30 },
      { token: 'SOL', percentage: 20 },
      { token: 'USDC', percentage: 10 },
    ];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AutocompleteOption[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [customLogos, setCustomLogos] = useState<Record<string, string>>({});
  const searchRef = useRef<HTMLDivElement>(null);
  
  const totalPercentage = allocation.reduce((sum, item) => sum + item.percentage, 0);
  const isValid = Math.abs(totalPercentage - 100) < 0.1;

  // Close search on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search-coins?q=${encodeURIComponent(query)}`);
      const results = await response.json();
      setSearchResults(results.slice(0, 8));
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const loadTopCoins = async () => {
    setIsSearching(true);
    try {
      const response = await fetch('/api/search-coins?top=true');
      const results = await response.json();
      const existing = new Set(allocation.map(a => a.token.toUpperCase()));
      setSearchResults(results.filter((r: AutocompleteOption) => !existing.has(r.symbol)));
    } catch (error) {
      console.error('Load top coins error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const addToken = (token: string, imageUrl?: string) => {
    if (!allocation.find(item => item.token.toUpperCase() === token.toUpperCase())) {
      setAllocation(prev => [...prev, { token: token.toUpperCase(), percentage: 0 }]);
    }
    if (imageUrl) {
      setCustomLogos(prev => ({ ...prev, [token.toUpperCase()]: imageUrl }));
    }
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  const removeToken = (token: string) => {
    setAllocation(prev => prev.filter(item => item.token !== token));
  };

  const updatePercentage = (token: string, value: number) => {
    setAllocation(prev =>
      prev.map(item =>
        item.token === token
          ? { ...item, percentage: Math.max(0, Math.min(100, value)) }
          : item
      )
    );
  };

  const distributeEvenly = () => {
    const count = allocation.length;
    if (count === 0) return;
    const even = Math.floor((100 / count) * 10) / 10;
    const remainder = Math.round((100 - even * count) * 10) / 10;
    setAllocation(prev =>
      prev.map((item, idx) => ({
        ...item,
        percentage: idx === 0 ? even + remainder : even,
      }))
    );
  };

  const applyRandomPortfolio = () => {
    if (PRESET_PORTFOLIOS.length === 0) return;
    const preset = PRESET_PORTFOLIOS[Math.floor(Math.random() * PRESET_PORTFOLIOS.length)];
    // Clona pra evitar mutação acidental e garante token uppercase
    setAllocation(preset.allocation.map(a => ({ token: a.token.toUpperCase(), percentage: a.percentage })));
    setCustomLogos({});
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }
    onSubmit(allocation.filter(a => a.percentage > 0));
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-paradigma-mint/10 border border-paradigma-mint/30 rounded-full mb-6">
          <span className="text-paradigma-mint text-sm font-medium">Passo 1 de 3</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
          Monte seu <span className="gradient-text">Portfólio</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Adicione os ativos que você possui e defina a porcentagem de cada um.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Token Grid */}
        <div className="glass-card-solid rounded-3xl p-8 border border-paradigma-navy/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Seus Ativos</h3>
            <button
              type="button"
              onClick={applyRandomPortfolio}
              className="text-sm text-paradigma-mint hover:text-paradigma-mint-light transition-colors font-semibold inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-paradigma-mint/10 border border-paradigma-mint/25 hover:bg-paradigma-mint/15"
            >
              <span>🎲</span>
              Carteira Aleatória
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {allocation.map((item) => (
              <div key={item.token} className="token-card group">
                <button
                  type="button"
                  onClick={() => removeToken(item.token)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-danger rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <span className="text-white text-sm">×</span>
                </button>
                
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-paradigma-navy p-1 ring-2 ring-paradigma-navy group-hover:ring-paradigma-mint/50 transition-all">
                      <img
                        src={customLogos[item.token.toUpperCase()] || getTokenLogo(item.token)}
                        alt={item.token}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = `https://ui-avatars.com/api/?name=${item.token}&background=3ecf8e&color=1a1b4b&size=64&bold=true`;
                        }}
                      />
                    </div>
                  </div>
                  
                  <span className="text-white font-bold text-sm mb-3">{item.token}</span>
                  
                  <div className="relative w-full">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="0"
                      max="100"
                      value={item.percentage || ''}
                      onChange={(e) => updatePercentage(item.token, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full py-2 px-3 bg-paradigma-darker border border-paradigma-navy rounded-xl text-center text-white font-semibold focus:ring-2 focus:ring-paradigma-mint focus:border-transparent transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Token Button */}
            <div ref={searchRef} className="relative z-[200]">
              <button
                type="button"
                onClick={() => {
                  setShowSearch(!showSearch);
                  if (!showSearch) loadTopCoins();
                }}
                className="token-card w-full h-full min-h-[160px] flex flex-col items-center justify-center border-2 border-dashed border-paradigma-navy hover:border-paradigma-mint/50 transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-paradigma-navy flex items-center justify-center mb-3 group-hover:bg-paradigma-mint/20 transition-colors">
                  <span className="text-2xl text-paradigma-mint">+</span>
                </div>
                <span className="text-gray-400 text-sm group-hover:text-paradigma-mint transition-colors">
                  Adicionar Ativo
                </span>
              </button>

              {/* Search Dropdown - rendered above all layers */}
              {showSearch && (
                <div className="fixed left-1/2 -translate-x-1/2 top-24 md:top-28 w-[min(90vw,420px)] glass-card-solid rounded-2xl overflow-hidden z-[4000] min-w-[300px] border border-paradigma-mint/30 shadow-2xl shadow-paradigma-mint/15">
                  <div className="p-3 border-b border-paradigma-navy/50">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Buscar token..."
                      className="w-full py-2 px-4 bg-paradigma-darker border border-paradigma-navy/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-paradigma-mint focus:border-transparent transition-all"
                      autoFocus
                    />
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-400">
                        <div className="animate-spin w-6 h-6 border-2 border-paradigma-mint border-t-transparent rounded-full mx-auto mb-2" />
                        Buscando...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="p-2">
                        {searchResults.map((result) => (
                          <button
                            key={result.symbol}
                            type="button"
                            onClick={() => addToken(result.symbol, result.image)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-paradigma-navy/50 rounded-xl transition-colors"
                          >
                            <img
                              src={result.image || getTokenLogo(result.symbol)}
                              alt={result.symbol}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.src = `https://ui-avatars.com/api/?name=${result.symbol}&background=3ecf8e&color=1a1b4b&size=32&bold=true`;
                              }}
                            />
                            <div className="text-left">
                              <div className="text-white font-semibold">{result.symbol}</div>
                              <div className="text-gray-400 text-xs truncate max-w-[150px]">{result.name}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : searchQuery.length >= 2 ? (
                      <div className="p-4 text-center text-gray-400">
                        Nenhum token encontrado
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        Digite para buscar ou selecione abaixo
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!isValid || allocation.length === 0}
            className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continuar para Perfil
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
