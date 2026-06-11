/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://ciywwpnfiokubrbrblpo.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpeXd3cG5maW9rdWJyYnJibHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTg3OTUsImV4cCI6MjA5NjU3NDc5NX0.esk2L3NtCjuZdSrLrmQ1KAnVre_nt4GCYFiQGK3LnO8';

// Read from local storage for easy client-side overrides
let localUrl = '';
let localKey = '';
if (typeof window !== 'undefined') {
  try {
    localUrl = localStorage.getItem('BUNON_SUPABASE_URL') || '';
    localKey = localStorage.getItem('BUNON_SUPABASE_ANON_KEY') || '';
  } catch (e) {}
}

const rawUrl = localUrl || import.meta.env.VITE_SUPABASE_URL;
export const supabaseUrl = (rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('http')) ? rawUrl : defaultUrl;

const rawKey = localKey || import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabaseAnonKey = (rawKey && typeof rawKey === 'string' && rawKey.trim() !== '' && rawKey !== 'undefined') ? rawKey : defaultKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isUsingPlaceholder = false;
