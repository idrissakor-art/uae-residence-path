
-- has_role: used by every RLS policy; only authenticated users actually evaluate it
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- bootstrap_first_admin: caller must be authenticated (function itself raises if not)
REVOKE ALL ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin() TO authenticated;

-- admin_bootstrap_available: needs to be callable by anon for the /admin/setup page gate
REVOKE ALL ON FUNCTION public.admin_bootstrap_available() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_bootstrap_available() TO anon, authenticated;

-- log_status_change: trigger-only, lock down
REVOKE ALL ON FUNCTION public.log_status_change() FROM PUBLIC, anon, authenticated;
