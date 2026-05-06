
DROP POLICY IF EXISTS "Anyone can insert case documents" ON public.case_documents;

CREATE POLICY "Insert case documents only for existing cases"
ON public.case_documents
FOR INSERT
TO anon, authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR EXISTS (
    SELECT 1 FROM public.visa_cases vc WHERE vc.id = case_id
  )
);
