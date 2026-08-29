import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ztgqxtfadxypkgzakbkh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0emhoanBkZGxiemxwaXdsZWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MzIwMzYsImV4cCI6MjA0MTAwODAzNn0.P9z-0hU3_6QHVJ-cqHvQP8-V_bZJjQQDUqJXZQ9Jq0I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
  },
});
