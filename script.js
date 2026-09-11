/* ============================================================
   Jogos Educativos — Matemática (SÓ NÚMEROS)
   - Perguntas aleatórias geradas em tempo real
   - Registro de pontuações por pessoa (localStorage)
   ============================================================ */

/* ---------- utilidades ---------- */
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function gerarDistratores(correta) {
  /* gera 3 distratores plausíveis perto da resposta correta */
  const ops = [1, 2, 3, 5, 10];
  const set = new Set([correta]);
  let intentos = 0;
  while (set.size < 4 && intentos < 60) {
    intentos++;
    const delta = pick(ops) * (Math.random() < 0.5 ? -1 : 1);
    const cand = correta + delta;
    if (cand >= 0 && !set.has(cand)) set.add(cand);
  }
  let extra = 1;
  while (set.size < 4) { const cand = correta + extra * 11; if (cand >= 0) set.add(cand); extra++; }
  return shuffle(Array.from(set));
}

/* ---------- geradores de perguntas (matemática) ---------- */
const geradores = {
  quiz: [
    {
      nivel: 'Adição',
      gerar() {
        const a = rnd(10, 99), b = rnd(10, 99), r = a + b;
        return {
          q: `Quanto é ${a} + ${b}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `${a} + ${b} = ${r}.`,
        };
      }
    },
    {
      nivel: 'Adição de 3 números',
      gerar() {
        const a = rnd(10, 60), b = rnd(10, 60), c = rnd(10, 60), r = a + b + c;
        return {
          q: `Resolve: ${a} + ${b} + ${c} = ?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `${a} + ${b} + ${c} = ${r}.`,
        };
      }
    },
    {
      nivel: 'Subtração',
      gerar() {
        const a = rnd(20, 99), b = rnd(1, a - 1), r = a - b;
        return {
          q: `Quanto é ${a} − ${b}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `${a} − ${b} = ${r}.`,
        };
      }
    },
    {
      nivel: 'Multiplicação',
      gerar() {
        const a = rnd(2, 12), b = rnd(2, 12), r = a * b;
        return {
          q: `Quanto é ${a} × ${b}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `${a} × ${b} = ${r}.`,
        };
      }
    },
    {
      nivel: 'División exata',
      gerar() {
        const b = rnd(2, 12), c = rnd(2, 12), a = b * c, r = a / b;
        return {
          q: `Quanto é ${a} ÷ ${b}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `${a} ÷ ${b} = ${r}, porque ${b} × ${r} = ${a}.`,
        };
      }
    },
    {
      nivel: 'Dobro',
      gerar() {
        const a = rnd(3, 90), r = a * 2;
        return {
          q: `Qual é o dobro de ${a}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `O dobro de ${a} é ${a} × 2 = ${r}.`,
        };
      }
    },
    {
      nivel: 'Triplo',
      gerar() {
        const a = rnd(3, 60), r = a * 3;
        return {
          q: `Qual é o triplo de ${a}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `O triplo de ${a} é ${a} × 3 = ${r}.`,
        };
      }
    },
    {
      nivel: 'Metade',
      gerar() {
        const a = rnd(2, 50) * 2, r = a / 2;
        return {
          q: `Qual é a metade de ${a}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `A metade de ${a} é ${a} ÷ 2 = ${r}.`,
        };
      }
    },
    {
      nivel: 'Comparação',
      gerar() {
        const a = rnd(5, 999), b = rnd(5, 999);
        const [menor, mayor] = a < b ? [a, b] : [b, a];
        return {
          q: `Qual é o maior: ${menor} ou ${mayor}?`,
          correta: String(mayor),
          opcoes: shuffle([menor, mayor, mayor + 1, mayor + 2].map(String)),
          explicacao: `${mayor} é maior que ${menor}.`,
        };
      }
    },
    {
      nivel: 'Dezenas',
      gerar() {
        const n = rnd(20, 999), r = Math.floor(n / 10);
        return {
          q: `Quantas dezenas tem o número ${n}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `${n} tem ${r} dezenas (${r}0 + ${n % 10}).`,
        };
      }
    },
    {
      nivel: 'Valor posicional',
      gerar() {
        const c = rnd(1, 9), dec = rnd(0, 9), uni = rnd(0, 9);
        const n = c * 100 + dec * 10 + uni;
        return {
          q: `O número ${n} tem ${c} centenas, ${dec} dezenas e ${uni} unidades. Qual é o número?`,
          correta: String(n),
          opcoes: shuffle([n, dec * 100 + c * 10 + uni, c * 100 + uni * 10 + dec, (n + 1) % 1000 || 1].map(String)),
          explicacao: `${c} centenas + ${dec} dezenas + ${uni} unidades = ${n}.`,
        };
      }
    },
    {
      nivel: 'Problema de contexto',
      gerar() {
        const tipo = rnd(0, 3);
        if (tipo === 0) {
          const c = rnd(2, 9), p = rnd(2, 12), r = c * p;
          return {
            q: `Uma caixa tem ${p} lápis. Se se compram ${c} caixas, quantos lápis há no total?`,
            correta: String(r), opcoes: gerarDistratores(r).map(String),
            explicacao: `${c} caixas × ${p} lápis = ${r} lápis.`,
          };
        }
        if (tipo === 1) {
          const tot = rnd(4, 9) * rnd(4, 9), c = rnd(2, 9);
          if (tot % c !== 0) return this.gerar();
          const r = tot / c;
          return {
            q: `São repartidos ${tot} caramelos em partes iguais entre ${c} crianças. Quantos caramelos recebe cada uma?`,
            correta: String(r), opcoes: gerarDistratores(r).map(String),
            explicacao: `${tot} ÷ ${c} = ${r} caramelos por criança.`,
          };
        }
        if (tipo === 2) {
          const a = rnd(10, 90), b = rnd(5, 40), r = a + b;
          return {
            q: `Ana tinha ${a} figurinhas e ganhou ${b} mais. Quantas figurinhas tem agora?`,
            correta: String(r), opcoes: gerarDistratores(r).map(String),
            explicacao: `${a} + ${b} = ${r} figurinhas.`,
          };
        }
        const n = rnd(2, 9) * rnd(4, 9), d = rnd(1, n / 4);
        const r = n - d;
        return {
          q: `Um ônibus leva ${n} passageiros e descem ${d}. Quantos passageiros restam?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `${n} − ${d} = ${r} passageiros.`,
        };
      }
    },
  ],

  fractions: [
    {
      nivel: 'Fração de quantidade',
      gerar() {
        const casos = [
          { n: rnd(2, 10) * 2, parte: 2, num: 1, nom: 2 },
          { n: rnd(2, 8) * 4, parte: 4, num: 1, nom: 4 },
          { n: rnd(2, 9) * 3, parte: 3, num: 1, nom: 3 },
          { n: rnd(2, 6) * 4, parte: 4, num: 2, nom: 4 },
        ];
        const c = pick(casos);
        const r = c.parte / c.nom * c.num;
        const texto = [
          `Quanto é ${c.num}/${c.nom} de ${c.parte}?`,
          `Se uma barra de ${c.parte} cm se divide em ${c.nom} partes iguais, quanto mede cada parte?`,
        ];
        return {
          q: `${c.num}/${c.nom} de ${c.parte} = ?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `${c.num}/${c.nom} de ${c.parte} é ${c.parte} ÷ ${c.nom} × ${c.num} = ${r}.`,
          nivel: 'Fração de quantidade',
        };
      }
    },
    {
      nivel: 'Ler frações',
      gerar() {
        const partes = pick([2, 3, 4, 5, 8]);
        const caso = pick([
          { num: 1, texto: 'uma parte' },
          { num: 2, texto: 'dos partes' },
        ]);
        if (caso.num >= partes) return this.gerar();
        return {
          q: `Se uma pizza se corta em ${partes} partes iguais e se comem ${caso.num}, que fração se comeu?`,
          correta: `${caso.num}/${partes}`,
          opcoes: shuffle([`${caso.num}/${partes}`, `${partes}/${caso.num}`, `1/${partes}`, `${caso.num === 1 ? 2 : 1}/${partes}`].map(String)),
          explicacao: `Comeram ${caso.num} de ${partes} partes: ${caso.num}/${partes}.`,
          nivel: 'Frações',
        };
      }
    },
    {
      nivel: 'Comparar frações',
      gerar() {
        const a = pick([1, 2, 3]), b = pick([4, 5, 6, 8]);
        return {
          q: `Qual fração é maior: ${a}/${b} ou 1/${b}?`,
          correta: `${a}/${b}`,
          opcoes: shuffle([`${a}/${b}`, `1/${b}`, 'são iguais', 'não se pode saber'].map(String)),
          explicacao: `Com o mesmo denominador, ${a}/${b} é maior porque ${a} > 1.`,
          nivel: 'Comparação',
        };
      }
    },
    {
      nivel: 'Frações equivalentes',
      gerar() {
        const n = 1, d = 2, m = pick([2, 3, 4]);
        return {
          q: `Qual fração equivale a 1/2?`,
          correta: `${m}/${m * 2}`,
          opcoes: shuffle([`${m}/${m * 2}`, `${m}/${m * 2 + 1}`, `${m * 2}/${m}`, `2/${m}`].map(String)),
          explicacao: `1/2 = ${m}/${m * 2} (multiplicando por ${m}).`,
          nivel: 'Equivalência',
        };
      }
    },
    {
      nivel: 'Frações de um conjunto',
      gerar() {
        const total = rnd(2, 6) * 4, num = pick([1, 2, 3]);
        const r = total / 4 * num;
        return {
          q: `Há ${total} doces. Se se entregam ${num}/4 do total, quantos doces se entregam?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `${num}/4 de ${total} = ${total} ÷ 4 × ${num} = ${r}.`,
          nivel: 'Fração de conjunto',
        };
      }
    },
  ],

  logic: [
    {
      nivel: 'Sequência +',
      gerar() {
        const ini = rnd(1, 9), paso = rnd(2, 6);
        const seq = [ini, ini + paso, ini + 2 * paso, ini + 3 * paso];
        const r = seq[3] + paso;
        return {
          q: `Qual número vem depois na sequência: ${seq.join(', ')}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `A sequência soma ${paso}: depois de ${seq[3]} vem ${r}.`,
          nivel: `Somar ${paso}`,
        };
      }
    },
    {
      nivel: 'Sequência −',
      gerar() {
        const ini = rnd(30, 60), paso = rnd(2, 6);
        const seq = [ini, ini - paso, ini - 2 * paso, ini - 3 * paso];
        const r = seq[3] - paso;
        return {
          q: `Qual número vem depois na sequência: ${seq.join(', ')}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `A sequência subtrai ${paso}: depois de ${seq[3]} vem ${r}.`,
          nivel: `Subtrair ${paso}`,
        };
      }
    },
    {
      nivel: 'Sequência ×2',
      gerar() {
        const ini = rnd(2, 8);
        const seq = [ini, ini * 2, ini * 4, ini * 8];
        const r = ini * 16;
        return {
          q: `Qual número vem depois na sequência: ${seq.join(', ')}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `Os números se duplicam: ${seq[3]} × 2 = ${r}.`,
          nivel: 'Duplicar',
        };
      }
    },
    {
      nivel: 'Sequência +10',
      gerar() {
        const ini = rnd(3, 25), paso = 10;
        const seq = [ini, ini + paso, ini + 2 * paso, ini + 3 * paso];
        const r = seq[3] + paso;
        return {
          q: `Qual número vem depois na sequência: ${seq.join(', ')}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `A sequência soma 10: depois de ${seq[3]} vem ${r}.`,
          nivel: 'Somar 10',
        };
      }
    },
    {
      nivel: 'Padrão',
      gerar() {
        const a = rnd(1, 9), b = rnd(1, 9), c = a + b;
        return {
          q: `Observa a tabela: a = ${a}, b = ${b}. Quanto é a + b?`,
          correta: String(c), opcoes: gerarDistratores(c).map(String),
          explicacao: `${a} + ${b} = ${c}.`,
          nivel: 'Padrão simple',
        };
      }
    },
  ],

  mental: [
    {
      nivel: 'Cálculo rápido',
      gerar() {
        const tipo = rnd(0, 4);
        if (tipo === 0) { const a = rnd(2, 30), b = rnd(2, 30), r = a + b; return { q: `${a} + ${b} = ?`, correta: String(r), opcoes: gerarDistratores(r).map(String), explicacao: `${a} + ${b} = ${r}.` }; }
        if (tipo === 1) { const a = rnd(3, 50), b = rnd(1, a - 1), r = a - b; return { q: `${a} − ${b} = ?`, correta: String(r), opcoes: gerarDistratores(r).map(String), explicacao: `${a} − ${b} = ${r}.` }; }
        if (tipo === 2) { const a = rnd(2, 10), b = rnd(2, 10), r = a * b; return { q: `${a} × ${b} = ?`, correta: String(r), opcoes: gerarDistratores(r).map(String), explicacao: `${a} × ${b} = ${r}.` }; }
        if (tipo === 3) { const b = rnd(2, 9), c2 = rnd(2, 9), a = b * c2, r = a / b; return { q: `${a} ÷ ${b} = ?`, correta: String(r), opcoes: gerarDistratores(r).map(String), explicacao: `${a} ÷ ${b} = ${r}.` }; }
        const a = rnd(2, 40), r = a * 2; return { q: `Dobro de ${a} = ?`, correta: String(r), opcoes: gerarDistratores(r).map(String), explicacao: `O dobro de ${a} é ${r}.` };
      }
    },
  ],
};

