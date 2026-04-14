import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ufsklevskppohulcxllt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdWJhYmFzZSIsInJlZiI6InVmc2tsZXZza3Bwb2h1bGN4bGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjk1OTIsImV4cCI6MjA1OTc0NTU5Mn0.qG62m1lT_Hh3y_v37_9x_1708';

console.log('Starting...');

try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Client created, signing up...');

    const { data, error } = await supabase.auth.signUp({
        email: 'admin@baniharun.com',
        password: 'admin123456',
    });

    if (error) {
        console.error('Signup error:', error.message);
    } else {
        console.log('=== USER CREATED ===');
        console.log('Email: admin@baniharun.com');
        console.log('Password: admin123456');
        console.log('User ID:', data.user?.id);
        console.log('Confirmation:', data.user?.confirmation_sent_at ? 'Email confirmation sent' : 'Auto-confirmed');
    }
} catch (err) {
    console.error('Fatal error:', err);
}

process.exit(0);
