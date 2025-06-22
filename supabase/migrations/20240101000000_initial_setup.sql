-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create counters table
CREATE TABLE IF NOT EXISTS counters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    count BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on counter name for fast lookups
CREATE INDEX IF NOT EXISTS idx_counters_name ON counters(name);

-- Create index on expires_at for cleanup
CREATE INDEX IF NOT EXISTS idx_counters_expires_at ON counters(expires_at) WHERE expires_at IS NOT NULL;

-- Create leaderboards table for ordered sets functionality
CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    entries JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index on leaderboard name
CREATE INDEX IF NOT EXISTS idx_leaderboards_name ON leaderboards(name);

-- Create counter_logs table for tracking counter changes
CREATE TABLE IF NOT EXISTS counter_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    counter_name VARCHAR(100) NOT NULL,
    previous_count BIGINT NOT NULL,
    new_count BIGINT NOT NULL,
    increment_by BIGINT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    ip_address INET,
    user_agent TEXT,
    country VARCHAR(2),
    city VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for counter logs
CREATE INDEX IF NOT EXISTS idx_counter_logs_counter_name ON counter_logs(counter_name);
CREATE INDEX IF NOT EXISTS idx_counter_logs_timestamp ON counter_logs(timestamp);

-- Function to increment counter with logging
CREATE OR REPLACE FUNCTION increment_counter(
    counter_name VARCHAR(100),
    increment_by BIGINT DEFAULT 1
) RETURNS BIGINT AS $$
DECLARE
    current_count BIGINT;
    new_count BIGINT;
BEGIN
    -- Insert or update counter
    INSERT INTO counters (name, count, updated_at)
    VALUES (counter_name, increment_by, NOW())
    ON CONFLICT (name) 
    DO UPDATE SET 
        count = counters.count + increment_by,
        updated_at = NOW()
    RETURNING count INTO new_count;
    
    -- Log the change
    INSERT INTO counter_logs (counter_name, previous_count, new_count, increment_by)
    VALUES (counter_name, new_count - increment_by, new_count, increment_by);
    
    RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get counter value
CREATE OR REPLACE FUNCTION get_counter(counter_name VARCHAR(100))
RETURNS BIGINT AS $$
DECLARE
    counter_value BIGINT;
BEGIN
    SELECT count INTO counter_value
    FROM counters
    WHERE name = counter_name;
    
    RETURN COALESCE(counter_value, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to reset counter
CREATE OR REPLACE FUNCTION reset_counter(counter_name VARCHAR(100))
RETURNS BIGINT AS $$
DECLARE
    old_count BIGINT;
BEGIN
    SELECT count INTO old_count
    FROM counters
    WHERE name = counter_name;
    
    UPDATE counters
    SET count = 0, updated_at = NOW()
    WHERE name = counter_name;
    
    -- Log the reset
    INSERT INTO counter_logs (counter_name, previous_count, new_count, increment_by)
    VALUES (counter_name, COALESCE(old_count, 0), 0, -COALESCE(old_count, 0));
    
    RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired counters
CREATE OR REPLACE FUNCTION cleanup_expired_counters()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM counters
    WHERE expires_at IS NOT NULL AND expires_at <= NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_counters_updated_at
    BEFORE UPDATE ON counters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboards_updated_at
    BEFORE UPDATE ON leaderboards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE counter_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access on counters" ON counters
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update on counters" ON counters
    FOR ALL USING (true);

CREATE POLICY "Allow public read access on leaderboards" ON leaderboards
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update on leaderboards" ON leaderboards
    FOR ALL USING (true);

CREATE POLICY "Allow public read access on counter_logs" ON counter_logs
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on counter_logs" ON counter_logs
    FOR INSERT WITH CHECK (true);

