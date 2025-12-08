// api/ratings.js (Vercel serverless function – CommonJS)

// 1) Importa o cliente Supabase (CommonJS)
const { createClient } = require("@supabase/supabase-js");

// 2) Lê as variáveis de ambiente
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// 3) Validação básica (ajuda a achar erro nos logs do Vercel)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ SUPABASE_URL ou SUPABASE_ANON_KEY não definidos nas variáveis de ambiente");
}

// 4) Cria o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 5) Domínio do frontend autorizado para CORS
const FRONTEND_ORIGIN = "https://avaliacao-pro-time.vercel.app";

// 6) Handler principal
module.exports = async (req, res) => {
  // --------- CORS ----------
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      // Busca as avaliações mais recentes
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("❌ Supabase GET error:", error);
        return res.status(500).json({ error: "Supabase GET error", details: error });
      }

      return res.status(200).json(data || []);
    }

    if (req.method === "POST") {
      const body = req.body || {};

      const payload = {
        facilidade: body.facilidade,
        utilidade: body.utilidade,
        velocidade: body.velocidade,
        clareza: body.clareza,
        ajuda: body.ajuda,
        melhorar: body.melhorar,
        momentos: body.momentos,
        mudanca: body.mudanca,
        beneficio: body.beneficio,
        experiencia: body.experiencia
      };

      // Validação rápida
      const missing = Object.entries(payload).filter(
        ([, v]) => v === undefined || v === null || v === ""
      );

      if (missing.length > 0) {
        return res.status(400).json({
          error: "Campos obrigatórios faltando",
          missing: missing.map(([k]) => k)
        });
      }

      const { data, error } = await supabase
        .from("ratings")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error("❌ Supabase POST error:", error);
        return res.status(500).json({ error: "Supabase POST error", details: error });
      }

      return res.status(201).json(data);
    }

    // Método não suportado
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected error", details: String(err) });
  }
};
