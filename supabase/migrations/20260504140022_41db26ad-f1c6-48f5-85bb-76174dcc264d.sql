
-- =========================================================
-- 0) Foundation: app_role enum, user_roles table, has_role()
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read user_roles" ON public.user_roles;
CREATE POLICY "Admins can read user_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- =========================================================
-- 1) admin_users — admin-only
-- =========================================================
DROP POLICY IF EXISTS "Admin users can manage all data" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can insert admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can delete admin_users" ON public.admin_users;

CREATE POLICY "Admins can read admin_users"
ON public.admin_users FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert admin_users"
ON public.admin_users FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update admin_users"
ON public.admin_users FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete admin_users"
ON public.admin_users FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =========================================================
-- 2) visa_cases — public INSERT, admin-only rest
-- =========================================================
DROP POLICY IF EXISTS "Authenticated users can read cases" ON public.visa_cases;
DROP POLICY IF EXISTS "Authenticated users can update cases" ON public.visa_cases;
DROP POLICY IF EXISTS "Authenticated users can delete cases" ON public.visa_cases;
DROP POLICY IF EXISTS "Admins can read cases" ON public.visa_cases;
DROP POLICY IF EXISTS "Admins can update cases" ON public.visa_cases;
DROP POLICY IF EXISTS "Admins can delete cases" ON public.visa_cases;

CREATE POLICY "Admins can read cases"
ON public.visa_cases FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update cases"
ON public.visa_cases FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete cases"
ON public.visa_cases FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =========================================================
-- 3) case_documents — public INSERT, admin-only rest
-- =========================================================
DROP POLICY IF EXISTS "Authenticated users can manage documents" ON public.case_documents;
DROP POLICY IF EXISTS "Anyone can insert case documents" ON public.case_documents;
DROP POLICY IF EXISTS "Admins can read case documents" ON public.case_documents;
DROP POLICY IF EXISTS "Admins can update case documents" ON public.case_documents;
DROP POLICY IF EXISTS "Admins can delete case documents" ON public.case_documents;

CREATE POLICY "Anyone can insert case documents"
ON public.case_documents FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read case documents"
ON public.case_documents FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update case documents"
ON public.case_documents FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete case documents"
ON public.case_documents FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =========================================================
-- 4) payments — public INSERT (pending only), admin-only rest
-- =========================================================
DROP POLICY IF EXISTS "Authenticated users can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Anyone can insert pending payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can read payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can update payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can delete payments" ON public.payments;

CREATE POLICY "Anyone can insert pending payments"
ON public.payments FOR INSERT TO anon, authenticated
WITH CHECK (status = 'pending');

CREATE POLICY "Admins can read payments"
ON public.payments FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update payments"
ON public.payments FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete payments"
ON public.payments FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =========================================================
-- 5) email_notifications — public INSERT (pending only), admin-only rest
-- =========================================================
DROP POLICY IF EXISTS "Authenticated users can read notifications" ON public.email_notifications;
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.email_notifications;
DROP POLICY IF EXISTS "Authenticated users can update notifications" ON public.email_notifications;
DROP POLICY IF EXISTS "Authenticated users can delete notifications" ON public.email_notifications;
DROP POLICY IF EXISTS "Anyone can queue a notification" ON public.email_notifications;
DROP POLICY IF EXISTS "Admins can read notifications" ON public.email_notifications;
DROP POLICY IF EXISTS "Admins can update notifications" ON public.email_notifications;
DROP POLICY IF EXISTS "Admins can delete notifications" ON public.email_notifications;

CREATE POLICY "Anyone can queue a notification"
ON public.email_notifications FOR INSERT TO anon, authenticated
WITH CHECK (status = 'pending');

CREATE POLICY "Admins can read notifications"
ON public.email_notifications FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update notifications"
ON public.email_notifications FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete notifications"
ON public.email_notifications FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =========================================================
-- 6) case_status_history — admin-only
-- =========================================================
DROP POLICY IF EXISTS "Authenticated users can read status history" ON public.case_status_history;
DROP POLICY IF EXISTS "Authenticated users can insert status history" ON public.case_status_history;
DROP POLICY IF EXISTS "Authenticated users can update status history" ON public.case_status_history;
DROP POLICY IF EXISTS "Authenticated users can delete status history" ON public.case_status_history;
DROP POLICY IF EXISTS "Admins can read status history" ON public.case_status_history;
DROP POLICY IF EXISTS "Admins can insert status history" ON public.case_status_history;
DROP POLICY IF EXISTS "Admins can update status history" ON public.case_status_history;
DROP POLICY IF EXISTS "Admins can delete status history" ON public.case_status_history;

CREATE POLICY "Admins can read status history"
ON public.case_status_history FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert status history"
ON public.case_status_history FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update status history"
ON public.case_status_history FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete status history"
ON public.case_status_history FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =========================================================
-- 7) Storage: case-documents bucket — public upload, admin-only read/update/delete
-- =========================================================
DROP POLICY IF EXISTS "Anyone can upload to case-documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can insert into case-documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read case-documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update case-documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete case-documents" ON storage.objects;

CREATE POLICY "Anyone can insert into case-documents"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'case-documents');

CREATE POLICY "Admins can read case-documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'case-documents' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update case-documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'case-documents' AND public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (bucket_id = 'case-documents' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete case-documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'case-documents' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- =========================================================
-- 8) Revoke EXECUTE on internal helpers from public callers
-- =========================================================
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated;

REVOKE ALL ON FUNCTION public.generate_case_number() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.generate_case_number() FROM anon, authenticated;

REVOKE ALL ON FUNCTION public.set_case_number() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_case_number() FROM anon, authenticated;

REVOKE ALL ON FUNCTION public.log_status_change() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_status_change() FROM anon, authenticated;

REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;

-- =========================================================
-- 9) One-time admin bootstrap function
-- =========================================================
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count int;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  IF admin_count > 0 THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_first_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_bootstrap_available()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin');
$$;

REVOKE ALL ON FUNCTION public.admin_bootstrap_available() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_bootstrap_available() TO anon, authenticated;
