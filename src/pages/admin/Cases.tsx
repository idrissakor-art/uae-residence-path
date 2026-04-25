import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Eye, Plus } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useToast } from "@/hooks/use-toast";

interface VisaCase {
  id: string;
  case_number: string;
  client_name: string;
  client_email: string;
  visa_type: string;
  status: string;
  priority: string;
  created_at: string;
  submission_date: string;
  estimated_cost: number;
}

const AdminCases = () => {
  const [cases, setCases] = useState<VisaCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<VisaCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visaTypeFilter, setVisaTypeFilter] = useState("all");
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

    const fetchCases = async () => {
      if (!checkAdminAuth()) return;

      try {
        const { data, error } = await supabase
          .from('visa_cases')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCases(data || []);
        setFilteredCases(data || []);
      } catch (error) {
        console.error('Error fetching cases:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les dossiers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [navigate, toast]);

  useEffect(() => {
    let filtered = cases;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.case_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Filter by visa type
    if (visaTypeFilter !== "all") {
      filtered = filtered.filter(c => c.visa_type === visaTypeFilter);
    }

    setFilteredCases(filtered);
  }, [cases, searchTerm, statusFilter, visaTypeFilter]);

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

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      haute: { label: "Haute", variant: "destructive" as const },
      normale: { label: "Normale", variant: "secondary" as const },
      basse: { label: "Basse", variant: "outline" as const }
    };
    
    const priorityInfo = priorityMap[priority as keyof typeof priorityMap] || priorityMap.normale;
    return <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-muted rounded"></div>
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gestion des Dossiers</h1>
            <Button onClick={() => navigate('/admin/cases/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Dossier
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres et Recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, email ou numéro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="nouveau">Nouveau</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="valide">Validé</SelectItem>
                    <SelectItem value="refuse">Refusé</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={visaTypeFilter} onValueChange={setVisaTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de visa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="golden_visa">Golden Visa</SelectItem>
                    <SelectItem value="family_reunion">Regroupement Familial</SelectItem>
                  </SelectContent>
                </Select>

                <div className="text-sm text-muted-foreground flex items-center">
                  {filteredCases.length} dossier(s) trouvé(s)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cases List */}
          <div className="space-y-4">
            {filteredCases.map((caseItem) => (
              <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold">{caseItem.client_name}</h3>
                        {getStatusBadge(caseItem.status)}
                        {getPriorityBadge(caseItem.priority)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Numéro:</span> {caseItem.case_number}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {caseItem.visa_type}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {caseItem.client_email}
                        </div>
                        <div>
                          <span className="font-medium">Créé:</span> {new Date(caseItem.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/cases/${caseItem.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCases.length === 0 && !loading && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || visaTypeFilter !== "all" 
                    ? "Aucun dossier ne correspond aux critères de recherche"
                    : "Aucun dossier trouvé"}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminCases;