import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

let supabaseClient = null;

const getSupabase = () => {
    if (supabaseClient) return supabaseClient;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error(
            'Variaveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nao configuradas no .env.',
        );
    }

    supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    return supabaseClient;
};

export default getSupabase;
