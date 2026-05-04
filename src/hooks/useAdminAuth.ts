import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Guards admin routes using Supabase Auth session + server-side role check.
 * Redirects to /admin/login if the user is not authenticated or not an admin.
 */
export function useAdminAuth() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [admin, setAdmin] = useState<{ id: string; email: string | null } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const verify = async (userId: string) => {
      const { data: isAdmin, error } = await (supabase.rpc as any)("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (!isMounted) return;
      if (error || !isAdmin) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }
      setChecking(false);
    };

    // 1. Set up listener BEFORE getSession (per Supabase guidance)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (!session?.user) {
        setAdmin(null);
        navigate("/admin/login");
        return;
      }
      setAdmin({ id: session.user.id, email: session.user.email ?? null });
      // Defer the role check so we don't block the auth callback
      setTimeout(() => verify(session.user.id), 0);
    });

    // 2. Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (!session?.user) {
        navigate("/admin/login");
        return;
      }
      setAdmin({ id: session.user.id, email: session.user.email ?? null });
      verify(session.user.id);
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [navigate]);

  return { admin, checking };
}