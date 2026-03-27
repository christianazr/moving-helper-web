const SUPABASE_URL = "https://iluwuzmoussdvycmfqol.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdXd1em1vdXNzZHZ5Y21mcW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDM4NzQsImV4cCI6MjA5MDE3OTg3NH0.9VBs4ppthf_2AJd8CPAWN6659GL0HdAdYRefthBkLLs";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true // 🔥 CLAVE
    }
  }
);
