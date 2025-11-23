import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { username } = req.query; // Read ?username=Utkarsh

  if (!username) return res.status(400).json({ error: "Username required" });

  // 1. Try to find the user
  let { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  // 2. If not found, create new user
  if (!user) {
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ username: username, high_score: 0 }])
      .select()
      .single();
    
    if (createError) return res.status(500).json({ error: createError.message });
    user = newUser;
  }

  return res.status(200).json({ user });
}