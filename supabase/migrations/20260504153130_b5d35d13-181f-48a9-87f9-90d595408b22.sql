
-- 1. Restrict storage INSERT on case-documents to a valid case_id folder
DROP POLICY IF EXISTS "Anyone can upload case documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload case-documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload case documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload case documents" ON storage.objects;

CREATE POLICY "Uploads must target an existing case folder"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'case-documents'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.visa_cases vc
    WHERE vc.id::text = (storage.foldername(name))[1]
  )
);

-- 2. Remove password_hash from admin_users (rely on Supabase Auth)
ALTER TABLE public.admin_users DROP COLUMN IF EXISTS password_hash;
