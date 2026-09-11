from flask import Flask, render_template, jsonify, request
from pathlib import Path
from datetime import datetime
import json
import uuid

app = Flask(__name__)

DATA_DIR = Path(__file__).resolve().parent / 'data'
DATA_FILE = DATA_DIR / 'pontuacoes.json'

DATA_DIR.mkdir(parents=True, exist_ok=True)
if not DATA_FILE.exists():
    DATA_FILE.write_text('[]', encoding='utf-8')


def carregar_pontuacoes():
    try:
        with DATA_FILE.open('r', encoding='utf-8') as f:
            dados = json.load(f)
        return dados if isinstance(dados, list) else []
    except Exception:
        return []


def salvar_pontuacoes(lista):
    with DATA_FILE.open('w', encoding='utf-8') as f:
        json.dump(lista, f, ensure_ascii=False, indent=2)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/pontuacoes', methods=['GET'])
def listar_pontuacoes():
    return jsonify(carregar_pontuacoes())


@app.route('/api/pontuacoes', methods=['POST'])
def registrar_pontuacao():
    payload = request.get_json(silent=True) or {}
    nome = str(payload.get('nome', '')).strip()
    jogo = str(payload.get('jogo', '')).strip()
    pontos = int(payload.get('pontos', 0) or 0)
    acertos = int(payload.get('acertos', 0) or 0)
    total = int(payload.get('total', 0) or 0)
    pct = int(payload.get('pct', 0) or 0)
    data_partida = str(payload.get('dataPartida', datetime.now().strftime('%Y-%m-%d %H:%M')))

    if not nome or not jogo:
        return jsonify({'ok': False, 'erro': 'nome e jogo são obrigatórios'}), 400

    if total <= 0:
        total = 1

    if pct == 0:
        pct = round((acertos / total) * 100)

    lista = carregar_pontuacoes()
    registro = {
        'id': str(uuid.uuid4()),
        'nome': nome,
        'dataPartida': data_partida,
        'jogo': jogo,
        'pontos': pontos,
        'acertos': acertos,
        'total': total,
        'pct': pct,
    }
    lista.append(registro)
    salvar_pontuacoes(lista)
    return jsonify({'ok': True, 'pontuacoes': lista})


@app.route('/api/pontuacoes', methods=['PUT'])
def atualizar_pontuacoes():
    payload = request.get_json(silent=True)
    if not isinstance(payload, list):
        return jsonify({'ok': False, 'erro': 'esperado uma lista'}), 400
    salvar_pontuacoes(payload)
    return jsonify({'ok': True, 'pontuacoes': payload})


@app.route('/api/pontuacoes', methods=['DELETE'])
def limpar_pontuacoes():
    salvar_pontuacoes([])
    return jsonify({'ok': True})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
