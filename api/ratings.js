// Ativa parsing de JSON no Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

// Armazenamento global — persiste entre execuções serverless
if (!global.ratings) {
  global.ratings = [];
}

export default function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET → retorna avaliações
  if (req.method === "GET") {
    return res.status(200).json(global.ratings);
  }

  // POST → salva nova avaliação
  if (req.method === "POST") {
    try {
      const dados = req.body;

      if (!dados || typeof dados !== "object") {
        return res.status(400).json({ error: "JSON inválido." });
      }

      const novoRegistro = {
        id: global.ratings.length + 1,
        ...dados,
        data: new Date().toISOString(),
      };

      global.ratings.push(novoRegistro);

      return res.status(201).json({
        message: "Avaliação registrada com sucesso!",
        data: novoRegistro,
      });

    } catch (err) {
      console.error("ERRO:", err);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  // Qualquer outro método → 405
  return res.status(405).json({ error: "Método não permitido." });
}
