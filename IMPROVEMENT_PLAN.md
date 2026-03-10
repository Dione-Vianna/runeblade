# RuneBlade - Plano de Melhorias UX/UI

## Passo 1: Corrigir overflow das cartas na mao

**Problema:** Cartas cortadas pela viewport, nomes truncados, empilhamento confuso no mobile.

**Arquivos:**
- `src/components/Card/Card.css`
- `src/components/Hand/Hand.css`
- `src/components/Board/Board.css`

**Tarefas:**
- [x] Reduzir card para 120x170px na mao (manter 140x200 em outros contextos via modificador)
- [x] Implementar fan effect com `transform: rotate()` progressivo por indice da carta
- [x] Adicionar hover que levanta a carta e cancela a rotacao
- [x] No mobile (<600px): cards menores (100x150px), layout horizontal com scroll
- [x] Garantir que `board__hand-area` nunca excede a viewport (`max-height: 30vh`)

---

## Passo 2: Reestruturar hierarquia visual da tela de batalha

**Problema:** Area central enorme, botao "Finalizar Turno" dominante, intent do inimigo pouco visivel.

**Arquivos:**
- `src/components/Board/Board.tsx`
- `src/components/Board/Board.css`

**Tarefas:**
- [x] Mudar grid de `1fr auto 1fr auto` para `auto auto 1fr auto` (inimigo e centro compactos)
- [x] Comprimir area central: turno como pill inline (`Turno 1 · Sua vez`)
- [x] Mover botao "Finalizar Turno" para a area da mao (canto direito, ao lado das cartas)
- [x] Aumentar destaque do intent do inimigo: icone 24px, cor mais viva, animacao `pulse` sutil
- [x] Adicionar borda glow pulsante no painel do inimigo durante turno do jogador (indica alvo)

---

## Passo 3: Adicionar feedback visual ao jogar cartas

**Problema:** Carta desaparece sem feedback claro de causa-efeito.

**Arquivos:**
- `src/components/Board/Board.tsx`
- `src/components/Card/Card.tsx`
- `src/components/Card/Card.css`
- `src/styles/animations.css`
- `src/hooks/useGameEngine.ts`

**Tarefas:**
- [x] Criar animacao `cardFlyToTarget` que move a carta em direcao ao painel do inimigo/jogador
- [x] Adicionar classe `.enemy-panel--hit` com flash vermelho + shake de 300ms
- [x] Adicionar classe `.player-panel--healed` com flash verde de 300ms
- [x] Sincronizar floating numbers para aparecer apos a animacao de voo (delay de ~400ms)
- [x] Adicionar screen shake via `transform: translate()` no `.board` para ataques pesados (>10 dano)
- [x] Feedback sonoro ja existe — garantir sincronia com animacao visual

---

## Passo 4: Melhorar legibilidade e navegacao do mapa

**Problema:** Nodes pequenos, linhas de baixo contraste, dificil distinguir estados.

**Arquivos:**
- `src/components/Map/Map.tsx`
- `src/components/Map/Map.css`

**Tarefas:**
- [x] Aumentar nodes de 50px para 64px, emojis de 20px para 28px
- [x] Caminhos disponiveis: linha solida 3px branca com glow
- [x] Caminhos bloqueados: linha dashed 1px `#444`
- [x] Node disponivel: borda branca + animacao `pulse` sutil + cursor pointer
- [x] Node completado: opacidade 0.5 + checkmark overlay
- [x] Node bloqueado: grayscale(80%) + opacidade 0.3
- [x] Node atual: borda dourada + glow forte
- [x] Adicionar tooltip no hover com tipo do node e descricao

---

## Passo 5: Padronizar unidades CSS e criar spacing tokens

**Problema:** Mix de `px` e `rem` sem padrao entre arquivos.

**Arquivos:**
- `src/index.css` (tokens)
- Todos os arquivos `.css` do projeto

**Tarefas:**
- [ ] Adicionar tokens de spacing no `:root`:
  ```css
  --space-2xs: 0.125rem;  /* 2px */
  --space-xs: 0.25rem;    /* 4px */
  --space-sm: 0.5rem;     /* 8px */
  --space-md: 0.75rem;    /* 12px */
  --space-lg: 1rem;       /* 16px */
  --space-xl: 1.5rem;     /* 24px */
  --space-2xl: 2rem;      /* 32px */
  ```
- [ ] Adicionar tokens de border-radius:
  ```css
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
  ```
- [ ] Migrar Board.css de `px` para tokens
- [ ] Migrar Card.css de `px` para tokens
- [ ] Migrar Status.css de `px` para tokens
- [ ] Migrar Buttons.css de `px` para tokens
- [ ] Migrar Hand.css de `px` para tokens
- [ ] Manter `px` apenas para: `border-width`, `box-shadow`, `text-shadow`, `outline`

---

## Passo 6: Completar sistema de design tokens (cores)

**Problema:** Dezenas de cores hardcoded espalhadas pelos CSS.

**Arquivos:**
- `src/index.css`
- Todos os arquivos `.css` que usam cores hardcoded

**Tarefas:**
- [ ] Adicionar tokens de raridade:
  ```css
  --color-rarity-common: #9d9d9d;
  --color-rarity-uncommon: #1eff00;
  --color-rarity-rare: #0070dd;
  --color-rarity-epic: #a335ee;
  --color-rarity-legendary: #ff8000;
  ```
- [ ] Adicionar tokens de tipo de carta:
  ```css
  --color-card-attack: #ff4444;
  --color-card-defense: #44aaff;
  --color-card-magic: #aa44ff;
  --color-card-buff: #44ff44;
  --color-card-debuff: #ff8844;
  ```
- [ ] Adicionar tokens de status effect:
  ```css
  --color-status-poison: #44ff44;
  --color-status-bleed: #ff4444;
  --color-status-burn: #ff8844;
  --color-status-weakness: #ff88ff;
  --color-status-strength: #ffaa44;
  --color-status-regen: #44ffaa;
  --color-status-vulnerable: #ff4488;
  --color-status-shield: #8888ff;
  ```
- [ ] Adicionar tokens de superficie:
  ```css
  --color-surface-enemy: rgba(60, 20, 20, 0.8);
  --color-surface-player: rgba(20, 40, 60, 0.8);
  --color-surface-card: linear-gradient(145deg, #2a2a3e, #1a1a2e);
  ```
- [ ] Substituir todas as cores hardcoded nos CSS por variaveis

---

## Passo 7: Corrigir header/settings no mobile

**Problema:** Header quebra para coluna no mobile, botao settings fica orfao.

**Arquivos:**
- `src/components/Layout/Layout.css`
- `src/components/Layout/Layout.tsx`

**Tarefas:**
- [ ] Remover `flex-direction: column` do media query mobile
- [ ] Header sempre em row: titulo flex:1 centralizado, settings absolute top-right
- [ ] Titulo: `20px` no mobile (em vez de 24px)
- [ ] Reduzir padding do header para `10px 16px` no mobile
- [ ] Testar em 320px, 375px, 414px

---

## Passo 8: Aumentar diferenciacao visual das cartas por tipo

**Problema:** Backgrounds das cartas muito escuros/sutis, borda fina como unica diferenciacao.

**Arquivos:**
- `src/components/Card/Card.css`

**Tarefas:**
- [ ] Adicionar faixa colorida no header da carta (8px height, cor do tipo, full width)
- [ ] Aumentar saturacao dos backgrounds:
  - Attack: `#4a1a1a` -> `#1a1010` (mais vermelho)
  - Defense: `#1a2a4a` -> `#101a2a` (mais azul)
  - Magic: `#3a1a4a` -> `#1a102a` (mais roxo)
- [ ] Aumentar borda de 2px para 3px
- [ ] Icone de tipo: 20px -> 26px
- [ ] Adicionar inner glow sutil (`inset box-shadow`) na cor do tipo

---

## Passo 9: Corrigir tamanhos de texto para acessibilidade

**Problema:** Textos de 9px e 10px ilegiveis, contraste insuficiente em labels.

**Arquivos:**
- `src/components/Card/Card.css`
- `src/components/Status/Status.css`
- `src/components/Board/Board.css`

**Tarefas:**
- [ ] `.card__description`: 10px -> 11px, `line-height: 1.4`
- [ ] `.card__rarity`: 9px -> 11px
- [ ] `.card__name`: 12px -> 13px
- [ ] `.status-effect__duration`: 10px -> 12px
- [ ] `.deck-pile__label`: 11px -> 12px
- [ ] `.enemy-panel__intent-label`: cor `#888` -> `#aaa` (contraste 4.6:1)
- [ ] `.turn-info__round`: cor `#888` -> `#999`
- [ ] Auditar todos os `color: #666` e `color: #888` — substituir por minimo `#999` em fundos escuros

---

## Passo 10: Expandir modal de configuracoes

**Problema:** Icone de engrenagem abre modal so com audio.

**Arquivos:**
- `src/components/Layout/Layout.tsx`
- `src/components/Settings/Settings.tsx`
- `src/components/Settings/Settings.css`

**Tarefas:**
- [ ] Renomear titulo do modal para "Configuracoes" (sem "de Som")
- [ ] Criar estrutura de abas/secoes: Som | Jogo | Display
- [ ] Secao Som: manter sliders existentes
- [ ] Secao Jogo: placeholder com "Em breve" (dificuldade, velocidade de animacao)
- [ ] Secao Display: placeholder com "Em breve" (tamanho de texto, alto contraste)
- [ ] Ou alternativa simples: trocar icone do header de engrenagem para alto-falante

---

## Passo 11: Adicionar botao de fuga/abandonar na batalha

**Problema:** Jogador fica preso na batalha sem opcao de sair.

**Arquivos:**
- `src/components/Board/Board.tsx`
- `src/components/Board/Board.css`
- `src/hooks/useGameEngine.ts`
- `src/game/state/gameState.ts`

**Tarefas:**
- [ ] Adicionar botao "Fugir" discreto no header da batalha (canto esquerdo)
- [ ] Estilo: ghost button, cor `#888`, icone de porta/saida
- [ ] Ao clicar: dialog de confirmacao "Abandonar combate? Voce perdera esta batalha."
- [ ] Ao confirmar: chamar funcao de derrota e voltar ao mapa
- [ ] Desabilitar botao durante turno do inimigo

---

## Passo 12: Otimizar espaco da area central da batalha

**Problema:** 25% da tela para "Turno 1 / Sua vez / botao".

**Arquivos:**
- `src/components/Board/Board.tsx`
- `src/components/Board/Board.css`

**Tarefas:**
- [ ] Unificar info de turno em uma unica pill: `"Turno 1 · 🎮 Sua vez"`
- [ ] Pill posicionada entre inimigo e jogador, tamanho compacto
- [ ] Remover grid row dedicada ao centro — usar `gap` e posicao absoluta/relative
- [ ] Espaco liberado absorvido pelas areas de inimigo e jogador
- [ ] Opcao futura: usar espaco para combat log lateral

---

## Passo 13: Migrar emojis para SVG icons

**Problema:** Emojis renderizam diferente por OS, ilegiveis em tamanhos pequenos.

**Arquivos:**
- Todos os componentes `.tsx`
- `package.json` (nova dependencia)

**Tarefas:**
- [ ] Instalar `lucide-react` (leve, tree-shakeable)
- [ ] Criar mapeamento de emojis para icones:
  - ⚔️ -> `<Sword />`
  - 🛡️ -> `<Shield />`
  - ✨ -> `<Sparkles />`
  - ❤️ -> `<Heart />`
  - 💎 -> `<Gem />`
  - ⚙️ -> `<Settings />`
  - 💰 -> `<Coins />`
- [ ] Substituir em: Card.tsx, Board.tsx, Status.tsx, Buttons.tsx, Map.tsx
- [ ] Manter emojis apenas em: retratos (👹🧙👑), decoracao de texto
- [ ] Garantir que icones SVG herdam `currentColor` para consistencia com tema

---

## Passo 14: Adicionar tipografia tematica

**Problema:** Fonte generica do sistema nao transmite fantasia/RPG.

**Arquivos:**
- `index.html` (Google Fonts link)
- `src/index.css`
- `src/components/Layout/Layout.css`
- `src/components/Card/Card.css`
- `src/components/Board/Board.css`

**Tarefas:**
- [ ] Adicionar Google Font `Cinzel` (serif, medieval elegante) para titulos
- [ ] Adicionar no `<head>` do `index.html`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap" rel="stylesheet">
  ```
- [ ] Criar token: `--font-display: 'Cinzel', serif`
- [ ] Aplicar em: titulo do jogo, nomes de cartas, nomes de inimigos, nomes de atos, titulos h1/h2
- [ ] Manter system font para: descricoes, labels, botoes, UI funcional
- [ ] Testar performance (font-display: swap para evitar FOIT)

---

## Passo 15: Adicionar suporte a touch e :active states

**Problema:** Hover states nao funcionam em touch, elementos parecem estaticos.

**Arquivos:**
- `src/components/Card/Card.css`
- `src/components/Buttons/Buttons.css`
- `src/components/Map/Map.css`
- `src/pages/ShopPage/ShopPage.css`

**Tarefas:**
- [ ] Envolver todos os `:hover` em `@media (hover: hover)`:
  ```css
  @media (hover: hover) {
    .card:hover { transform: translateY(-10px) scale(1.05); }
  }
  ```
- [ ] Adicionar `:active` states para todos os elementos interativos:
  ```css
  .card:active:not(.card--disabled) {
    transform: scale(0.95);
    box-shadow: 0 0 20px rgba(255,255,255,0.2);
  }
  ```
- [ ] Adicionar `touch-action: manipulation` em cartas, botoes, nodes do mapa
- [ ] Adicionar `-webkit-tap-highlight-color: transparent` globalmente
- [ ] Testar em iOS Safari e Chrome Android (ou via DevTools device mode)
