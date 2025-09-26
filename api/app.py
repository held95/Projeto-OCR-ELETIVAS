from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# pega a chave a partir da variável de ambiente (defina isso no painel da Vercel)
LLAMA_API_KEY = os.environ.get("LLAMA_API_KEY")

@app.route("/processar", methods=["POST"])
def processar():
    if "file" not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400

    file = request.files["file"]

    try:
        # leia os bytes do arquivo (mais confiável em serverless)
        file_bytes = file.read()
        files = {"file": (file.filename, file_bytes, file.mimetype)}

        if not LLAMA_API_KEY:
            return jsonify({"error": "LLAMA_API_KEY não configurada no servidor"}), 500

        headers = {"Authorization": f"Bearer {LLAMA_API_KEY}"}

        resp = requests.post(
            "https://api.llamacloud.com/extraction/94f39a8b-c1e4-4dd9-a8b1-147f910419e1",
            headers=headers,
            files=files,
            timeout=30
        )

        # tenta parsear JSON da resposta
        try:
            data = resp.json()
        except ValueError:
            return jsonify({
                "error": "Resposta não-JSON da LlamaCloud",
                "status_code": resp.status_code,
                "text": resp.text
            }), 502

        if resp.status_code >= 400:
            # repassa o erro da LlamaCloud para o frontend
            return jsonify({"error": "LlamaCloud retornou erro", "status_code": resp.status_code, "body": data}), resp.status_code

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# para testes locais (não afeta Vercel)
if __name__ == "__main__":
    app.run(debug=True, port=5000)
