// Armazenamento em memória (para demo)
let ratings = [];

/**
 * Função serverless da Vercel
 * Caminho: /api/ratings
 */
module.exports = (req, res) => {
  // CORS básico para permitir chamadas do front
  res.setHeader("Access-Control-Allow-Origin", "*"); // se quiser, troque por seu domínio específico
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { nota, comentario } = req.body || {};

      if (typeof nota !== "number" || !comentario) {
        return res
          .status(400)
          .json({ error: "Campos 'nota' (number) e 'comentario' são obrigatórios." });
      }

      const novoRegistro = {
        id: ratings.length + 1,
        nota,
        comentario,
        data: new Date().toISOString(),
      };

      ratings.push(novoRegistro);

      return res.status(201).json({
        message: "Avaliação salva com sucesso.",
        data: novoRegistro,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao salvar avaliação." });
    }
  } else if (req.method === "GET") {
    return res.status(200).json(ratings);
  }

  return res.status(405).json({ error: "Método não permitido." });
};
