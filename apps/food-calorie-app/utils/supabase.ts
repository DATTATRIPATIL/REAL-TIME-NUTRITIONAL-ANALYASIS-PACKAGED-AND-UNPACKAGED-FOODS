import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yaxbhmnwxzidfkmsajph.supabase.co";

// TODO: Replace with your actual API key from Supabase Dashboard > Settings > API > Project API keys > anon/public
// The API key is a long JWT token starting with "eyJ..." - NOT the project reference ID
const supabaseAnonKey = "sb_publishable_-UWMRY5p6YoB2mCLshf-jA_JHAmG_uX";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key. Please add your API key in utils/supabase.ts");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



