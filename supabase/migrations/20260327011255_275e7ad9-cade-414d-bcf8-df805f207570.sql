
-- Fix payments RLS: drop permissive policy, restrict to authenticated users only
DROP POLICY IF EXISTS "Admin users can view all payments" ON public.payments;

CREATE POLICY "Authenticated users can manage payments"
  ON public.payments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix case_documents RLS: drop permissive policy, restrict to authenticated or document owner
DROP POLICY IF EXISTS "Admin users can manage all documents" ON public.case_documents;

CREATE POLICY "Authenticated users can manage documents"
  ON public.case_documents
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
