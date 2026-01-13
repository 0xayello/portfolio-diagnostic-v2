import React, { useState } from 'react';
import { InvestorProfile } from '@/types/portfolio';

interface ProfileQuizProps {
  onSubmit: (profile: InvestorProfile) => void;
  onBack: () => void;
  loading: boolean;
}

export default function ProfileQuiz({ onSubmit, onBack, loading }: ProfileQuizProps) {
  const [profile, setProfile] = useState<Partial<InvestorProfile>>({
    horizon: undefined,
    riskTolerance: undefined,
    cryptoPercentage: 50,
    objective: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!profile.horizon) newErrors.horizon = 'Selecione seu horizonte de investimento';
    if (!profile.riskTolerance) newErrors.riskTolerance = 'Selecione sua tolerância ao risco';
    if (!profile.objective?.length) newErrors.objective = 'Selecione pelo menos um objetivo';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(profile as InvestorProfile);
    }
  };

  const handleSelect = (field: keyof InvestorProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleObjective = (value: 'preserve' | 'passive_income' | 'multiply') => {
    const current = profile.objective || [];
    const newObjectives = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    handleSelect('objective', newObjectives);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-paradigma-mint/10 border border-paradigma-mint/30 rounded-full mb-6">
          <span className="text-paradigma-mint text-sm font-medium">Passo 2 de 3</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
          Qual seu <span className="gradient-text">Perfil</span>?
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Responda algumas perguntas para personalizarmos seu diagnóstico
          de acordo com seus objetivos e tolerância ao risco.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl mx-auto">
        {/* Question 1: Horizonte */}
        <div className="glass-card-solid rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-paradigma-mint rounded-xl flex items-center justify-center text-paradigma-dark font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-white">
              Qual é seu horizonte de investimento?
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { value: 'short', label: 'Curto Prazo', desc: 'Até 1 ano', icon: '⚡' },
              { value: 'medium', label: 'Médio Prazo', desc: '1 a 3 anos', icon: '📈' },
              { value: 'long', label: 'Longo Prazo', desc: 'Mais de 3 anos', icon: '🎯' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect('horizon', option.value)}
                className={`selection-card text-left ${
                  profile.horizon === option.value ? 'selected' : ''
                }`}
              >
                <div className="text-4xl mb-4">{option.icon}</div>
                <div className="text-white font-semibold text-lg mb-1">{option.label}</div>
                <div className="text-gray-400 text-sm">{option.desc}</div>
                {profile.horizon === option.value && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-paradigma-mint rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-paradigma-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {errors.horizon && (
            <p className="text-danger text-sm mt-4 flex items-center gap-2">
              <span>⚠️</span> {errors.horizon}
            </p>
          )}
        </div>

        {/* Question 2: Risk Tolerance */}
        <div className="glass-card-solid rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-paradigma-mint rounded-xl flex items-center justify-center text-paradigma-dark font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold text-white">
              Qual é sua tolerância ao risco?
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { 
                value: 'high', 
                label: 'Arrojado', 
                desc: 'Aceita alto risco por maior retorno', 
                icon: '🚀',
                color: 'text-coral'
              },
              { 
                value: 'medium', 
                label: 'Moderado', 
                desc: 'Equilíbrio entre risco e retorno', 
                icon: '⚖️',
                color: 'text-warning'
              },
              { 
                value: 'low', 
                label: 'Conservador', 
                desc: 'Preservar capital com baixo risco', 
                icon: '🛡️',
                color: 'text-paradigma-mint'
              },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect('riskTolerance', option.value)}
                className={`selection-card text-left ${
                  profile.riskTolerance === option.value ? 'selected' : ''
                }`}
              >
                <div className="text-4xl mb-4">{option.icon}</div>
                <div className="text-white font-semibold text-lg mb-1">{option.label}</div>
                <div className="text-gray-400 text-sm">{option.desc}</div>
                {profile.riskTolerance === option.value && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-paradigma-mint rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-paradigma-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {errors.riskTolerance && (
            <p className="text-danger text-sm mt-4 flex items-center gap-2">
              <span>⚠️</span> {errors.riskTolerance}
            </p>
          )}
        </div>

        {/* Question 3: Objectives */}
        <div className="glass-card-solid rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-paradigma-mint rounded-xl flex items-center justify-center text-paradigma-dark font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold text-white">
              Quais são seus objetivos?
            </h3>
          </div>
          <p className="text-gray-400 text-sm mb-6 ml-13">Selecione um ou mais</p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { 
                value: 'preserve' as const, 
                label: 'Preservar Capital', 
                desc: 'Proteger contra inflação', 
                icon: '💰'
              },
              { 
                value: 'passive_income' as const, 
                label: 'Renda Passiva', 
                desc: 'Staking e DeFi yield', 
                icon: '💎'
              },
              { 
                value: 'multiply' as const, 
                label: 'Multiplicar Capital', 
                desc: 'Crescimento agressivo', 
                icon: '📊'
              },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleObjective(option.value)}
                className={`selection-card text-left ${
                  profile.objective?.includes(option.value) ? 'selected' : ''
                }`}
              >
                <div className="text-4xl mb-4">{option.icon}</div>
                <div className="text-white font-semibold text-lg mb-1">{option.label}</div>
                <div className="text-gray-400 text-sm">{option.desc}</div>
                {profile.objective?.includes(option.value) && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-paradigma-mint rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-paradigma-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {errors.objective && (
            <p className="text-danger text-sm mt-4 flex items-center gap-2">
              <span>⚠️</span> {errors.objective}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-lg px-12 py-4 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-paradigma-dark border-t-transparent rounded-full mr-3" />
                🔍 Analisando...
              </>
            ) : (
              <>
                Gerar Diagnóstico
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
