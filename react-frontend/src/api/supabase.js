import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tpynfipijskhhinlmlco.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRweW5maXBpanNraGhpbmxtbGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDI2MjMsImV4cCI6MjA4NTE3ODYyM30.UAf1Zmxn2B_m0SSD_G85a4R2wlBYMwIunlGDAJcHRwM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);