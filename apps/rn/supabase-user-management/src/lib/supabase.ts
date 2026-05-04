import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) throw new Error(`Missing supabase url: ${supabaseUrl}`);
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
if (!supabaseKey) throw new Error(`Missing supabase key: ${supabaseKey}`);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
