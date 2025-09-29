import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Home, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Shield,
  DollarSign,
  Calendar,
  MapPin
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useToast } from "@/hooks/use-toast";

interface VisaCaseDetail {
  id: string;
  case_number: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  whatsapp_number: string | null;
  visa_type: string;
  status: string;
  priority: string;
  property_value: number;
  is_mortgaged: boolean;
  amount_paid: number | null;
  has_noc: boolean | null;
  property_in_name: string | null;
  present_in_uae: boolean;
  has_valid_passport: boolean;
  has_health_insurance: boolean;
  sponsor_family: boolean;
  estimated_cost: number | null;
  notes: string | null;
  internal_notes: string | null;
  created_at: string;
  submission_date: string;
  updated_at: string;
}

const AdminCaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [caseDetail, setCaseDetail] = useState<VisaCaseDetail | null>(null);
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

    const fetchCaseDetail = async () => {
      if (!checkAdminAuth() || !id) return;

      try {
        const { data, error } = await supabase
          .from('visa_cases')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            toast({
              title: "Dossier introuvable",
              description: "Ce dossier n'existe pas ou a été supprimé",
              variant: "destructive",
            });
            navigate('/admin/cases');
            return;
          }
          throw error;
        }

        setCaseDetail(data);
      } catch (error) {
        console.error('Error fetching case detail:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du dossier",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetail();
  }, [id, navigate, toast]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      nouveau: { label: "Nouveau", variant: "secondary" as const, icon: FileText },
      en_cours: { label: "En cours", variant: "default" as const, icon: FileText },
      valide: { label: "Validé", variant: "outline" as const, icon: CheckCircle },
      refuse: { label: "Refusé", variant: "destructive" as const, icon: XCircle },
      'non-eligible': { label: "Non éligible", variant: "destructive" as const, icon: XCircle }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.nouveau;
    const IconComponent = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
    }).format(amount).replace('AED', 'AED');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!caseDetail) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Dossier introuvable</h2>
            <Button onClick={() => navigate('/admin/cases')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux dossiers
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin/cases')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{caseDetail.client_name}</h1>
                <p className="text-muted-foreground">{caseDetail.case_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(caseDetail.status)}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{caseDetail.client_name}</p>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{caseDetail.client_email}</p>
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                </div>

                {caseDetail.client_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{caseDetail.client_phone}</p>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                    </div>
                  </div>
                )}

                {caseDetail.whatsapp_number && (
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{caseDetail.whatsapp_number}</p>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations du dossier */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations du dossier
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type de visa</p>
                    <p className="font-medium">{caseDetail.visa_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priorité</p>
                    <Badge variant="outline">{caseDetail.priority}</Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date de soumission</p>
                    <p className="font-medium">{formatDate(caseDetail.submission_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                    <p className="font-medium">{formatDate(caseDetail.updated_at)}</p>
                  </div>
                </div>

                {caseDetail.estimated_cost && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{formatCurrency(caseDetail.estimated_cost)}</p>
                      <p className="text-sm text-muted-foreground">Coût estimé</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations immobilières */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Propriété immobilière
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{formatCurrency(caseDetail.property_value)}</p>
                    <p className="text-sm text-muted-foreground">Valeur de la propriété</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Propriété hypothéquée</p>
                    <Badge variant={caseDetail.is_mortgaged ? "destructive" : "outline"}>
                      {caseDetail.is_mortgaged ? "Oui" : "Non"}
                    </Badge>
                  </div>
                  
                  {caseDetail.property_in_name && (
                    <div>
                      <p className="text-sm text-muted-foreground">Propriété au nom du demandeur</p>
                      <Badge variant={caseDetail.property_in_name === 'yes' ? "outline" : "secondary"}>
                        {caseDetail.property_in_name === 'yes' ? 'Oui' : 
                         caseDetail.property_in_name === 'shared' ? 'Partagée' : 'Non'}
                      </Badge>
                    </div>
                  )}
                </div>

                {caseDetail.is_mortgaged && caseDetail.amount_paid && (
                  <>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{formatCurrency(caseDetail.amount_paid)}</p>
                        <p className="text-sm text-muted-foreground">
                          Montant payé ({Math.round((caseDetail.amount_paid / caseDetail.property_value) * 100)}%)
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Lettre de non-objection (NOC)</p>
                      <Badge variant={caseDetail.has_noc ? "outline" : "destructive"}>
                        {caseDetail.has_noc ? "Disponible" : "Manquante"}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Statut et documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Statut et vérifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Présent aux EAU</p>
                    <Badge variant={caseDetail.present_in_uae ? "outline" : "destructive"}>
                      {caseDetail.present_in_uae ? "Oui" : "Non"}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Passeport valide</p>
                    <Badge variant={caseDetail.has_valid_passport ? "outline" : "destructive"}>
                      {caseDetail.has_valid_passport ? "Oui" : "Non"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Assurance santé</p>
                    <Badge variant={caseDetail.has_health_insurance ? "outline" : "destructive"}>
                      {caseDetail.has_health_insurance ? "Oui" : "Non"}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Parrainage familial</p>
                    <Badge variant={caseDetail.sponsor_family ? "secondary" : "outline"}>
                      {caseDetail.sponsor_family ? "Demandé" : "Non demandé"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {(caseDetail.notes || caseDetail.internal_notes) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes et observations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {caseDetail.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes publiques</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                      {caseDetail.notes}
                    </p>
                  </div>
                )}
                
                {caseDetail.internal_notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes internes</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                      {caseDetail.internal_notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminCaseDetail;