console.log('--- SCRIPT START ---');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

try {
    const envPath = path.join(__dirname, '.env.local');
    console.log('Reading:', envPath);
    const envContent = fs.readFileSync(envPath, 'utf8');

    const getEnvValue = (key) => {
        const match = envContent.match(new RegExp(`${key}="?([^"\\n]+)"?`));
        return match ? match[1] : null;
    }

    const supabaseUrl = getEnvValue('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseAnonKey = getEnvValue('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    console.log('URL:', supabaseUrl);

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing config');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    supabase.from('family_members').select('*', { count: 'exact', head: true })
        .then(({ data, error }) => {
            if (error) console.error('API Error:', error);
            else console.log('Count:', data);
        })
        .catch(err => console.error('Promise error:', err))
        .finally(() => console.log('--- SCRIPT END ---'));

} catch (err) {
    console.error('Fatal:', err);
}
