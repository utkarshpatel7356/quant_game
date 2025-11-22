// api/test-db.js
import { createClient } from '@supabase/supabase-js';

// We use the specific variable names you have in your file
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(request, response) {
  try {
    // Query the "notes" table
    const { data, error } = await supabase
      .from('notes')
      .select('*');

    if (error) throw error;

    return response.status(200).json({ notes: data });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}