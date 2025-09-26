

from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

LLAMA_API_KEY = os.getenv("llx-krknpe6FO3RpFgrzedoWD6ZETbZNQ28MTxCFhZHCx69reAEV")

@app.route("/processar", methods=["POST"])
def processar():
    try:
        if "file" not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400

        file = request.files["file"]

        # monta a requisição para a API da LlamaCloud
        files = {"file": (file.filename, file.stream, file.mimetype)}
        headers = {"Authorization": f"Bearer {llx-krknpe6FO3RpFgrzedoWD6ZETbZNQ28MTxCFhZHCx69reAEV}"}

        response = requests.post(
            "https://api.llamacloud.com/extraction/94f39a8b-c1e4-4dd9-a8b1-147f910419e1",
            headers=headers,
            files=files
        )

        return jsonify(response.json())

    except Exception as e:
        return jsonify({"error": str(e)}), 500
