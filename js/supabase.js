(() => {
  const cfg = window.APP_CONFIG || {};
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_KEY || cfg.SUPABASE_URL.includes('YOUR_PROJECT_REF')) {
    console.warn('Supabase config is not set. Update js/config.js');
  }

  window.db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
})();
