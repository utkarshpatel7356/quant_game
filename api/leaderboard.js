import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('users')
    .select('username, high_score')
    .order('high_score', { ascending: false })
    .limit(10);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ leaderboard: data });
}