/* ---------- definição dos jogos ---------- */
const games = {
  quiz: {
    label: 'Matemática',
    title: 'Operação Estrela',
    type: 'Quiz',
    icon: '×',
    quantidade: 10,
    gerador: 'quiz',
  },
  fractions: {
    label: 'Frações',
    title: 'Mapa das Frações',
    type: 'Frações',
    icon: '1/2',
    quantidade: 10,
    gerador: 'fractions',
  },
  logic: {
    label: 'Raciocínio',
    title: 'Rota dos Números',
    type: 'Sequências',
    icon: '?',
    quantidade: 10,
    gerador: 'logic',
  },
  mental: {
    label: 'Cálculo Mental',
    title: 'Desafio Numérico',
    type: 'Relâmpago',
    icon: '÷',
    quantidade: 15,
    gerador: 'mental',
  },
};

/* genera N perguntas aleatórias para um jogo */
function gerarPerguntas(gameKey, quantidade) {
  const pool = geradores[games[gameKey].gerador];
  const perguntas = [];
  for (let i = 0; i < quantidade; i++) {
    const def = pick(pool);
    const p = def.gerar();
    perguntas.push({
      question: p.q,
      options: p.opcoes,
      answer: p.correta,
      explanation: p.explicacao,
      level: p.nivel || def.nivel,
    });
  }
  return perguntas;
}

