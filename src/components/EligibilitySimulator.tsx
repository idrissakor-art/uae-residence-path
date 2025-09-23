import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calculator, CheckCircle, XCircle, AlertCircle, Crown, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  propertyValue: string;
  isMortgaged: string;
  amountPaid: string;
  hasNOC: boolean;
  propertyInName: string;
  presentInUAE: string;
  hasValidPassport: boolean;
  hasHealthInsurance: boolean;
  sponsorFamily: boolean;
}

interface SimulationResult {
  eligible: boolean;
  visaType: '2-year' | '10-year' | null;
  reasons: string[];
  requirements: string[];
  totalCost: number;
}

const EligibilitySimulator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    propertyValue: '',
    isMortgaged: '',
    amountPaid: '',
    hasNOC: false,
    propertyInName: '',
    presentInUAE: '',
    hasValidPassport: false,
    hasHealthInsurance: false,
    sponsorFamily: false,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateEligibility = (): SimulationResult => {
    const propertyValue = parseInt(formData.propertyValue.replace(/[^\d]/g, ''));
    const amountPaid = formData.isMortgaged === 'yes' ? parseInt(formData.amountPaid.replace(/[^\d]/g, '')) : propertyValue;
    
    const reasons: string[] = [];
    const requirements: string[] = [];
    let eligible = true;
    let visaType: '2-year' | '10-year' | null = null;

    // Check property value thresholds
    if (propertyValue >= 2000000) {
      visaType = '10-year';
      requirements.push('Golden Visa 10 ans éligible');
    } else if (propertyValue >= 750000) {
      visaType = '2-year';
      requirements.push('Résidence Investisseur 2 ans éligible');
    } else {
      eligible = false;
      reasons.push(`Valeur propriété insuffisante (${propertyValue.toLocaleString()} AED). Minimum 750,000 AED requis.`);
    }

    // Check mortgage conditions
    if (formData.isMortgaged === 'yes') {
      const paidPercentage = (amountPaid / propertyValue) * 100;
      if (paidPercentage < 50) {
        eligible = false;
        reasons.push(`Seulement ${paidPercentage.toFixed(1)}% payé. Minimum 50% requis pour propriété hypothéquée.`);
      }
      if (!formData.hasNOC) {
        eligible = false;
        reasons.push('Lettre de non-objection (NOC) de la banque requise.');
      }
    }

    // Check other requirements
    if (formData.propertyInName === 'no') {
      eligible = false;
      reasons.push('La propriété doit être au nom du demandeur ou partagée (époux/épouse).');
    }

    if (formData.presentInUAE === 'no') {
      eligible = false;
      reasons.push('Présence physique aux EAU requise lors de la demande.');
    }

    if (!formData.hasValidPassport) {
      eligible = false;
      reasons.push('Passeport valide requis.');
    }

    if (!formData.hasHealthInsurance) {
      eligible = false;
      reasons.push('Assurance santé valide requise.');
    }

    // Additional requirements for eligible cases
    if (eligible) {
      requirements.push('Certificat de bonne conduite du pays d\'origine');
      requirements.push('Photos conformes aux standards');
      requirements.push('Formulaire de demande complété');
      if (formData.sponsorFamily) {
        requirements.push('Documents famille pour sponsoring (acte de mariage, actes de naissance)');
      }
    }

    return {
      eligible,
      visaType,
      reasons,
      requirements,
      totalCost: 3500 + (eligible && visaType === '10-year' ? 2000 : 1000) // Frais officiels estimés
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const simulationResult = calculateEligibility();
    setResult(simulationResult);
    setIsLoading(false);

    if (simulationResult.eligible) {
      toast({
        title: "🎉 Félicitations !",
        description: `Vous êtes éligible à la ${simulationResult.visaType === '10-year' ? 'Golden Visa 10 ans' : 'résidence 2 ans'} !`,
      });
    } else {
      toast({
        title: "❌ Non éligible",
        description: "Consultez les conditions à remplir ci-dessous.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="simulator" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Calculator className="w-4 h-4 mr-2" />
              Simulateur Officiel
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simulez votre éligibilité en 2 minutes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Répondez aux questions ci-dessous pour découvrir si vous pouvez obtenir 
              votre résidence par investissement immobilier aux EAU.
            </p>
          </div>

          <Card className="shadow-luxury">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>Simulateur d'éligibilité</span>
              </CardTitle>
              <CardDescription>
                Toutes les informations sont traitées de manière confidentielle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Property Value */}
                <div className="space-y-3">
                  <Label htmlFor="propertyValue" className="text-sm font-medium">
                    Valeur de votre bien immobilier (AED) *
                  </Label>
                  <Input
                    id="propertyValue"
                    placeholder="ex: 1,500,000 AED"
                    value={formData.propertyValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyValue: e.target.value }))}
                    required
                  />
                </div>

                {/* Mortgage Status */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Votre propriété est-elle hypothéquée ? *</Label>
                  <RadioGroup
                    value={formData.isMortgaged}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, isMortgaged: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="not-mortgaged" />
                      <Label htmlFor="not-mortgaged">Non, propriété entièrement payée</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="mortgaged" />
                      <Label htmlFor="mortgaged">Oui, propriété hypothéquée</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Amount Paid (if mortgaged) */}
                {formData.isMortgaged === 'yes' && (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="amountPaid" className="text-sm font-medium">
                        Montant déjà payé (AED) *
                      </Label>
                      <Input
                        id="amountPaid"
                        placeholder="Minimum 50% de la valeur totale"
                        value={formData.amountPaid}
                        onChange={(e) => setFormData(prev => ({ ...prev, amountPaid: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasNOC"
                        checked={formData.hasNOC}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasNOC: !!checked }))}
                      />
                      <Label htmlFor="hasNOC" className="text-sm">
                        J'ai la lettre de non-objection (NOC) de ma banque
                      </Label>
                    </div>
                  </>
                )}

                {/* Property Ownership */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Le titre de propriété est-il à votre nom ? *</Label>
                  <RadioGroup
                    value={formData.propertyInName}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, propertyInName: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="in-my-name" />
                      <Label htmlFor="in-my-name">Oui, à mon nom</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="shared" id="shared-name" />
                      <Label htmlFor="shared-name">Partagé avec époux/épouse</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="not-in-name" />
                      <Label htmlFor="not-in-name">Non</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* UAE Presence */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Êtes-vous actuellement présent(e) aux EAU ? *</Label>
                  <RadioGroup
                    value={formData.presentInUAE}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, presentInUAE: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="present-yes" />
                      <Label htmlFor="present-yes">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="present-no" />
                      <Label htmlFor="present-no">Non</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Documents requis</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasValidPassport"
                      checked={formData.hasValidPassport}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasValidPassport: !!checked }))}
                    />
                    <Label htmlFor="hasValidPassport" className="text-sm">
                      Passeport valide (minimum 6 mois)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasHealthInsurance"
                      checked={formData.hasHealthInsurance}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasHealthInsurance: !!checked }))}
                    />
                    <Label htmlFor="hasHealthInsurance" className="text-sm">
                      Assurance santé valide aux EAU
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sponsorFamily"
                      checked={formData.sponsorFamily}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sponsorFamily: !!checked }))}
                    />
                    <Label htmlFor="sponsorFamily" className="text-sm">
                      Je souhaite sponsoriser ma famille (épouse/enfants)
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="premium" 
                  size="xl" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Calcul en cours..." : "Calculer mon éligibilité"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card className={`mt-8 ${result.eligible ? 'border-success' : 'border-destructive'} shadow-luxury`}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {result.eligible ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-success" />
                      <span className="text-success">Éligible !</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-destructive" />
                      <span className="text-destructive">Non éligible</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {result.eligible ? (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 p-4 bg-success/10 rounded-lg">
                      {result.visaType === '10-year' ? (
                        <Crown className="w-8 h-8 text-success" />
                      ) : (
                        <Clock className="w-8 h-8 text-success" />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">
                          {result.visaType === '10-year' ? 'Golden Visa 10 ans' : 'Résidence Investisseur 2 ans'}
                        </h3>
                        <p className="text-muted-foreground">
                          {result.visaType === '10-year' 
                            ? 'Résidence longue durée avec avantages étendus' 
                            : 'Résidence renouvelable avec droits de propriétaire'
                          }
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Documents requis :</h4>
                      <ul className="space-y-2">
                        {result.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-success" />
                            <span className="text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-card rounded-lg border">
                      <h4 className="font-medium mb-2">Coût total estimé :</h4>
                      <div className="text-2xl font-bold text-primary">
                        AED {result.totalCost.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Incluant frais de service (AED 3,500) + frais officiels estimés
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="premium" size="lg" className="flex-1">
                        Lancer ma demande
                      </Button>
                      <Button variant="outline" size="lg" className="flex-1">
                        Télécharger le rapport
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        <span>Conditions non remplies :</span>
                      </h4>
                      <ul className="space-y-2">
                        {result.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <XCircle className="w-4 h-4 text-destructive mt-0.5" />
                            <span className="text-sm">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Que faire ?</h4>
                      <p className="text-sm text-muted-foreground">
                        Contactez nos conseillers pour explorer vos options et obtenir 
                        des recommandations personnalisées pour devenir éligible.
                      </p>
                    </div>

                    <Button variant="outline" size="lg" className="w-full">
                      Consulter un conseiller
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default EligibilitySimulator;