-- Lock down email_notifications inserts: only admins can insert directly.
-- Anonymous case submissions queue the internal notification via a SECURITY DEFINER RPC
-- that hardcodes recipient, subject, and template (no attacker-controlled fields).

DROP POLICY IF EXISTS "Queue notification only for valid case recipient" ON public.email_notifications;

CREATE POLICY "Admins can insert notifications"
ON public.email_notifications
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- SECURITY DEFINER RPC for the public submission flow.
-- Hardcodes recipient_email, subject, template_name. Caller can only pass case_id.
CREATE OR REPLACE FUNCTION public.queue_internal_case_notification(_case_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF _case_id IS NULL THEN
    RAISE EXCEPTION 'case_id is required';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.visa_cases WHERE id = _case_id) THEN
    RAISE EXCEPTION 'Invalid case_id';
  END IF;

  INSERT INTO public.email_notifications (
    case_id, recipient_email, subject, template_name, status
  ) VALUES (
    _case_id,
    'team@uae-visaservices.com',
    'Nouveau dossier complet à traiter',
    'new_case_internal',
    'pending'
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.queue_internal_case_notification(uuid) TO anon, authenticated;