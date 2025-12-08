import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.https://jalecmkihfjfyxewkszk.supabase.co/,
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbGVjbWtpaGZqZnl4ZXdrc3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDQ2NDIsImV4cCI6MjA4MDc4MDY0Mn0.MoMKy0D_5kSM86mChgqreOxbPTEd5ZvQoGgbpV3FoGo
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
