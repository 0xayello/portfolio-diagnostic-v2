import React from 'react';

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
}

export default function Header({ currentStep, totalSteps }: HeaderProps) {
  const steps = [
    { num: 1, label: 'Portfólio', icon: '📊' },
    { num: 2, label: 'Perfil', icon: '👤' },
    { num: 3, label: 'Diagnóstico', icon: '🎯' },
  ];

  return (
    <header className="relative z-20">
      {/* Top Bar - show only on step 3 */}
      {currentStep === 3 && (
        <div className="bg-gradient-hero py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <span className="text-white text-sm font-medium flex items-center gap-3">
              <span className="text-xl">💎</span>
              Quer uma análise personalizada? Entre para o Paradigma PRO e tenha acesso 24/7 aos nossos analistas.
              <button className="ml-2 px-4 py-1.5 rounded-full bg-white/95 text-orange-600 font-bold text-xs hover:bg-white hover:scale-105 transition-all shadow-md whitespace-nowrap">
                🎁 Cupom PORTFOLIO: 6%&nbsp;OFF
              </button>
            </span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-paradigma-dark/80 backdrop-blur-lg border-b border-paradigma-navy">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.location.href = '/'}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                <img
                  src="https://app.paradigma.education/static/media/logo-mobile.412f0d5cd6f39d2c80bc.png"
                  alt="Paradigma"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-display">Paradigma</h1>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="hidden md:flex items-center gap-2">
              {steps.map((step, idx) => (
                <React.Fragment key={step.num}>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    step.num === currentStep
                      ? 'bg-paradigma-mint/20 border border-paradigma-mint'
                      : step.num < currentStep
                      ? 'bg-paradigma-navy/50'
                      : 'bg-transparent'
                  }`}>
                    <span className={`text-lg ${step.num <= currentStep ? '' : 'grayscale opacity-50'}`}>
                      {step.icon}
                    </span>
                    <span className={`text-sm font-medium ${
                      step.num === currentStep 
                        ? 'text-paradigma-mint' 
                        : step.num < currentStep 
                        ? 'text-gray-300'
                        : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                    {step.num < currentStep && (
                      <span className="text-paradigma-mint">✓</span>
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-8 h-0.5 ${
                      step.num < currentStep ? 'bg-paradigma-mint' : 'bg-paradigma-navy'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mobile Step Indicator */}
            <div className="md:hidden flex items-center gap-2">
              <span className="text-paradigma-mint font-bold">{currentStep}</span>
              <span className="text-gray-500">/</span>
              <span className="text-gray-400">{totalSteps}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
