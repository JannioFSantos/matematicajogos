/* ============================================================
   Jogos Educativos — Matemática (SÓ NÚMEROS)
   - Perguntas aleatórias geradas em tempo real
   - Registro de pontuações por pessoa (localStorage)
   ============================================================ */

/* ---------- utilidades ---------- */
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function sortear(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function embaralhar(arr) {
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
  const conjunto = new Set([correta]);
  let tentativas = 0;
  while (conjunto.size < 4 && tentativas < 60) {
    tentativas++;
    const delta = sortear(ops) * (Math.random() < 0.5 ? -1 : 1);
    const candidato = correta + delta;
    if (candidato >= 0 && !conjunto.has(candidato)) conjunto.add(candidato);
  }
  let extra = 1;
  while (conjunto.size < 4) { const candidato = correta + extra * 11; if (candidato >= 0) conjunto.add(candidato); extra++; }
  return embaralhar(Array.from(conjunto));
}

/* ---------- geradores de perguntas (matemática) ---------- */
const geradores = {
  quiz: [
    {
      nivel: 'Adição',
      gerar() {
        const a = rnd(10, 99), b = rnd(10, 99), r = a + b;
        return {
          pergunta: `Quanto é ${a} + ${b}?`,
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
          pergunta: `Resolva: ${a} + ${b} + ${c} = ?`,
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
          pergunta: `Quanto é ${a} − ${b}?`,
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
          pergunta: `Quanto é ${a} × ${b}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `${a} × ${b} = ${r}.`,
        };
      }
    },
    {
      nivel: 'Divisão exata',
      gerar() {
        const b = rnd(2, 12), c = rnd(2, 12), a = b * c, r = a / b;
        return {
          pergunta: `Quanto é ${a} ÷ ${b}?`,
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
          pergunta: `Qual é o dobro de ${a}?`,
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
          pergunta: `Qual é o triplo de ${a}?`,
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
          pergunta: `Qual é a metade de ${a}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `A metade de ${a} é ${a} ÷ 2 = ${r}.`,
        };
      }
    },
    {
      nivel: 'Comparação',
      gerar() {
        const a = rnd(5, 999), b = rnd(5, 999);
        const [menor, maior] = a < b ? [a, b] : [b, a];
        return {
          pergunta: `Qual é o maior: ${menor} ou ${maior}?`,
          correta: String(maior),
          opcoes: embaralhar([menor, maior, maior + 1, maior + 2].map(String)),
          explicacao: `${maior} é maior que ${menor}.`,
        };
      }
    },
    {
      nivel: 'Dezenas',
      gerar() {
        const n = rnd(20, 999), r = Math.floor(n / 10);
        return {
          pergunta: `Quantas dezenas tem o número ${n}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `${n} tem ${r} dezenas (${r}0 + ${n % 10}).`,
        };
      }
    },
    {
      nivel: 'Valor posicional',
      gerar() {
        const c = rnd(1, 9), dez = rnd(0, 9), uni = rnd(0, 9);
        const n = c * 100 + dez * 10 + uni;
        return {
          pergunta: `O número ${n} tem ${c} centenas, ${dez} dezenas e ${uni} unidades. Qual é o número?`,
          correta: String(n),
          opcoes: embaralhar([n, dez * 100 + c * 10 + uni, c * 100 + uni * 10 + dez, (n + 1) % 1000 || 1].map(String)),
          explicacao: `${c} centenas + ${dez} dezenas + ${uni} unidades = ${n}.`,
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
            pergunta: `Uma caixa tem ${p} lápis. Se forem compradas ${c} caixas, quantos lápis há no total?`,
            correta: String(r), opcoes: gerarDistratores(r).map(String),
            explicacao: `${c} caixas × ${p} lápis = ${r} lápis.`,
          };
        }
        if (tipo === 1) {
          const tot = rnd(4, 9) * rnd(4, 9), c = rnd(2, 9);
          if (tot % c !== 0) return this.gerar();
          const r = tot / c;
          return {
            pergunta: `São repartidos ${tot} caramelos em partes iguais entre ${c} crianças. Quantos caramelos recebe cada uma?`,
            correta: String(r), opcoes: gerarDistratores(r).map(String),
            explicacao: `${tot} ÷ ${c} = ${r} caramelos por criança.`,
          };
        }
        if (tipo === 2) {
          const a = rnd(10, 90), b = rnd(5, 40), r = a + b;
          return {
            pergunta: `Ana tinha ${a} figurinhas e ganhou ${b} mais. Quantas figurinhas tem agora?`,
            correta: String(r), opcoes: gerarDistratores(r).map(String),
            explicacao: `${a} + ${b} = ${r} figurinhas.`,
          };
        }
        const n = rnd(2, 9) * rnd(4, 9), d = rnd(1, n / 4);
        const r = n - d;
        return {
          pergunta: `Um ônibus leva ${n} passageiros e descem ${d}. Quantos passageiros ficam?`,
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
        const c = sortear(casos);
        const r = c.parte / c.nom * c.num;
        return {
          pergunta: `${c.num}/${c.nom} de ${c.parte} = ?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `${c.num}/${c.nom} de ${c.parte} é ${c.parte} ÷ ${c.nom} × ${c.num} = ${r}.`,
          nivel: 'Fração de quantidade',
        };
      }
    },
    {
      nivel: 'Ler frações',
      gerar() {
        const partes = sortear([2, 3, 4, 5, 8]);
        const caso = sortear([
          { num: 1, texto: 'uma parte' },
          { num: 2, texto: 'duas partes' },
        ]);
        if (caso.num >= partes) return this.gerar();
        return {
          pergunta: `Se uma pizza é cortada em ${partes} partes iguais e são comidas ${caso.num}, que fração foi comida?`,
          correta: `${caso.num}/${partes}`,
          opcoes: embaralhar([`${caso.num}/${partes}`, `${partes}/${caso.num}`, `1/${partes}`, `${caso.num === 1 ? 2 : 1}/${partes}`].map(String)),
          explicacao: `Foram comidas ${caso.num} de ${partes} partes: ${caso.num}/${partes}.`,
          nivel: 'Frações',
        };
      }
    },
    {
      nivel: 'Comparar frações',
      gerar() {
        const a = sortear([1, 2, 3]), b = sortear([4, 5, 6, 8]);
        return {
          pergunta: `Qual fração é maior: ${a}/${b} ou 1/${b}?`,
          correta: `${a}/${b}`,
          opcoes: embaralhar([`${a}/${b}`, `1/${b}`, 'são iguais', 'não se pode saber'].map(String)),
          explicacao: `Com o mesmo denominador, ${a}/${b} é maior porque ${a} > 1.`,
          nivel: 'Comparação',
        };
      }
    },
    {
      nivel: 'Frações equivalentes',
      gerar() {
        const m = sortear([2, 3, 4]);
        return {
          pergunta: `Qual fração equivale a 1/2?`,
          correta: `${m}/${m * 2}`,
          opcoes: embaralhar([`${m}/${m * 2}`, `${m}/${m * 2 + 1}`, `${m * 2}/${m}`, `2/${m}`].map(String)),
          explicacao: `1/2 = ${m}/${m * 2} (multiplicando por ${m}).`,
          nivel: 'Equivalência',
        };
      }
    },
    {
      nivel: 'Frações de um conjunto',
      gerar() {
        const total = rnd(2, 6) * 4, num = sortear([1, 2, 3]);
        const r = total / 4 * num;
        return {
          pergunta: `Há ${total} doces. Se forem entregues ${num}/4 do total, quantos doces são entregues?`,
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
        const ini = rnd(1, 9), passo = rnd(2, 6);
        const seq = [ini, ini + passo, ini + 2 * passo, ini + 3 * passo];
        const r = seq[3] + passo;
        return {
          pergunta: `Qual número vem depois na sequência: ${seq.join(', ')}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `A sequência soma ${passo}: depois de ${seq[3]} vem ${r}.`,
          nivel: `Somar ${passo}`,
        };
      }
    },
    {
      nivel: 'Sequência −',
      gerar() {
        const ini = rnd(30, 60), passo = rnd(2, 6);
        const seq = [ini, ini - passo, ini - 2 * passo, ini - 3 * passo];
        const r = seq[3] - passo;
        return {
          pergunta: `Qual número vem depois na sequência: ${seq.join(', ')}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `A sequência subtrai ${passo}: depois de ${seq[3]} vem ${r}.`,
          nivel: `Subtrair ${passo}`,
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
          pergunta: `Qual número vem depois na sequência: ${seq.join(', ')}?`,
          correta: String(r), opcoes: gerarDistratores(r).map(String),
          explicacao: `Os números são duplicados: ${seq[3]} × 2 = ${r}.`,
          nivel: 'Duplicar',
        };
      }
    },
    {
      nivel: 'Sequência +10',
      gerar() {
        const ini = rnd(3, 25), passo = 10;
        const seq = [ini, ini + passo, ini + 2 * passo, ini + 3 * passo];
        const r = seq[3] + passo;
        return {
          pergunta: `Qual número vem depois na sequência: ${seq.join(', ')}?`,
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
          pergunta: `Observe a tabela: a = ${a}, b = ${b}. Quanto é a + b?`,
          correta: String(c), opcoes: gerarDistratores(c).map(String),
          explicacao: `${a} + ${b} = ${c}.`,
          nivel: 'Padrão simples',
        };
      }
    },
  ],

  mental: [
    {
      nivel: 'Cálculo rápido',
      gerar() {
        const tipo = rnd(0, 4);
        if (tipo === 0) { const a = rnd(2, 30), b = rnd(2, 30), r = a + b; return { pergunta: `${a} + ${b} = ?`, correta: String(r), opcoes: gerarDistratores(r).map(String), explicacao: `${a} + ${b} = ${r}.` }; }
        if (tipo === 1) { const a = rnd(3, 50), b = rnd(1, a - 1), r = a - b; return { pergunta: `${a} − ${b} = ?`, correta: String(r), opcoes: gerarDistratores(r).map(String), explicacao: `${a} − ${b} = ${r}.` }; }
        if (tipo === 2) { const a = rnd(2, 10), b = rnd(2, 10), r = a * b; return { pergunta: `${a} × ${b} = ?`, correta: String(r), opcoes: gerarDistratores(r).map(String), explicacao: `${a} × ${b} = ${r}.` }; }
        if (tipo === 3) { const b = rnd(2, 9), c2 = rnd(2, 9), a = b * c2, r = a / b; return { pergunta: `${a} ÷ ${b} = ?`, correta: String(r), opcoes: gerarDistratores(r).map(String), explicacao: `${a} ÷ ${b} = ${r}.` }; }
        const a = rnd(2, 40), r = a * 2; return { pergunta: `Dobro de ${a} = ?`, correta: String(r), opcoes: gerarDistratores(r).map(String), explicacao: `O dobro de ${a} é ${r}.` };
      }
    },
  ],
};

/* ---------- definição dos jogos ---------- */
const jogos = {
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

/* gera N perguntas aleatórias para um jogo */
function gerarPerguntas(chaveJogo, quantidade) {
  const pool = geradores[jogos[chaveJogo].gerador];
  const perguntas = [];
  for (let i = 0; i < quantidade; i++) {
    const def = sortear(pool);
    const p = def.gerar();
    perguntas.push({
      pergunta: p.pergunta,
      opcoes: p.opcoes,
      correta: p.correta,
      explicacao: p.explicacao,
      nivel: p.nivel || def.nivel,
    });
  }
  return perguntas;
}

/* ---------- pontuações compartilhadas pela sala ---------- */
const CHAVE_NOME_NOVA = 'pj_ultimo_nome';
const CHAVE_NOME_ANTIGA = 'pj_ultimo_nombre';
const CHAVE_SALA_NOVA = 'pj_ultima_sala';

function getSalaAtual() {
  return localStorage.getItem(CHAVE_SALA_NOVA) || 'Sala 1';
}

async function carregarPontuacoes() {
  try {
    const sala = getSalaAtual();
    const url = `/api/pontuacoes?sala=${encodeURIComponent(sala)}`;
    const resposta = await fetch(url);
    if (!resposta.ok) return [];
    return await resposta.json();
  } catch (e) {
    console.warn('não foi possível carregar pontuações do servidor', e);
    return [];
  }
}

async function salvarPontuacoes(lista) {
  try {
    const resposta = await fetch('/api/pontuacoes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lista)
    });
    return resposta.ok;
  } catch (e) {
    console.warn('não foi possível sincronizar pontuações do servidor', e);
    return false;
  }
}

async function registrarPartida(nome, chaveJogo, pontos, acertos, total) {
  const pct = Math.round((acertos / total) * 100);
  const payload = {
    nome: nome.trim(),
    sala: getSalaAtual(),
    dataPartida: new Date().toISOString().slice(0, 16).replace('T', ' '),
    jogo: jogos[chaveJogo].title,
    pontos,
    acertos,
    total,
    pct,
  };

  try {
    const resposta = await fetch('/api/pontuacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!resposta.ok) {
      console.warn('registro não enviado ao servidor');
      return pct;
    }
    return pct;
  } catch (e) {
    console.warn('não foi possível registrar partida no servidor', e);
    return pct;
  }
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
const roomSelect = document.getElementById('roomSelect');
const nameModal = document.getElementById('nameModal');
const nameOk = document.getElementById('nameOk');
const nameCancel = document.getElementById('nameCancel');
const currentPlayerEl = document.getElementById('currentPlayer');
const currentPlayerPill = document.getElementById('currentPlayerPill');
const changePlayerButton = document.getElementById('changePlayerButton');
const navRanking = document.getElementById('navRanking');
const heroRankBtn = document.getElementById('heroRankBtn');

let jogoAtual = 'quiz';
let perguntaAtual = 0;
let pontos = 0;
let acertos = 0;
let jogador = localStorage.getItem(CHAVE_NOME_NOVA) || localStorage.getItem(CHAVE_NOME_ANTIGA) || '';
let salaAtual = getSalaAtual();
let proximoJogo = null;

if (currentPlayerEl) currentPlayerEl.textContent = jogador || 'Sem nome';
if (currentPlayerPill) currentPlayerPill.textContent = jogador || 'Sem nome';

/* ---------- modal de nome ---------- */
function pedirNome(callback) {
  proximoJogo = callback;
  nameModal.classList.add('active');
  playerNameInput.value = jogador;
  if (roomSelect) roomSelect.value = salaAtual;
  playerNameInput.focus();
}
nameOk.addEventListener('click', () => {
  const n = playerNameInput.value.trim();
  const s = roomSelect ? roomSelect.value : salaAtual;
  if (!n) { playerNameInput.classList.add('input-error'); playerNameInput.focus(); return; }
  playerNameInput.classList.remove('input-error');
  jogador = n;
  salaAtual = s;
  try {
    localStorage.setItem(CHAVE_NOME_NOVA, jogador);
    localStorage.removeItem(CHAVE_NOME_ANTIGA);
    localStorage.setItem(CHAVE_SALA_NOVA, salaAtual);
  } catch (e) {}
  if (currentPlayerEl) currentPlayerEl.textContent = jogador;
  if (currentPlayerPill) currentPlayerPill.textContent = jogador;
  nameModal.classList.remove('active');
  if (proximoJogo) proximoJogo();
});
nameCancel.addEventListener('click', () => {
  nameModal.classList.remove('active');
  proximoJogo = null;
});

if (changePlayerButton) {
  changePlayerButton.addEventListener('click', () => {
    pedirNome(() => {});
  });
}

function abrirJogo(chaveJogo) {
  if (!jogador) { pedirNome(() => abrirJogo(chaveJogo)); return; }
  jogoAtual = chaveJogo;
  perguntaAtual = 0;
  pontos = 0;
  acertos = 0;
  choiceScreen.classList.remove('active');
  rankingScreen.classList.remove('active');
  gameScreen.classList.add('active');
  scoreValue.textContent = pontos;
  renderJogo(chaveJogo);
}

function voltarAoMenu() {
  gameScreen.classList.remove('active');
  choiceScreen.classList.add('active');
}

/* ---------- render da pergunta ---------- */
function renderJogo(chaveJogo) {
  const jogo = jogos[chaveJogo];
  const perguntas = jogo._perguntas || gerarPerguntas(chaveJogo, jogo.quantidade);
  jogo._perguntas = perguntas;
  const data = perguntas[perguntaAtual];
  gameTitle.textContent = jogo.title;
  gameScreenLabel.textContent = jogo.label;

  const opcoesHtml = data.opcoes.map((opcao, index) =>
    `<button class="answer-button" data-index="${index}" data-correta="${opcao}">${opcao}</button>`
  ).join('');

  gameRenderer.innerHTML = `
    <div class="question-card">
      <div class="question-top">
        <span class="question-number">Questão ${perguntaAtual + 1}/${perguntas.length}</span>
        <span class="question-level">${data.nivel}</span>
      </div>
      <div class="question-text">${data.pergunta}</div>
      <div class="answer-grid">
        ${opcoesHtml}
      </div>
      <div class="question-actions">
        <span class="question-message" id="message">Escolha a resposta</span>
        <button class="btn next-button" id="nextButton" disabled>Próxima</button>
      </div>
    </div>
  `;

  const botoes = Array.from(document.querySelectorAll('.answer-button'));
  botoes.forEach((botao) => {
    botao.addEventListener('click', () => responder(botao, data, chaveJogo));
  });
}

function responder(botao, data, chaveJogo) {
  const jogo = jogos[chaveJogo];
  const perguntas = jogo._perguntas;
  const todosBotoes = Array.from(document.querySelectorAll('.answer-button'));
  const selecionada = botao.dataset.correta;
  const message = document.getElementById('message');
  const nextButton = document.getElementById('nextButton');
  const pontosPorAcerto = 10;

  todosBotoes.forEach((opcao) => {
    opcao.disabled = true;
    if (opcao.dataset.correta === data.correta) opcao.classList.add('correct');
  });

  if (selecionada === data.correta) {
    botao.classList.add('correct');
    pontos += pontosPorAcerto;
    acertos++;
    scoreValue.textContent = pontos;
    message.textContent = 'Parabéns! Você acertou! (+' + pontosPorAcerto + ' pontos)';
  } else {
    botao.classList.add('wrong');
    message.textContent = 'Quase... ' + data.explicacao;
  }

  nextButton.disabled = false;
  nextButton.textContent = perguntaAtual < perguntas.length - 1 ? 'Próxima' : 'Finalizar';
  nextButton.onclick = () => {
    if (perguntaAtual < perguntas.length - 1) {
      perguntaAtual++;
      renderJogo(chaveJogo);
    } else {
      finalizarJogo(chaveJogo);
    }
  };
}

async function finalizarJogo(chaveJogo) {
  const jogo = jogos[chaveJogo];
  const perguntas = jogo._perguntas;
  const total = perguntas.length;
  const pct = await registrarPartida(jogador, chaveJogo, pontos, acertos, total);
  delete jogo._perguntas;

  const estrelas = pct >= 90 ? '⭐⭐⭐' : pct >= 70 ? '⭐⭐' : pct >= 50 ? '⭐' : '🌱';

  gameRenderer.innerHTML = `
    <div class="correct-card">
      <h3>Missão cumprida! ${estrelas}</h3>
      <p><strong>${jogo.title}</strong> — Jogador: <strong>${jogador}</strong></p>
      <p>Pontos: <strong>${pontos}</strong> · Acertos: <strong>${acertos}/${total}</strong> · Rendimento <strong>${pct}%</strong></p>
      <p>Pontuação registrada no ranking da sala. ✅</p>
      <div class="question-actions">
        <span class="question-message">Continue explorando!</span>
        <button class="btn primary" id="verRankingBtn">Ver Ranking</button>
        <button class="btn next-button" id="restartButton">Jogar de novo</button>
      </div>
    </div>
  `;

  document.getElementById('restartButton').addEventListener('click', () => { voltarAoMenu(); });
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

async async function renderRanking() {
  const lista = await carregarPontuacoes();
  const contEl = document.getElementById('rankingBody');

  if (lista.length === 0) {
    contEl.innerHTML = `<tr><td colspan="6" class="vazio">Ainda não há pontuações registradas nesta sala.</td></tr>`;
    document.getElementById('rankingResumen').textContent = '0 registros';
    return;
  }

  const porPessoa = {};
  lista.forEach(r => {
    const k = (r.nome || '').toLowerCase();
    if (!porPessoa[k]) porPessoa[k] = { nome: r.nome, sala: r.sala || getSalaAtual(), partidas: 0, pontos: 0, melhor: 0, acertos: 0, total: 0 };
    porPessoa[k].partidas++;
    porPessoa[k].pontos += r.pontos;
    porPessoa[k].acertos += r.acertos;
    porPessoa[k].total += r.total;
    porPessoa[k].melhor = Math.max(porPessoa[k].melhor, r.pct);
  });
  const linhas = Object.values(porPessoa)
    .sort((a, b) => b.pontos - a.pontos)
    .map(p => {
      const pctg = Math.round(p.acertos / p.total * 100);
      return `<tr>
        <td>${p.nome}</td>
        <td>${p.sala || getSalaAtual()}</td>
        <td>${p.partidas}</td>
        <td>${p.pontos}</td>
        <td>${p.melhor}%</td>
        <td>${pctg}%</td>
      </tr>`;
    }).join('');

  contEl.innerHTML = linhas;
  document.getElementById('rankingResumen').textContent = `${lista.length} registros · ${Object.keys(porPessoa).length} jogadores`;
}

async function baixarCSV() {
  const lista = await carregarPontuacoes();
  if (lista.length === 0) { alert('Não há pontuações para exportar.'); return; }
  const linhas = [['Nome', 'Sala', 'Data', 'Jogo', 'Pontos', 'Acertos', 'Total', 'Rendimento %']];
  lista.forEach(r => {
    linhas.push([r.nome, r.sala || getSalaAtual(), r.dataPartida, r.jogo, r.pontos, r.acertos, r.total, r.pct]);
  });
  const csv = '\uFEFF' + linhas.map(f => f.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `pontuacoes_matematica_${new Date().toISOString().slice(0, 10)}_${getSalaAtual().replace(/\s+/g, '_')}.csv`;
  a.click();
}

/* ---------- eventos principais ---------- */
gameGrid.addEventListener('click', (event) => {
  const card = event.target.closest('.game-card');
  if (!card) return;
  abrirJogo(card.dataset.game);
});

startButton.addEventListener('click', () => {
  abrirJogo('quiz');
});

backButton.addEventListener('click', () => {
  voltarAoMenu();
});

rankButton.addEventListener('click', () => {
  abrirRanking();
});

if (navRanking) navRanking.addEventListener('click', (e) => { e.preventDefault(); abrirRanking(); });
if (heroRankBtn) heroRankBtn.addEventListener('click', () => { abrirRanking(); });

document.getElementById('csvButton').addEventListener('click', baixarCSV);
document.getElementById('clearButton').addEventListener('click', async () => {
  if (confirm(`Limpar todas as pontuações da ${getSalaAtual()}?`)) {
    await fetch(`/api/pontuacoes?sala=${encodeURIComponent(getSalaAtual())}`, { method: 'DELETE' });
    renderRanking();
  }
});
