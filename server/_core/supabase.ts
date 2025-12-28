import { createClient } from '@supabase/supabase-js';

type SupabaseEnv = {
  url: string;
  anonKey: string;
  serviceKey: string;
  databaseUrl: string;
};

let cachedConfig: SupabaseEnv | null = null;

function loadSupabaseEnv(): SupabaseEnv {
  if (cachedConfig) return cachedConfig;

  const config = {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    databaseUrl: process.env.SUPABASE_DATABASE_URL
  } satisfies Partial<SupabaseEnv>;

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`[Supabase] Variáveis de ambiente obrigatórias ausentes: ${missing.join(', ')}`);
  }

  cachedConfig = config as SupabaseEnv;
  return cachedConfig;
}

export function createSupabaseClient() {
  const { url, anonKey } = loadSupabaseEnv();
  return createClient(url, anonKey);
}

export function createSupabaseAdminClient() {
  const { url, serviceKey } = loadSupabaseEnv();
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export function getSupabaseDatabaseUrl() {
  return loadSupabaseEnv().databaseUrl;
}

// Instâncias padrão (úteis para rotinas que dependem do Supabase)
export const supabase = createSupabaseClient();
export const supabaseAdmin = createSupabaseAdminClient();
export const SUPABASE_DATABASE_URL = getSupabaseDatabaseUrl();

console.log('[Supabase] Cliente inicializado:', loadSupabaseEnv().url);
