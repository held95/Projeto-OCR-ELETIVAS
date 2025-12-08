import { createClient } from "@supabase/supabase-js";

// ⛔ IMPORTANTÍSSIMO: nunca coloque a URL diretamente no process.env
// Configure no painel da Vercel: Settings → Environment Variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .order("id", { ascending: true });

    if (error) return res.status(500).json({ error });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const payload = req.body;

    const { data, error } = await supabase
      .from("ratings")
      .insert([payload])
      .select();

    if (error) return res.status(500).json({ error });
    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ error: "Método não permitido" });
}
