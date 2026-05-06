
-- Drop existing INSERT policies on storage.objects for case-documents
DROP POLICY IF EXISTS "Uploads must target an existing case folder" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload case documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload case-documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload case documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload case documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload case documents" ON storage.objects;

-- Admin-only INSERT with path validation: first folder must be a valid visa_cases.id
CREATE POLICY "Admins can upload case documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'case-documents'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
  AND (storage.foldername(name))[1] IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.visa_cases vc
    WHERE vc.id::text = (storage.foldername(name))[1]
  )
);
