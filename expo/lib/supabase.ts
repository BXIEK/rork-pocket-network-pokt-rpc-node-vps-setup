import { createClient } from '@supabase/supabase-js';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { Database } from '../types/supabase';

    const supabaseUrl = 'https://uxhcsjlfwkhwkvhfacho.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

    export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });