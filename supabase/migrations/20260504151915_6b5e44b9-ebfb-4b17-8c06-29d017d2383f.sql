
-- Storage: remove permissive case-documents policies (keep admin-only + open INSERT)
DROP POLICY IF EXISTS "Authenticated can read case-documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update case-documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete case-documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view case documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update case documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete case documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload case documents" ON storage.objects;

-- admin_users: drop any legacy permissive policy
DROP POLICY IF EXISTS "Admin users can manage all data" ON public.admin_users;

-- user_roles: explicit admin-only write policies (closes self-promote gap)
CREATE POLICY "Admins can insert user_roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update user_roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete user_roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