/* ---------- pontuações (por pessoa, persistente) ---------- */
const CHAVE_PONTUACOES_NOVA = 'pj_pontuacoes_v1';
const CHAVE_PONTUACOES_ANTIGA = 'pj_puntuaciones_v1';
const CHAVE_NOME_NOVA = 'pj_ultimo_nome';
const CHAVE_NOME_ANTIGA = 'pj_ultimo_nombre';

function carregarPontuacoes() {
  try { return JSON.parse(localStorage.getItem(CHAVE_PONTUACOES)) || []; }
  catch (e) { return []; }
}
function salvarPontuacoes(lista) {
  try { localStorage.setItem(CHAVE_PONTUACOES, JSON.stringify(lista)); } catch (e) { console.warn('não se pudo guardar'); }
}
function registrarPartida(nome, jKey, pontos, acertos, total) {
  const pct = Math.round((acertos / total) * 100);
  const lista = carregarPontuacoes();
  lista.push({
    id: Date.now(),
    nome: nome.trim(),
    dataPartida: new Date().toISOString().slice(0, 16).replace('T', ' '),
    jogo: games[jKey].title,
    pontos,
    acertos,
    total,
    pct,
  });
  salvarPontuacoes(lista);
  return pct;
}

/* ---------- UI: referências ---------- */
const choiceScreen = document.getElementById('choiceScreen');
const gameScreen = document.getElementById('gameScreen');
const rankingScreen = document.getElementById('rankingScreen');
const gameGrid = document.getElementById('gameGrid');
const gameRenderer = document.getElementById('gameRenderer');
const gameTitle = document.getElementById('gameTitle');
const gameScreenLabel = document.getElementById('gameScreenLabel');
const startButton = document.getElementById('startButton');
const backButton = document.getElementById('backButton');
const rankButton = document.getElementById('rankButton');
const rankClose = document.getElementById('rankClose');
const scoreValue = document.getElementById('scoreValue');
const playerNameInput = document.getElementById('playerNameInput');
const nameModal = document.getElementById('nameModal');
const nameOk = document.getElementById('nameOk');
const nameCancel = document.getElementById('nameCancel');
const currentPlayerEl = document.getElementById('currentPlayer');
const currentPlayerPill = document.getElementById('currentPlayerPill');
const navRanking = document.getElementById('navRanking');
const heroRankBtn = document.getElementById('heroRankBtn');

