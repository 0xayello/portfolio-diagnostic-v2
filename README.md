# 🚀 Diagnóstico de Portfólio Cripto - Paradigma Education

Uma ferramenta moderna de diagnóstico de portfólio de criptomoedas com análise por Inteligência Artificial.

![Paradigma Education](https://paradigma.education/logo.png)

## ✨ Funcionalidades

### 🎨 Design Moderno
- Interface dark mode com cores da marca Paradigma
- Glassmorphism e animações suaves
- Totalmente responsivo para mobile e desktop
- Logos oficiais de 80+ criptomoedas

### 📊 Formulário de Portfólio
- Busca inteligente de criptomoedas via CoinGecko API
- Cards visuais com logos de cada ativo
- Distribuição automática de percentuais
- Validação em tempo real

### 🎯 Quiz de Perfil
- Horizonte de investimento (Curto/Médio/Longo prazo)
- Tolerância ao risco (Arrojado/Moderado/Conservador)
- Múltiplos objetivos de investimento

### 🤖 Análise por IA (OpenAI GPT-4)
- Diagnóstico personalizado baseado no perfil
- Avaliação de risco detalhada
- Pontos fortes e fracos identificados
- Recomendações acionáveis
- Score de aderência (0-100)

### 📈 Resultados Visuais
- Gráfico de alocação por ativo
- Breakdown por setor
- Flags de alerta (Verde/Amarelo/Vermelho)
- Análise detalhada em markdown

## 🛠️ Tecnologias

- **Framework**: Next.js 14 + TypeScript
- **Estilização**: Tailwind CSS
- **Gráficos**: Chart.js + react-chartjs-2
- **IA**: OpenAI GPT-4 API
- **API de Dados**: CoinGecko

## 🚀 Instalação

### 1. Clone ou copie o projeto

```bash
cd portfolio-diagnostic-v2
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `env.template` para `.env.local`:

```bash
cp env.template .env.local
```

Edite `.env.local` e adicione suas chaves de API:

```env
# OpenAI API Key (obrigatório para análise por IA)
OPENAI_API_KEY=sk-...

# CoinGecko API Key (opcional, melhora rate limits)
COINGECKO_API_KEY=cg-...
```

### 4. Execute o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📦 Deploy

### Vercel (Recomendado)

1. Faça push do código para um repositório Git
2. Conecte o repositório no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente no dashboard
4. Deploy automático!

### Build Manual

```bash
npm run build
npm start
```

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `OPENAI_API_KEY` | Chave da API OpenAI para análise por IA | ✅ Para IA |
| `COINGECKO_API_KEY` | Chave da API CoinGecko | ❌ |

> **Nota**: Sem a `OPENAI_API_KEY`, a aplicação usa uma análise baseada em regras como fallback.

## 🎯 Uso

1. **Monte seu Portfólio**: Adicione seus ativos cripto e defina a porcentagem de cada um (total = 100%)

2. **Responda o Quiz**: Defina seu horizonte de investimento, tolerância ao risco e objetivos

3. **Receba seu Diagnóstico**: A IA analisa seu portfólio considerando seu perfil e gera um relatório completo

## 🧩 Estrutura do Projeto

```
portfolio-diagnostic-v2/
├── src/
│   ├── components/        # Componentes React
│   │   ├── Header.tsx
│   │   ├── PortfolioForm.tsx
│   │   ├── ProfileQuiz.tsx
│   │   └── DiagnosticResults.tsx
│   ├── pages/            # Rotas Next.js
│   │   ├── index.tsx
│   │   └── api/
│   │       ├── diagnostic.ts
│   │       └── search-coins.ts
│   ├── services/         # Lógica de negócio
│   │   ├── aiDiagnostic.ts
│   │   └── coingecko.ts
│   ├── data/             # Dados estáticos
│   │   ├── sectors.json
│   │   └── tokenLogos.ts
│   ├── types/            # TypeScript types
│   └── styles/           # CSS global
├── public/               # Assets estáticos
└── package.json
```

## 🎨 Personalização

### Cores
Edite `tailwind.config.js` para alterar as cores da marca:

```js
colors: {
  paradigma: {
    dark: '#0f1120',
    navy: '#1a1b4b',
    mint: '#3ecf8e',
    // ...
  }
}
```

### Setores e Classificação
Edite `src/data/sectors.json` para adicionar ou modificar a classificação de tokens.

## 📄 Licença

Este projeto é propriedade da Paradigma Education.

## 🔗 Links

- [Paradigma Education](https://paradigma.education)
- [Twitter @ParadigmaEdu](https://x.com/ParadigmaEdu)
- [YouTube](https://www.youtube.com/@ParadigmaEducation)
- [Instagram](https://www.instagram.com/paradigma.education/)
