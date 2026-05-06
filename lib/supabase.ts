import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hvvgdwuyzfpjfhpnmwfb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dmdkd3V5emZwamZocG5td2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTA2OTgsImV4cCI6MjA5MTM4NjY5OH0.3DQCnnhw6LHSFXyiDWTxs8JSTIfxJ5gzwWcSbTIQGJs"

// On initialise le client avec les options de sécurité pour éviter les conflits de session
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Utilise PKCE pour une meilleure gestion du flux d'authentification
    storageKey: 'sb-auth-token', // Clé de stockage stable
  }
})