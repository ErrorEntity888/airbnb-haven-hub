// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iegyfxoycykisscfktxq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZ3lmeG95Y3lraXNzY2ZrdHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyOTE5MzMsImV4cCI6MjA1NTg2NzkzM30.MJj0aVJ8Q72rsXudyI0NEDfoxA7LckvXqifbS4_xtrM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);