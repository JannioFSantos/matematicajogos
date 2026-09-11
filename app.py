import os
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


def normalize_sala(value):
    if value is None:
        return 'Sala 1'
    try:
        raw = str(value).strip()
        raw = raw.lower().replace('sala', '').strip()
        num = int(raw)
    except Exception:
        return 'Sala 1'
    if 1 <= num <= 10:
        return f'Sala {num}'
    return 'Sala 1'


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


def obter_payload_json():
    payload = request.get_json(silent=True)
    if isinstance(payload, dict):
        return payload
    raw = request.get_data(cache=True, as_text=False)
    if not raw:
        return {}
    for encoding in ('utf-8', 'latin-1'):
        try:
            decoded = raw.decode(encoding)
            parsed = json.loads(decoded)
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            continue
    return {}


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/salas', methods=['GET'])
def listar_salas():
    salas = [f'Sala {i}' for i in range(1, 11)]
    return jsonify({'salas': salas})


@app.route('/api/pontuacoes', methods=['GET'])
def listar_pontuacoes():
    sala = request.args.get('sala')
    dados = carregar_pontuacoes()
    if sala:
        sala_norm = normalize_sala(sala)
        dados = [r for r in dados if r.get('sala') == sala_norm]
    return jsonify(dados)


@app.route('/api/pontuacoes', methods=['POST'])
def registrar_pontuacao():
    payload = obter_payload_json()
    nome = str(payload.get('nome', '')).strip()
    jogo = str(payload.get('jogo', '')).strip()
    sala = normalize_sala(payload.get('sala', 'Sala 1'))
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
        'sala': sala,
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
    sala = normalize_sala(request.args.get('sala'))
    dados = carregar_pontuacoes()
    if request.args.get('sala'):
        dados = [r for r in dados if r.get('sala') != sala]
    else:
        dados = []
    salvar_pontuacoes(dados)
    return jsonify({'ok': True})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', '5000'))
    app.run(debug=False, host='0.0.0.0', port=port)
