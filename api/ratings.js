import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("ratings").select("*");
    if (error) return res.status(500).json(error);
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { name, rating, comment } = req.body;

    const { data, error } = await supabase
      .from("ratings")
      .insert([{ name, rating, comment }]);

    if (error) return res.status(500).json(error);
    return res.status(201).json(data[0]);
  }
}