let currentGame = 'quiz';
let currentQuestion = 0;
let score = 0;
let acertos = 0;
let jogador = localStorage.getItem(CHAVE_NOME) || '';
let proximoJogo = null;

if (currentPlayerEl) currentPlayerEl.textContent = jogador || 'Sem nome';
if (currentPlayerPill) currentPlayerPill.textContent = jogador || 'Sem nome';

/* ---------- modal de nome ---------- */
function pedirNome(callback) {
  proximoJogo = callback;
  nameModal.classList.add('active');
  playerNameInput.value = jogador;
  playerNameInput.focus();
}
nameOk.addEventListener('click', () => {
  const n = playerNameInput.value.trim();
  if (!n) { playerNameInput.classList.add('input-error'); playerNameInput.focus(); return; }
  playerNameInput.classList.remove('input-error');
  jogador = n;
  try { localStorage.setItem(CHAVE_NOME, jogador); } catch (e) {}
  if (currentPlayerEl) currentPlayerEl.textContent = jogador;
  if (currentPlayerPill) currentPlayerPill.textContent = jogador;
  nameModal.classList.remove('active');
  if (proximoJogo) proximoJogo();
});
nameCancel.addEventListener('click', () => {
  nameModal.classList.remove('active');
  proximoJogo = null;
});

