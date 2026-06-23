const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  // try to fetch from information_schema if service_role, else just test 'cart_items' table existence.
  const { data, error } = await supabase.from('cart_items').select('*').limit(1);
  console.log('cart_items error:', error);
  const { data: d2, error: e2 } = await supabase.from('carts').select('*').limit(1);
  console.log('carts error:', e2);
}
check();
