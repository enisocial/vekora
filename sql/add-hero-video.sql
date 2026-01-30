-- Create hero_video table for homepage video
CREATE TABLE IF NOT EXISTS hero_video (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    video_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies
ALTER TABLE hero_video ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero video is viewable by everyone" ON hero_video FOR SELECT USING (true);
CREATE POLICY "Hero video is manageable by admins only" ON hero_video FOR ALL USING (auth.uid() IN (SELECT id FROM admins));

-- Trigger for updated_at
CREATE TRIGGER update_hero_video_updated_at BEFORE UPDATE ON hero_video FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();