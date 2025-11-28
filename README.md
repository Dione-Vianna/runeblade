# ⚔️ RuneBlade - Card RPG

Um RPG de cartas estilo roguelike desenvolvido em React + TypeScript, inspirado em jogos como Slay the Spire.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Zustand](https://img.shields.io/badge/Zustand-5-orange)

## 🎮 Sobre o Jogo

RuneBlade é um jogo de cartas estratégico onde você enfrenta inimigos usando um deck de cartas com ataques, defesas, magias e habilidades especiais.

### Características

- ⚔️ **Sistema de Combate por Turnos** - Jogue cartas estrategicamente para derrotar seus inimigos
- 🃏 **17 Cartas Únicas** - Ataques, defesas, magias, buffs e debuffs
- 👹 **5 Inimigos Diferentes** - Do Goblin ao Dragão Ancião
- 🤖 **IA Inteligente** - 4 comportamentos de IA (agressivo, defensivo, balanceado, aleatório)
- 💀 **Efeitos de Status** - Veneno, sangramento, regeneração, força, fraqueza e mais
- 🎯 **Sistema de Intenção** - Veja a próxima ação do inimigo

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

Acesse `http://localhost:5173` no navegador.

## 📁 Arquitetura do Projeto

```
src/
├── components/           # Camada de UI (React)
│   ├── Card/            # Componente de carta
│   ├── Hand/            # Mão do jogador
│   ├── Board/           # Tabuleiro de jogo
│   ├── Status/          # Barras de vida/mana/armadura
│   ├── Buttons/         # Botões do jogo
│   └── Layout/          # Layout principal
│
├── game/                 # Lógica do jogo (independente de UI)
│   ├── core/            # Engine do jogo
│   │   ├── GameEngine   # Orquestrador principal
│   │   ├── TurnManager  # Gerenciador de turnos
│   │   ├── CardEngine   # Processador de efeitos de cartas
│   │   └── EnemyAI      # Inteligência artificial
│   ├── data/            # Dados estáticos
│   │   ├── cards        # Definições de cartas
│   │   ├── enemies      # Definições de inimigos
│   │   └── player       # Configuração inicial
│   ├── state/           # Estado global (Zustand)
│   ├── types/           # Tipos TypeScript
│   └── utils/           # Funções utilitárias
│
├── hooks/               # Hooks React personalizados
│   └── useGameEngine    # Hook principal do jogo
│
└── pages/               # Páginas da aplicação
    └── GamePage/        # Página principal do jogo
```

## 🎴 Tipos de Cartas

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| ⚔️ **Ataque** | Causa dano ao inimigo | Golpe, Golpe Pesado, Golpe Perfurante |
| 🛡️ **Defesa** | Ganha armadura | Defender, Muralha de Ferro |
| ✨ **Magia** | Dano mágico ou cura | Bola de Fogo, Luz Curativa, Relâmpago |
| ⬆️ **Buff** | Melhora suas estatísticas | Grito de Guerra, Regeneração |
| ⬇️ **Debuff** | Enfraquece o inimigo | Veneno, Enfraquecer, Sangramento |

## 👹 Inimigos

| Inimigo | HP | Dificuldade |
|---------|-----|-------------|
| Goblin | 25 | ⭐ |
| Esqueleto | 20 | ⭐ |
| Orc Guerreiro | 45 | ⭐⭐ |
| Cavaleiro das Trevas | 70 | ⭐⭐⭐ |
| Dragão Ancião | 150 | ⭐⭐⭐⭐ (Boss) |

## 🔧 Tecnologias

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Zustand** - Gerenciamento de estado
- **CSS Modules** - Estilização

## 🗺️ Sistema de Mapas

O jogo possui um sistema de mapas procedurais estilo Slay the Spire:

### Tipos de Nós

| Tipo | Ícone | Descrição |
|------|-------|-----------|
| Inimigo | 👹 | Batalha contra inimigo normal |
| Elite | 💀 | Inimigo mais forte, melhor recompensa |
| Chefe | 👑 | Boss da fase |
| Descanso | 🔥 | Fogueira para curar |
| Loja | 🛒 | Comprar/vender cartas |
| Evento | ❓ | Evento aleatório |
| Tesouro | 💎 | Baú com recompensas |

### Atos

1. **Floresta Sombria** - Goblins e Esqueletos
2. **Montanhas Gélidas** - Orcs e Cavaleiros
3. **Fortaleza das Trevas** - Inimigos de elite e o Dragão Ancião

## 🛒 Sistema de Loja e Coleção

### Loja

Ao visitar um nó de loja no mapa, você pode:
- 🛍️ **Comprar cartas** - Cartas disponíveis variam por ato
- 💰 **Vender cartas** - Receba 50% do valor base
- 🔄 **Atualizar estoque** - Custo aumenta a cada uso (máx. 3x)

### Raridade de Cartas

| Raridade | Ícone | Preço Base | Cor |
|----------|-------|------------|-----|
| Comum | ⚪ | 50 | Cinza |
| Incomum | 🟢 | 75 | Verde |
| Raro | 🔵 | 150 | Azul |
| Épico | 🟣 | 250 | Roxo |
| Lendário | 🟡 | 400 | Laranja |

### Coleção

- 📚 **Desbloqueie cartas** comprando na loja ou como recompensa
- 📦 **Gerencie seu deck** - Mínimo 8 cartas, máximo 20
- 💾 **Progresso salvo** - Suas cartas desbloqueadas são persistidas

## 🎯 Roadmap

- [x] Sistema de mapas e fases
- [x] Coleção de cartas desbloqueáveis
- [x] Sistema de raridade com drops
- [ ] Modo história
- [ ] Animações de combate
- [ ] Sistema de save/load
- [ ] Mais inimigos e bosses
- [ ] Multiplayer

## 📝 Licença

MIT License - Sinta-se livre para usar e modificar!
