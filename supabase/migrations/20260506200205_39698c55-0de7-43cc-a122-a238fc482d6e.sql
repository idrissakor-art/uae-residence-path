
-- 1) Lock email_notifications inserts to a valid case + matching recipient
DROP POLICY IF EXISTS "Anyone can queue a notification" ON public.email_notifications;

CREATE POLICY "Queue notification only for valid case recipient"
ON public.email_notifications
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND case_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.visa_cases vc
    WHERE vc.id = case_id
      AND lower(vc.client_email) = lower(recipient_email)
  )
);

-- 2) Allow anon/authenticated uploads to case-documents only into an existing case folder
CREATE POLICY "Public uploads must target an existing case folder"
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
