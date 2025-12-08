// Armazenamento em memória (apenas para DEMO)
let ratings = [];

// Função Serverless da Vercel
export default function handler(req, res) {
  // CORS básico
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // RECEBE UMA AVALIAÇÃO
  if (req.method === "POST") {
    try {
      const dados = req.body;

      // Validação simples: ao menos 1 campo
      if (!dados || typeof dados !== "object" || Object.keys(dados).length === 0) {
        return res.status(400).json({ error: "Payload inválido." });
      }

      // Cria registro completo com ID + data
      const novoRegistro = {
        id: ratings.length + 1,
        ...dados,
        data: new Date().toISOString(),
      };

      ratings.push(novoRegistro);

      return res.status(201).json({
        message: "Avaliação registrada com sucesso!",
        data: novoRegistro,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao salvar avaliação." });
    }
  }

  // LISTA TODAS AS AVALIAÇÕES
  if (req.method === "GET") {
    return res.status(200).json(ratings);
  }

  return res.status(405).json({ error: "Método não permitido." });
}
