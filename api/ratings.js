import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("ratings").select("*");

    if (error) return res.status(500).json({ error });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const payload = req.body;

    const { data, error } = await supabase.from("ratings").insert([payload]);

    if (error) return res.status(500).json({ error });

    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
