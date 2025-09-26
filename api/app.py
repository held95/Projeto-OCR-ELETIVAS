from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# pega a chave da variável de ambiente LLAMA_API_KEY
LLAMA_API_KEY = os.environ.get("LLAMA_API_KEY")

print("Chave recebida?", bool(LLAMA_API_KEY))  # debug nos logs da Vercel

@app.route("/processar", methods=["POST"])
def processar():
    try:
        if "file" not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400

        file = request.files["file"]

        # monta a requisição para a API da LlamaCloud
        files = {"file": (file.filename, file.stream, file.mimetype)}
        headers = {"Authorization": f"Bearer {LLAMA_API_KEY}"}

        response = requests.post(
            "https://api.llamacloud.com/extraction/94f39a8b-c1e4-4dd9-a8b1-147f910419e1",
            headers=headers,
            files=files,
            timeout=60
        )

        # se a API não responder com sucesso
        if response.status_code != 200:
            return jsonify({
                "error": "Falha na API LlamaCloud",
                "status_code": response.status_code,
                "details": response.text
            }), response.status_code

        return jsonify(response.json())

    except Exception as e:
        return jsonify({"error": str(e)}), 500
