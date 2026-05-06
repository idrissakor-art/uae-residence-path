
-- 1) Remove the permissive INSERT policy that bypasses the case-folder check
DROP POLICY IF EXISTS "Anyone can insert into case-documents" ON storage.objects;

-- 2) Enforce allowed mime types and 10MB size limit at the bucket level
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    file_size_limit = 10485760
WHERE id = 'case-documents';

-- 3) Tighten payments INSERT: require AED currency and amount >= 13500
DROP POLICY IF EXISTS "Anyone can insert pending payments" ON public.payments;

CREATE POLICY "Anyone can insert pending payments"
ON public.payments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND currency = 'AED'
  AND amount >= 13500
  AND EXISTS (SELECT 1 FROM public.visa_cases vc WHERE vc.id = case_id)
);
