-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create counters table
CREATE TABLE IF NOT EXISTS counters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    value BIGINT DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_counters_name ON counters(name);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_counters_created_at ON counters(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_counters_updated_at 
    BEFORE UPDATE ON counters 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON counters
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policy to allow read access for anonymous users
CREATE POLICY "Allow read access for anonymous users" ON counters
    FOR SELECT USING (true);

