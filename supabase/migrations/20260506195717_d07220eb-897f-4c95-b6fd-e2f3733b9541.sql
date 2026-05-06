
DROP POLICY IF EXISTS "Anyone can submit a new case via simulator" ON public.visa_cases;

CREATE POLICY "Anyone can submit a new case via simulator"
ON public.visa_cases
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status IN ('nouveau', 'non-eligible')
  AND priority = 'normal'
  AND assigned_agent_id IS NULL
  AND internal_notes IS NULL
  AND estimated_cost IS NULL
  AND amount_paid IS NULL
);
