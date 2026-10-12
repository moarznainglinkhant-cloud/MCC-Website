// Exposes the Supabase client factory as window.supabase (same shape as the CDN build).
import { createClient } from "@supabase/supabase-js";
window.supabase = { createClient };