function openGame(gameKey) {
  if (!jogador) { pedirNome(() => openGame(gameKey)); return; }
  currentGame = gameKey;
  currentQuestion = 0;
  score = 0;
  acertos = 0;
  choiceScreen.classList.remove('active');
  rankingScreen.classList.remove('active');
  gameScreen.classList.add('active');
  scoreValue.textContent = score;
  renderGame(gameKey);
}

function backToMenu() {
  gameScreen.classList.remove('active');
  choiceScreen.classList.add('active');
}

/* ---------- render da pergunta ---------- */
function renderGame(gameKey) {
  const game = games[gameKey];
  const perguntas = game._preguntas || gerarPerguntas(gameKey, game.quantidade);
  game._preguntas = perguntas;
  const data = perguntas[currentQuestion];
  gameTitle.textContent = game.title;
  gameScreenLabel.textContent = game.label;

  const playerOptions = data.options.map((option, index) =>
    `<button class="answer-button" data-index="${index}" data-answer="${option}">${option}</button>`
  ).join('');

  gameRenderer.innerHTML = `
    <div class="question-card">
      <div class="question-top">
        <span class="question-number">Questão ${currentQuestion + 1}/${perguntas.length}</span>
        <span class="question-level">${data.level}</span>
      </div>
      <div class="question-text">${data.question}</div>
      <div class="answer-grid">
        ${playerOptions}
      </div>
      <div class="question-actions">
        <span class="question-message" id="message">Escolha a resposta</span>
        <button class="btn next-button" id="nextButton" disabled>Próxima</button>
      </div>
    </div>
  `;

  const buttons = Array.from(document.querySelectorAll('.answer-button'));
  buttons.forEach((button) => {
    button.addEventListener('click', () => handleAnswer(button, data, gameKey));
  });
}

function handleAnswer(button, data, gameKey) {
  const game = games[gameKey];
  const perguntas = game._preguntas;
  const allButtons = Array.from(document.querySelectorAll('.answer-button'));
  const selected = button.dataset.answer;
  const message = document.getElementById('message');
  const nextButton = document.getElementById('nextButton');
  const pontosPorAcerto = 10;

  allButtons.forEach((option) => {
    option.disabled = true;
    if (option.dataset.answer === data.answer) option.classList.add('correct');
  });

  if (selected === data.answer) {
    button.classList.add('correct');
    score += pontosPorAcerto;
    acertos++;
    scoreValue.textContent = score;
    message.textContent = 'Parabéns! Você acertou! (+' + pontosPorAcerto + ' pontos)';
  } else {
    button.classList.add('wrong');
    message.textContent = 'Quase... ' + data.explanation;
  }

  nextButton.disabled = false;
  nextButton.textContent = currentQuestion < perguntas.length - 1 ? 'Próxima' : 'Finalizar';
  nextButton.onclick = () => {
    if (currentQuestion < perguntas.length - 1) {
      currentQuestion++;
      renderGame(gameKey);
    } else {
      finishGame(gameKey);
    }
  };
}

