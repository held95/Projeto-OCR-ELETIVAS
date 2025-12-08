// api/ratings.js  (Vercel Serverless Function - Node.js / CommonJS)

const { createClient } = require("@supabase/supabase-js");

// Pega as variáveis de ambiente da Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Verificação básica (ajuda a debugar se esquecer alguma env)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ SUPABASE_URL ou SUPABASE_ANON_KEY não configuradas.");
}

// Cria o client do Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export padrão em CommonJS
module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const { data, error } = await supabase.from("ratings").select("*");

      if (error) {
        console.error("Erro Supabase GET:", error);
        return res.status(500).json({ error: "Erro ao buscar avaliações" });
      }

      return res.status(200).json(data || []);
    }

    if (req.method === "POST") {
      const payload = req.body;

      // Log de segurança (sem dados sensíveis) para debug
      console.log("📥 Novo rating recebido:", Object.keys(payload));

      const { data, error } = await supabase.from("ratings").insert([payload]);

      if (error) {
        console.error("Erro Supabase POST:", error);
        return res.status(500).json({ error: "Erro ao salvar avaliação" });
      }

      return res.status(201).json(data[0]);
    }

    // Outros métodos não permitidos
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("❌ Erro inesperado na função /api/ratings:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
