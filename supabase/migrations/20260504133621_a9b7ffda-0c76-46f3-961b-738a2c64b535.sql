-- Storage policies for case-documents bucket (already exists, private)
-- Allow public (anon) clients to upload to a path under {case_id}/...
-- and allow admins (authenticated role) full access

-- Public clients (clients soumettant leur dossier depuis Application.tsx)
-- can INSERT new documents into the bucket scoped to a case folder
CREATE POLICY "Anyone can upload to case-documents"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'case-documents');

-- Authenticated users (admins) can read all documents
CREATE POLICY "Authenticated can read case-documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'case-documents');

-- Authenticated users (admins) can delete documents
CREATE POLICY "Authenticated can delete case-documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'case-documents');

-- Authenticated users (admins) can update documents (e.g., rename, replace)
CREATE POLICY "Authenticated can update case-documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'case-documents');