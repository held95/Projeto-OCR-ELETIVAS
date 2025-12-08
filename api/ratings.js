// api/ratings.js  (CommonJS – compatível com Vercel Node)

const { createClient } = require('@supabase/supabase-js');

// Lê as variáveis de ambiente definidas no Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ SUPABASE_URL ou SUPABASE_ANON_KEY não configurados.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função serverless
module.exports = async (req, res) => {
  // CORS básico para permitir chamadas do seu frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET -> lista avaliações
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Supabase GET error:', error);
        return res.status(500).json({ error: 'Erro ao buscar avaliações' });
      }

      return res.status(200).json(data || []);
    } catch (e) {
      console.error('GET handler error:', e);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  // POST -> salva avaliação enviada pelo formulário
  if (req.method === 'POST') {
    try {
      const {
        facilidade,
        utilidade,
        velocidade,
        clareza,
        ajuda,
        melhorar,
        momentos,
        mudanca,
        beneficio,
        experiencia
      } = req.body || {};

      // validação simples
      if (
        facilidade == null ||
        utilidade == null ||
        velocidade == null ||
        clareza == null ||
        !ajuda ||
        !melhorar ||
        !momentos ||
        !mudanca ||
        !beneficio ||
        !experiencia
      ) {
        return res
          .status(400)
          .json({ error: 'Campos obrigatórios ausentes no body' });
      }

      const { data, error } = await supabase
        .from('ratings')
        .insert([
          {
            facilidade,
            utilidade,
            velocidade,
            clareza,
            ajuda,
            melhorar,
            momentos,
            mudanca,
            beneficio,
            experiencia
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase POST error:', error);
        return res.status(500).json({ error: 'Erro ao salvar avaliação' });
      }

      return res.status(201).json(data);
    } catch (e) {
      console.error('POST handler error:', e);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  // Método não suportado
  return res.status(405).json({ error: 'Method not allowed' });
};
