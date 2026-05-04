
DROP POLICY IF EXISTS "Admins can read user_roles" ON public.user_roles;

CREATE POLICY "Admins can read user_roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
