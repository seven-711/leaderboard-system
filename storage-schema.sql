-- Create storage bucket for departments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('departments', 'departments', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for departments bucket
-- IMPORTANT: In a real app, restrict INSERT/UPDATE to authenticated users
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'departments' );
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'departments' );
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'departments' );
