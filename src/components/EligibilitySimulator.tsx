import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const navigate = useNavigate();
  const { t } = useTranslation();
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

    if (propertyValue >= 2000000) {
      visaType = '10-year';
      requirements.push(t('simulator.result.requirements.goldenVisa'));
    } else if (propertyValue >= 750000) {
      visaType = '2-year';
      requirements.push(t('simulator.result.requirements.residence'));
    } else {
      eligible = false;
      reasons.push(t('simulator.result.reasons.insufficientValue', { value: propertyValue.toLocaleString(), min: '750,000' }));
    }

    if (formData.isMortgaged === 'yes') {
      const paidPercentage = (amountPaid / propertyValue) * 100;
      if (paidPercentage < 50) {
        eligible = false;
        reasons.push(t('simulator.result.reasons.insufficientPaid', { percent: paidPercentage.toFixed(1) }));
      }
      if (!formData.hasNOC) {
        eligible = false;
        reasons.push(t('simulator.result.reasons.nocRequired'));
      }
    }

    if (formData.propertyInName === 'no') {
      eligible = false;
      reasons.push(t('simulator.result.reasons.propertyNotInName'));
    }

    if (formData.presentInUAE === 'no') {
      eligible = false;
      reasons.push(t('simulator.result.reasons.presenceRequired'));
    }

    if (!formData.hasValidPassport) {
      eligible = false;
      reasons.push(t('simulator.result.reasons.passportRequired'));
    }

    if (!formData.hasHealthInsurance) {
      eligible = false;
      reasons.push(t('simulator.result.reasons.insuranceRequired'));
    }

    if (eligible) {
      requirements.push(t('simulator.result.requirements.goodConduct'));
      requirements.push(t('simulator.result.requirements.photos'));
      requirements.push(t('simulator.result.requirements.application'));
      if (formData.sponsorFamily) {
        requirements.push(t('simulator.result.requirements.familyDocs'));
      }
    }

    return {
      eligible,
      visaType,
      reasons,
      requirements,
      totalCost: 3500 + (eligible && visaType === '10-year' ? 2000 : 1000)
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const simulationResult = calculateEligibility();
    setResult(simulationResult);
    setIsLoading(false);

    if (simulationResult.eligible) {
      toast({
        title: t('simulator.result.congratulations'),
        description: t('simulator.result.eligibleFor', { 
          visaType: simulationResult.visaType === '10-year' ? t('simulator.result.goldenVisa10') : t('simulator.result.residence2')
        }),
      });
    } else {
      toast({
        title: t('simulator.result.notEligibleMsg'),
        description: t('simulator.result.seeConditions'),
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
              {t('simulator.badge')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('simulator.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('simulator.description')}
            </p>
          </div>

          <Card className="shadow-luxury">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>{t('simulator.form.title')}</span>
              </CardTitle>
              <CardDescription>
                {t('simulator.form.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Step 1 */}
                <div className="space-y-6 p-6 bg-muted/30 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                    <h3 className="text-lg font-semibold">{t('simulator.form.step1.title')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="propertyValue" className="text-sm font-medium">
                        {t('simulator.form.step1.propertyValue.label')} *
                      </Label>
                      <Input
                        id="propertyValue"
                        placeholder={t('simulator.form.step1.propertyValue.placeholder')}
                        value={formData.propertyValue}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/[^\d]/g, '');
                          setFormData(prev => ({ ...prev, propertyValue: numericValue }));
                        }}
                        required
                        className="text-lg"
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('simulator.form.step1.propertyValue.hint')}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">{t('simulator.form.step1.isMortgaged.label')} *</Label>
                      <RadioGroup
                        value={formData.isMortgaged}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, isMortgaged: value }))}
                        className="grid grid-cols-1 gap-3"
                      >
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/20 cursor-pointer">
                          <RadioGroupItem value="no" id="not-mortgaged" />
                          <Label htmlFor="not-mortgaged" className="cursor-pointer flex-1">
                            <div className="font-medium">{t('simulator.form.step1.isMortgaged.no.title')}</div>
                            <div className="text-sm text-muted-foreground">{t('simulator.form.step1.isMortgaged.no.description')}</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/20 cursor-pointer">
                          <RadioGroupItem value="yes" id="mortgaged" />
                          <Label htmlFor="mortgaged" className="cursor-pointer flex-1">
                            <div className="font-medium">{t('simulator.form.step1.isMortgaged.yes.title')}</div>
                            <div className="text-sm text-muted-foreground">{t('simulator.form.step1.isMortgaged.yes.description')}</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Mortgage Details */}
                {formData.isMortgaged === 'yes' && (
                  <div className="space-y-6 p-6 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <h4 className="font-medium text-amber-800 dark:text-amber-200">{t('simulator.mortgageDetails')}</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label htmlFor="amountPaid" className="text-sm font-medium">
                          {t('simulator.form.step1.amountPaid.label')} *
                        </Label>
                        <Input
                          id="amountPaid"
                          placeholder={t('simulator.form.step1.amountPaid.placeholder')}
                          value={formData.amountPaid}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^\d]/g, '');
                            setFormData(prev => ({ ...prev, amountPaid: numericValue }));
                          }}
                          required
                          className="text-lg"
                        />
                        {formData.propertyValue && formData.amountPaid && (
                          <p className="text-sm text-muted-foreground">
                            {t('simulator.form.step1.amountPaid.percentage', {
                              percent: ((parseInt(formData.amountPaid.replace(/[^\d]/g, '')) / parseInt(formData.propertyValue.replace(/[^\d]/g, ''))) * 100).toFixed(1)
                            })}
                          </p>
                        )}
                      </div>

                      <div className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id="hasNOC"
                          checked={formData.hasNOC}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasNOC: !!checked }))}
                          className="mt-0.5"
                        />
                        <Label htmlFor="hasNOC" className="text-sm cursor-pointer">
                          <div className="font-medium">{t('simulator.form.step1.hasNOC.title')}</div>
                          <div className="text-xs text-muted-foreground">{t('simulator.form.step1.hasNOC.description')}</div>
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                <div className="space-y-6 p-6 bg-muted/30 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                    <h3 className="text-lg font-semibold">{t('simulator.form.step2.title')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">{t('simulator.form.step2.propertyInName.label')} *</Label>
                      <RadioGroup
                        value={formData.propertyInName}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, propertyInName: value }))}
                        className="grid grid-cols-1 gap-3"
                      >
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/20 cursor-pointer">
                          <RadioGroupItem value="yes" id="in-my-name" />
                          <Label htmlFor="in-my-name" className="cursor-pointer flex-1">
                            <div className="font-medium">{t('simulator.form.step2.propertyInName.yes.title')}</div>
                            <div className="text-sm text-muted-foreground">{t('simulator.form.step2.propertyInName.yes.description')}</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/20 cursor-pointer">
                          <RadioGroupItem value="shared" id="shared-name" />
                          <Label htmlFor="shared-name" className="cursor-pointer flex-1">
                            <div className="font-medium">{t('simulator.form.step2.propertyInName.shared.title')}</div>
                            <div className="text-sm text-muted-foreground">{t('simulator.form.step2.propertyInName.shared.description')}</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/20 cursor-pointer">
                          <RadioGroupItem value="no" id="not-in-name" />
                          <Label htmlFor="not-in-name" className="cursor-pointer flex-1">
                            <div className="font-medium">{t('simulator.form.step2.propertyInName.no.title')}</div>
                            <div className="text-sm text-destructive">{t('simulator.form.step2.propertyInName.no.description')}</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">{t('simulator.form.step2.presentInUAE.label')} *</Label>
                      <RadioGroup
                        value={formData.presentInUAE}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, presentInUAE: value }))}
                        className="grid grid-cols-1 gap-3"
                      >
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/20 cursor-pointer">
                          <RadioGroupItem value="yes" id="present-yes" />
                          <Label htmlFor="present-yes" className="cursor-pointer flex-1">
                            <div className="font-medium">{t('simulator.form.step2.presentInUAE.yes.title')}</div>
                            <div className="text-sm text-muted-foreground">{t('simulator.form.step2.presentInUAE.yes.description')}</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/20 cursor-pointer">
                          <RadioGroupItem value="no" id="present-no" />
                          <Label htmlFor="present-no" className="cursor-pointer flex-1">
                            <div className="font-medium">{t('simulator.form.step2.presentInUAE.no.title')}</div>
                            <div className="text-sm text-destructive">{t('simulator.form.step2.presentInUAE.no.description')}</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-6 p-6 bg-muted/30 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                    <h3 className="text-lg font-semibold">{t('simulator.form.step3.title')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">{t('simulator.form.step3.documentsLabel')} *</Label>
                    
                    <div className="grid gap-3">
                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/20">
                        <Checkbox
                          id="hasValidPassport"
                          checked={formData.hasValidPassport}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasValidPassport: !!checked }))}
                          className="mt-0.5"
                        />
                        <Label htmlFor="hasValidPassport" className="cursor-pointer flex-1">
                          <div className="font-medium">{t('simulator.form.step3.hasValidPassport.title')}</div>
                          <div className="text-sm text-muted-foreground">{t('simulator.form.step3.hasValidPassport.description')}</div>
                        </Label>
                        <Badge variant={formData.hasValidPassport ? "default" : "outline"}>
                          {formData.hasValidPassport ? "✓" : t('simulator.form.required')}
                        </Badge>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/20">
                        <Checkbox
                          id="hasHealthInsurance"
                          checked={formData.hasHealthInsurance}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasHealthInsurance: !!checked }))}
                          className="mt-0.5"
                        />
                        <Label htmlFor="hasHealthInsurance" className="cursor-pointer flex-1">
                          <div className="font-medium">{t('simulator.form.step3.hasHealthInsurance.title')}</div>
                          <div className="text-sm text-muted-foreground">{t('simulator.form.step3.hasHealthInsurance.description')}</div>
                        </Label>
                        <Badge variant={formData.hasHealthInsurance ? "default" : "outline"}>
                          {formData.hasHealthInsurance ? "✓" : t('simulator.form.required')}
                        </Badge>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/20">
                        <Checkbox
                          id="sponsorFamily"
                          checked={formData.sponsorFamily}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sponsorFamily: !!checked }))}
                          className="mt-0.5"
                        />
                        <Label htmlFor="sponsorFamily" className="cursor-pointer flex-1">
                          <div className="font-medium">{t('simulator.form.step3.sponsorFamily.title')}</div>
                          <div className="text-sm text-muted-foreground">{t('simulator.form.step3.sponsorFamily.description')}</div>
                        </Label>
                        <Badge variant="outline">{t('simulator.form.optional')}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="premium" 
                  size="xl" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? t('simulator.form.loading') : t('simulator.form.submit')}
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
                      <span className="text-success">{t('simulator.result.eligible')}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-destructive" />
                      <span className="text-destructive">{t('simulator.result.notEligible')}</span>
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
                          {result.visaType === '10-year' ? t('simulator.result.goldenVisa10') : t('simulator.result.residence2')}
                        </h3>
                        <p className="text-muted-foreground">
                          {result.visaType === '10-year' ? t('simulator.result.goldenVisaDesc') : t('simulator.result.residenceDesc')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">{t('simulator.result.documentsRequired')}</h4>
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
                      <h4 className="font-medium mb-2">{t('simulator.result.totalCost')}</h4>
                      <div className="text-2xl font-bold text-primary">
                        AED {result.totalCost.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('simulator.result.totalCostDesc')}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="premium" 
                        size="lg" 
                        className="flex-1"
                        onClick={() => navigate('/application')}
                      >
                        {t('simulator.result.startApplication')}
                      </Button>
                      <Button variant="outline" size="lg" className="flex-1">
                        {t('simulator.result.downloadReport')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        <span>{t('simulator.result.conditionsNotMet')}</span>
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
                      <h4 className="font-medium mb-2">{t('simulator.result.whatToDo')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('simulator.result.contactAdvice')}
                      </p>
                    </div>

                    <Button variant="outline" size="lg" className="w-full">
                      {t('simulator.result.consultAdvisor')}
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
