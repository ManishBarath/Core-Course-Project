const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

const supabase = createClient('https://jqcehtkrvvdvtffgclwa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxY2VodGtydnZkdnRmZmdjbHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MTMyNTksImV4cCI6MjA1NDM4OTI1OX0.cuq8t43j7LpSRcxbiWwBJ7LHJ4yAqo1vUuTX9ngyiKk');
async function createTables() {
    const sql = `
        -- Enable required extensions
        create extension if not exists "uuid-ossp";

        -- Create Species Table
        create table if not exists species (
            id uuid primary key default uuid_generate_v4(),
            scientific_name text not null unique,
            common_name text,
            created_at timestamp with time zone default now()
        );

        -- Create Fishing Events Table
        create table if not exists fishing_events (
            id uuid primary key default uuid_generate_v4(),
            event_date date not null,
            latitude numeric(9,6) not null,
            longitude numeric(9,6) not null,
            depth numeric(7,2),
            total_catch_weight numeric(9,2),
            created_at timestamp with time zone default now()
        );

        -- Create Occurrence Data Table
        create table if not exists occurrence_data (
            id uuid primary key default uuid_generate_v4(),
            fishing_event_id uuid not null references fishing_events(id) on delete cascade,
            species_id uuid not null references species(id) on delete cascade,
            presence_confirmed boolean default true,
            created_at timestamp with time zone default now(),
            unique (fishing_event_id, species_id)
        );

        -- Create Abundance Data Table
        create table if not exists abundance_data (
            id uuid primary key default uuid_generate_v4(),
            fishing_event_id uuid not null references fishing_events(id) on delete cascade,
            species_id uuid not null references species(id) on delete cascade,
            catch_weight numeric(9,2) not null,
            created_at timestamp with time zone default now(),
            unique (fishing_event_id, species_id)
        );

        -- Create Indexes for faster queries
        create index if not exists idx_fishing_events_date on fishing_events (event_date);
        create index if not exists idx_fishing_events_location on fishing_events (latitude, longitude);
        create index if not exists idx_species_scientific_name on species (scientific_name);
        create index if not exists idx_occurrence_species on occurrence_data (species_id);
        create index if not exists idx_abundance_species on abundance_data (species_id);
    `;

    const { error } = await supabase.rpc("execute_sql", { query: sql });
    
    if (error) {
        console.error("Error executing SQL:", error);
    } else {
        console.log("Tables created successfully.");
    }
}

createTables();
module.exports = {supabase};
