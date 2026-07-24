import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://rffjwikwdjrzcucftlya.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_pW9_pD76K9VqtxDvUX5nzg_ySGYkppC";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

export { supabase };
console.log("Supabase conectado:", supabase);