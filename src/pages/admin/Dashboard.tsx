import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Users, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalCases: number;
  newCases: number;
  inProgressCases: number;
  completedCases: number;
  rejectedCases: number;
  todaySubmissions: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCases: 0,
    newCases: 0,
    inProgressCases: 0,
    completedCases: 0,
    rejectedCases: 0,
    todaySubmissions: 0
  });
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminSession = localStorage.getItem('admin_session');
      if (!adminSession) {
        navigate('/admin/login');
        return false;
      }
      return true;
    };

    const fetchDashboardData = async () => {
      if (!checkAdminAuth()) return;

      try {
        // Fetch case statistics
        const { data: cases, error: casesError } = await supabase
          .from('visa_cases')
          .select('*');

        if (casesError) throw casesError;

        const today = new Date().toISOString().split('T')[0];
        const todaySubmissions = cases?.filter(c => 
          c.submission_date?.startsWith(today)
        ).length || 0;

        const newCases = cases?.filter(c => c.status === 'nouveau').length || 0;
        const inProgressCases = cases?.filter(c => c.status === 'en_cours').length || 0;
        const completedCases = cases?.filter(c => c.status === 'valide').length || 0;
        const rejectedCases = cases?.filter(c => c.status === 'refuse').length || 0;

        setStats({
          totalCases: cases?.length || 0,
          newCases,
          inProgressCases,
          completedCases,
          rejectedCases,
          todaySubmissions
        });

        // Fetch recent cases
        const { data: recent, error: recentError } = await supabase
          .from('visa_cases')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentError) throw recentError;
        setRecentCases(recent || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du dashboard",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, toast]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      nouveau: { label: "Nouveau", variant: "secondary" as const },
      en_cours: { label: "En cours", variant: "default" as const },
      valide: { label: "Validé", variant: "outline" as const },
      refuse: { label: "Refusé", variant: "destructive" as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.nouveau;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard Administration</h1>
          
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Dossiers</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCases}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveaux</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary-foreground">{stats.newCases}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En cours</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.inProgressCases}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-foreground">{stats.todaySubmissions}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Cases */}
          <Card>
            <CardHeader>
              <CardTitle>Dossiers récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCases.map((caseItem) => (
                  <div key={caseItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{caseItem.client_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {caseItem.case_number} • {caseItem.visa_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(caseItem.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(caseItem.status)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/cases/${caseItem.id}`)}
                      >
                        Voir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {recentCases.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Aucun dossier récent
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;