-- 1. Fix function search_path mutability
CREATE OR REPLACE FUNCTION public.generate_case_number()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  RETURN 'UAE-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('public.case_number_seq')::TEXT, 6, '0');
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_case_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  IF NEW.case_number IS NULL OR NEW.case_number = '' THEN
    NEW.case_number := public.generate_case_number();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.case_status_history (case_id, old_status, new_status, changed_by, change_reason)
    VALUES (NEW.id, OLD.status, NEW.status, NEW.assigned_agent_id, 'Status updated');
  END IF;
  RETURN NEW;
END;
$function$;

-- 2. visa_cases: drop overly permissive policy, keep anon INSERT only for the simulator
DROP POLICY IF EXISTS "Admin users can manage all cases" ON public.visa_cases;

-- Allow anyone (incl. anonymous simulator users) to submit a new case
CREATE POLICY "Anyone can submit a new case via simulator"
ON public.visa_cases
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated users (admins, once Supabase Auth is wired) can read/update/delete
CREATE POLICY "Authenticated users can read cases"
ON public.visa_cases
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update cases"
ON public.visa_cases
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cases"
ON public.visa_cases
FOR DELETE
TO authenticated
USING (true);

-- 3. email_notifications: lock down. Only authenticated users can manage; trigger writes via SECURITY DEFINER context if needed
DROP POLICY IF EXISTS "Admin users can view all notifications" ON public.email_notifications;

CREATE POLICY "Authenticated users can read notifications"
ON public.email_notifications
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert notifications"
ON public.email_notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update notifications"
ON public.email_notifications
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete notifications"
ON public.email_notifications
FOR DELETE
TO authenticated
USING (true);

-- 4. case_status_history: lock down. The log_status_change trigger now runs as SECURITY DEFINER and bypasses RLS.
DROP POLICY IF EXISTS "Admin users can view all history" ON public.case_status_history;

CREATE POLICY "Authenticated users can read status history"
ON public.case_status_history
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert status history"
ON public.case_status_history
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update status history"
ON public.case_status_history
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete status history"
ON public.case_status_history
FOR DELETE
TO authenticated
USING (true);