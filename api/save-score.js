import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // We use POST for sending data securely
  const { username, score } = JSON.parse(req.body);

  // 1. Get current high score
  const { data: user } = await supabase
    .from('users')
    .select('high_score')
    .eq('username', username)
    .single();

  // 2. Only update if new score is higher
  if (user && score > user.high_score) {
    await supabase
      .from('users')
      .update({ high_score: score })
      .eq('username', username);
      
    return res.status(200).json({ message: "New High Score!" });
  }

  return res.status(200).json({ message: "Score not high enough" });
}