const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
// const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

const supabase = createClient('https://jqcehtkrvvdvtffgclwa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxY2VodGtydnZkdnRmZmdjbHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MTMyNTksImV4cCI6MjA1NDM4OTI1OX0.cuq8t43j7LpSRcxbiWwBJ7LHJ4yAqo1vUuTX9ngyiKk');

module.exports = {supabase};
