import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbDepartment {
    id: string;
    name: string;
    logo: string;
    color: string;
    wins: number;
    losses: number;
    points: number;
    support_count: number;
    created_at: string;
}

export interface DbGame {
    id: string;
    type: string;
    department_a_id: string;
    department_b_id: string;
    score_a: number;
    score_b: number;
    status: 'upcoming' | 'live' | 'completed';
    start_time: string;
    current_period?: string;
    game_clock?: string;
    created_at: string;
}
