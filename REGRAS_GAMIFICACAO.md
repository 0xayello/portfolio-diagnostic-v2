# 🎮 Regras de Gamificação - Diagnóstico de Portfólio Cripto

Este documento descreve todas as regras de gamificação implementadas na ferramenta de diagnóstico.

---

## 🦁 Perfil de Investidor (Animais)

O Spirit Animal é atribuído com base na composição do portfólio. A ordem de prioridade é:

| Animal | Emoji | Critério | Descrição |
|--------|-------|----------|-----------|
| Polvo | 🐙 | 8+ ativos diferentes | "Tentáculos em todo lugar. Diversificação é seu lema." |
| Shiba | 🐕 | Memecoins + >20% altcoins | "Você gosta de viver perigosamente! Degen assumido." |
| Tartaruga | 🐢 | 30%+ em stablecoins | "Devagar e sempre. Você prioriza segurança acima de tudo." |
| Leão | 🦁 | 50%+ em BTC | "O rei da selva crypto. Você aposta no líder do mercado." |
| Raposa | 🦊 | 40%+ em ETH | "Esperto e versátil. Você acredita na inovação do Ethereum." |
| Fênix | 🔥 | 30%+ em SOL | "Renasce das cinzas. Heavy em SOL e projetos de recuperação." |
| Águia | 🦅 | 40%+ em altcoins (exceto BTC/ETH) | "Visão aguçada para oportunidades. Caçador de altcoins." |
| Lobo | 🐺 | Score 85+ com 4+ ativos (default) | "Estrategista nato. Equilíbrio perfeito entre risco e segurança." |

---

## 🏆 Sistema de Conquistas (Badges)

| Badge | Emoji | Critério para Desbloquear |
|-------|-------|---------------------------|
| Hodler de Ferro | 🏅 | 50%+ do portfólio em Bitcoin |
| Diversificador Master | 🎯 | Exposição a 5+ setores diferentes |
| Diamond Hands | 💎 | 80%+ do portfólio em Bitcoin |
| To the Moon | 🌙 | 30%+ em altcoins de alto potencial |
| Escudo de Aço | 🛡️ | 20%+ em stablecoins para proteção |
| Degen Assumido | 🎰 | Possui pelo menos uma memecoin |
| Equilibrista | ⚖️ | Score de aderência 90+ |
| Visionário | 🔮 | 6+ ativos no portfólio |
| Minimalista | 🎍 | Apenas 3 ou menos ativos |

---

## 🌡️ Termômetro FOMO vs HODL

Calcula o "temperamento" do portfólio baseado na composição:

### Fórmula
- **Score HODL** = (BTC% × 0.8) + (ETH% × 0.6) + (Stablecoins% × 1.0)
- **Score FOMO** = (Altcoins% × 0.7) + (Memecoins% × 1.5)
- **Porcentagem FOMO** = FOMO / (HODL + FOMO) × 100

### Níveis

| Porcentagem | Emoji | Descrição |
|-------------|-------|-----------|
| 0-20% | 🧊 | "Você é frio como gelo. Paciência é sua maior virtude." |
| 21-40% | ❄️ | "Racional e calculista. Você não se deixa levar pela emoção." |
| 41-60% | ⚖️ | "Você tem um pé na racionalidade, mas não resiste a uma oportunidade." |
| 61-80% | 🌡️ | "O mercado te empolga! Você gosta de surfar as tendências." |
| 81-100% | 🔥 | "Degen mode ativado! Você vive no limite." |

---

## 👥 Comparação com Celebridades

O portfólio é comparado com perfis de investidores famosos:

| Celebridade | Critério Principal |
|-------------|-------------------|
| Michael Saylor | 80%+ em BTC = 95% match |
| Vitalik Buterin | 50%+ em ETH = 90% match |
| CZ (Changpeng Zhao) | BNB 20%+ OU 5+ ativos diversificados = 80% match |
| Elon Musk | Memecoins 20%+ = 90% match |
| Cathie Wood | BTC 30%+ E ETH 20%+ E 4+ ativos = 85% match |
| Seu Vizinho Crypto | Memecoins 40%+ OU 10+ ativos = 95% match |

---

## ⏰ Time Machine

Simula como o portfólio teria performado em diferentes momentos históricos:

| Data | Evento | Descrição |
|------|--------|-----------|
| Janeiro 2021 | Pré-Bull Run | Antes da grande alta de 2021 |
| Novembro 2021 | ATH (Topo Histórico) | Pior momento para comprar |
| Novembro 2022 | Quebra da FTX | O colapso que abalou o mercado crypto |
| Janeiro 2023 | Fundo do Bear | No fundo do bear market - melhor momento |
| Abril 2024 | Halving do Bitcoin | No momento do 4º halving |

### Multiplicadores por Cenário

Os multiplicadores representam quanto cada ativo multiplicou desde aquela data até hoje (aproximado):

**Janeiro 2021:**
- BTC: 2.1x, ETH: 3.5x, SOL: 25x, DOGE: 50x, SHIB: 500x

**Novembro 2021 (ATH):**
- BTC: 0.6x, ETH: 0.5x, SOL: 0.35x (perdas significativas)

**Novembro 2022 (FTX):**
- BTC: 2.8x, ETH: 3.2x, SOL: 12x, FTT: 0.02x (quase total perda)

---

## 🥇 Sistema de Ranking

Compara o portfólio com outros usuários (simulado):

| Métrica | Cálculo Base |
|---------|-------------|
| Overall | Score × 0.9 + variação |
| Diversificação | Baseado no número de ativos (6+ = Top 15%) |
| Gestão de Risco | Stablecoins% × 0.8 + BTC/ETH% × 0.5 |
| Potencial de Valorização | 100 - Stablecoins% × 0.8 - BTC/ETH% × 0.2 |

---

## 💬 Frases Motivacionais

As frases são selecionadas aleatoriamente baseadas no score:

### Score Alto (80+)
- "Warren Buffett estaria orgulhoso... se ele investisse em crypto."
- "Seu portfólio está mais sólido que a convicção de um maximalista."
- "Se investir fosse esporte, você estaria nas Olimpíadas."

### Score Médio (60-79)
- "Não está ruim, mas também não está no caminho da Lambo."
- "Seu portfólio tem potencial, só precisa de uns ajustes."
- "Você está melhor que a média, mas sabemos que você pode mais!"

### Score Baixo (<60)
- "Seu portfólio precisa de terapia. Nós podemos ajudar."
- "Já considerou pedir conselhos para alguém que não seja do Twitter?"
- "Você está a uma rugpull de virar meme você mesmo."

### Memecoins (30%+)
- "Você realmente gosta de viver perigosamente, né?"
- "YOLO é estilo de vida, não estratégia de investimento."
- "Degen mode: ATIVADO. Boa sorte, guerreiro."

---

## 📋 Classificação de Ativos

### Stablecoins
USDT, USDC, DAI, BUSD, TUSD, USDP, FRAX, LUSD

### Memecoins
DOGE, SHIB, PEPE, FLOKI, BONK, WIF, MEME, WOJAK, BRETT, POPCAT

### Criptos Consolidadas (Majors)
BTC, ETH, SOL

---

## 📝 Notas de Implementação

1. Todos os cálculos são feitos no client-side
2. Os multiplicadores do Time Machine são aproximados e para fins educativos
3. O ranking é simulado e não representa dados reais de outros usuários
4. As fotos de celebridades são carregadas via URLs externas (Twitter)
