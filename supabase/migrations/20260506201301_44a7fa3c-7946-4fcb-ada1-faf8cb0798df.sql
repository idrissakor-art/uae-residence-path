DROP POLICY IF EXISTS "Anyone can insert pending payments" ON public.payments;

CREATE POLICY "Anyone can insert pending payments"
ON public.payments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND currency = 'AED'
  AND amount = 13500
  AND EXISTS (SELECT 1 FROM public.visa_cases vc WHERE vc.id = payments.case_id)
);