function finishGame(gameKey) {
  const game = games[gameKey];
  const perguntas = game._preguntas;
  const total = perguntas.length;
  const pct = registrarPartida(jogador, gameKey, score, acertos, total);
  delete game._preguntas;

  const estrelas = pct >= 90 ? '⭐⭐⭐' : pct >= 70 ? '⭐⭐' : pct >= 50 ? '⭐' : '🌱';

  gameRenderer.innerHTML = `
    <div class="correct-card">
      <h3>Missão cumprida! ${estrelas}</h3>
      <p><strong>${game.title}</strong> — Jogador: <strong>${jogador}</strong></p>
      <p>Pontos: <strong>${score}</strong> · Acertos: <strong>${acertos}/${total}</strong> · Rendimento <strong>${pct}%</strong></p>
      <p>Pontuação registrada no ranking. ✅</p>
      <div class="question-actions">
        <span class="question-message">Continue explorando!</span>
        <button class="btn primary" id="verRankingBtn">Ver Ranking</button>
        <button class="btn next-button" id="restartButton">Jogar de novo</button>
      </div>
    </div>
  `;

  document.getElementById('restartButton').addEventListener('click', () => { backToMenu(); });
  document.getElementById('verRankingBtn').addEventListener('click', () => { abrirRanking(); });
}

/* ---------- ranking ---------- */
function abrirRanking() {
  gameScreen.classList.remove('active');
  choiceScreen.classList.remove('active');
  rankingScreen.classList.add('active');
  renderRanking();
}
rankClose.addEventListener('click', () => {
  rankingScreen.classList.remove('active');
  choiceScreen.classList.add('active');
});

function renderRanking() {
  const lista = carregarPontuacoes();
  const contEl = document.getElementById('rankingBody');

  if (lista.length === 0) {
    contEl.innerHTML = `<tr><td colspan="5" class="vazio">Ainda não há pontuações registradas.</td></tr>`;
    document.getElementById('rankingResumen').textContent = '0 registros';
    return;
  }

  /* resumo por pessoa */
  const porPersona = {};
  lista.forEach(r => {
    const k = r.nome.toLowerCase();
    if (!porPersona[k]) porPersona[k] = { nome: r.nome, partidas: 0, pontos: 0, mejor: 0, acertos: 0, total: 0 };
    porPersona[k].partidas++;
    porPersona[k].pontos += r.pontos;
    porPersona[k].acertos += r.acertos;
    porPersona[k].total += r.total;
    porPersona[k].mejor = Math.max(porPersona[k].mejor, r.pct);
  });
  const filas = Object.values(porPersona)
    .sort((a, b) => b.pontos - a.pontos)
    .map(p => {
      const pctg = Math.round(p.acertos / p.total * 100);
      return `<tr>
        <td>${p.nome}</td>
        <td>${p.partidas}</td>
        <td>${p.pontos}</td>
        <td>${p.mejor}%</td>
        <td>${pctg}%</td>
      </tr>`;
    }).join('');

  contEl.innerHTML = filas;
  document.getElementById('rankingResumen').textContent = `${lista.length} registros · ${Object.keys(porPersona).length} jogadores`;
}

function baixarCSV() {
  const lista = carregarPontuacoes();
  if (lista.length === 0) { alert('Não há pontuações para exportar.'); return; }
  const filas = [['Nome', 'Data', 'Jogo', 'Pontos', 'Acertos', 'Total', 'Rendimento %']];
  lista.forEach(r => {
    filas.push([r.nome, r.dataPartida, r.jogo, r.pontos, r.acertos, r.total, r.pct]);
  });
  const csv = '\uFEFF' + filas.map(f => f.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `pontuacoes_matematica_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

/* ---------- eventos principais ---------- */
gameGrid.addEventListener('click', (event) => {
  const card = event.target.closest('.game-card');
  if (!card) return;
  openGame(card.dataset.game);
});

startButton.addEventListener('click', () => {
  openGame('quiz');
});

backButton.addEventListener('click', () => {
  backToMenu();
});

rankButton.addEventListener('click', () => {
  abrirRanking();
});

if (navRanking) navRanking.addEventListener('click', (e) => { e.preventDefault(); abrirRanking(); });
if (heroRankBtn) heroRankBtn.addEventListener('click', () => { abrirRanking(); });

document.getElementById('csvButton').addEventListener('click', baixarCSV);
document.getElementById('clearButton').addEventListener('click', () => {
  if (confirm('Limpar TODAS as pontuações registradas?')) {
    salvarPontuacoes([]);
    renderRanking();
  }
});