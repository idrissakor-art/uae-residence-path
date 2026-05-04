import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldCheck } from "lucide-react";

const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const check = async () => {
      const { data, error } = await (supabase.rpc as any)('admin_bootstrap_available');
      if (error) {
        console.error('Bootstrap availability check failed:', error);
        setAvailable(false);
      } else {
        setAvailable(Boolean(data));
      }
      setChecking(false);
    };
    check();
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 8 caractères.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Mots de passe différents",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      });

      if (signUpError || !signUpData.user) {
        toast({
          title: "Échec de la création du compte",
          description: "Vérifiez vos informations et réessayez.",
          variant: "destructive",
        });
        return;
      }

      // Ensure we have an authenticated session so auth.uid() is set inside the RPC.
      // (When email confirmations are disabled, signUp returns a session; otherwise we sign in.)
      if (!signUpData.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          toast({
            title: "Confirmez votre email",
            description: "Vérifiez votre boîte mail, puis revenez sur cette page pour finaliser la configuration.",
          });
          return;
        }
      }

      // Bootstrap as first admin — promotes the *currently signed-in* user only.
      // Self-locks once any admin exists.
      const { data: ok, error: bootstrapError } = await (supabase.rpc as any)(
        'bootstrap_first_admin'
      );

      if (bootstrapError || !ok) {
        toast({
          title: "Configuration impossible",
          description: "Un administrateur existe déjà. Utilisez la page de connexion.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      toast({
        title: "Compte administrateur créé",
        description: "Vous pouvez maintenant vous connecter.",
      });

      // Sign out so user goes through the normal login flow (also confirms email)
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (err) {
      console.error('Admin setup error:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!available) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Configuration verrouillée</CardTitle>
            <CardDescription>
              Un administrateur a déjà été configuré pour ce projet. La page de configuration initiale n'est plus accessible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/admin/login')}>
              Aller à la connexion
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl gradient-text">Configuration initiale</CardTitle>
          <CardDescription>
            Créez le compte du premier administrateur. Cette page se verrouillera automatiquement après la création.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe (min. 8 caractères)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Créer le compte administrateur
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;