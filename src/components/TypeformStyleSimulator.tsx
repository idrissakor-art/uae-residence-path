import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, CheckCircle, XCircle, AlertCircle, Crown, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuestionStep, TypeformInput, TypeformRadioGroup, TypeformCheckbox } from "./simulator/QuestionStep";

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

const TypeformStyleSimulator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
  const [showResults, setShowResults] = useState(false);

  const totalSteps = 6; // Simplified step count

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
      requirements.push(t('simulator.result.requirements.goldenVisa'));
    } else if (propertyValue >= 750000) {
      visaType = '2-year';
      requirements.push(t('simulator.result.requirements.residence'));
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

  const handleNext = async () => {
    // Check if we're on the last step
    const isLastStep = (formData.isMortgaged === 'no' && currentStep === 5) || 
                       (formData.isMortgaged === 'yes' && currentStep === 6);
    
    if (isLastStep) {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const simulationResult = calculateEligibility();
      setResult(simulationResult);
      setIsLoading(false);
      setShowResults(true);

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
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return formData.propertyValue.length > 0;
      case 2:
        return formData.isMortgaged.length > 0;
      case 3:
        return formData.isMortgaged === 'no' || (formData.amountPaid.length > 0 && formData.hasNOC);
      case 4:
        return formData.propertyInName.length > 0;
      case 5:
        return formData.presentInUAE.length > 0;
      case 6:
        return formData.hasValidPassport && formData.hasHealthInsurance;
      default:
        return false;
    }
  };

  const getDisplayStep = () => {
    if (formData.isMortgaged === 'no' && currentStep > 2) {
      return currentStep - 1;
    }
    return currentStep;
  };

  const getTotalDisplaySteps = () => {
    return formData.isMortgaged === 'no' ? 5 : 6;
  };

  if (showResults && result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <Card className={`${result.eligible ? 'border-success' : 'border-destructive'} shadow-luxury animate-fade-in`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 justify-center">
                {result.eligible ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-success" />
                    <span className="text-success text-2xl">{t('simulator.result.eligible')}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-destructive" />
                    <span className="text-destructive text-2xl">{t('simulator.result.notEligible')}</span>
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
                        {result.visaType === '10-year' 
                          ? t('simulator.result.goldenVisaDesc')
                          : t('simulator.result.residenceDesc')
                        }
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
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header section - More compact */}
      <section className="py-4 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            <Calculator className="w-4 h-4 mr-2" />
            {t('simulator.badge')}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {t('simulator.title')}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            {t('simulator.description')}
          </p>
        </div>
      </section>

      {/* Questions */}
      {currentStep === 1 && (
        <QuestionStep
          step={getDisplayStep()}
          totalSteps={getTotalDisplaySteps()}
          title={t('simulator.form.step1.propertyValue.label')}
          subtitle={t('simulator.form.step1.propertyValue.hint')}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={canGoNext()}
          canGoPrevious={false}
        >
          <TypeformInput
            placeholder={t('simulator.form.step1.propertyValue.placeholder')}
            value={formData.propertyValue}
            onChange={(value) => setFormData(prev => ({ ...prev, propertyValue: value }))}
          />
        </QuestionStep>
      )}

      {currentStep === 2 && (
        <QuestionStep
          step={getDisplayStep()}
          totalSteps={getTotalDisplaySteps()}
          title={t('simulator.form.step1.isMortgaged.label')}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={canGoNext()}
          canGoPrevious={true}
        >
          <TypeformRadioGroup
            value={formData.isMortgaged}
            onValueChange={(value) => setFormData(prev => ({ ...prev, isMortgaged: value }))}
            onNext={handleNext} // Ajout de la navigation automatique
            options={[
              {
                value: 'no',
                label: t('simulator.form.step1.isMortgaged.no.title'),
                description: t('simulator.form.step1.isMortgaged.no.description')
              },
              {
                value: 'yes',
                label: t('simulator.form.step1.isMortgaged.yes.title'),
                description: t('simulator.form.step1.isMortgaged.yes.description')
              }
            ]}
          />
        </QuestionStep>
      )}

      {currentStep === 3 && formData.isMortgaged === 'yes' && (
        <QuestionStep
          step={getDisplayStep()}
          totalSteps={getTotalDisplaySteps()}
          title={t('simulator.form.step1.amountPaid.label')}
          subtitle={formData.propertyValue && formData.amountPaid ? 
            t('simulator.form.step1.amountPaid.percentage', { 
              percent: ((parseInt(formData.amountPaid.replace(/[^\d]/g, '')) / parseInt(formData.propertyValue.replace(/[^\d]/g, ''))) * 100).toFixed(1) 
            }) : ''
          }
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={canGoNext()}
          canGoPrevious={true}
        >
          <div className="space-y-4">
            <TypeformInput
              placeholder={t('simulator.form.step1.amountPaid.placeholder')}
              value={formData.amountPaid}
              onChange={(value) => setFormData(prev => ({ ...prev, amountPaid: value }))}
            />
            
            <TypeformCheckbox
              checked={formData.hasNOC}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasNOC: checked }))}
              label={t('simulator.form.step1.hasNOC.title')}
              description={t('simulator.form.step1.hasNOC.description')}
            />
          </div>
        </QuestionStep>
      )}

      {((currentStep === 3 && formData.isMortgaged === 'no') || (currentStep === 4 && formData.isMortgaged === 'yes')) && (
        <QuestionStep
          step={getDisplayStep()}
          totalSteps={getTotalDisplaySteps()}
          title={t('simulator.form.step2.propertyInName.label')}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={canGoNext()}
          canGoPrevious={true}
        >
          <TypeformRadioGroup
            value={formData.propertyInName}
            onValueChange={(value) => setFormData(prev => ({ ...prev, propertyInName: value }))}
            onNext={handleNext} // Ajout de la navigation automatique
            options={[
              {
                value: 'yes',
                label: t('simulator.form.step2.propertyInName.yes.title'),
                description: t('simulator.form.step2.propertyInName.yes.description')
              },
              {
                value: 'shared',
                label: t('simulator.form.step2.propertyInName.shared.title'),
                description: t('simulator.form.step2.propertyInName.shared.description')
              },
              {
                value: 'no',
                label: t('simulator.form.step2.propertyInName.no.title'),
                description: t('simulator.form.step2.propertyInName.no.description')
              }
            ]}
          />
        </QuestionStep>
      )}

      {((currentStep === 4 && formData.isMortgaged === 'no') || (currentStep === 5 && formData.isMortgaged === 'yes')) && (
        <QuestionStep
          step={getDisplayStep()}
          totalSteps={getTotalDisplaySteps()}
          title={t('simulator.form.step2.presentInUAE.label')}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={canGoNext()}
          canGoPrevious={true}
        >
          <TypeformRadioGroup
            value={formData.presentInUAE}
            onValueChange={(value) => setFormData(prev => ({ ...prev, presentInUAE: value }))}
            onNext={handleNext} // Ajout de la navigation automatique
            options={[
              {
                value: 'yes',
                label: t('simulator.form.step2.presentInUAE.yes.title'),
                description: t('simulator.form.step2.presentInUAE.yes.description')
              },
              {
                value: 'no',
                label: t('simulator.form.step2.presentInUAE.no.title'),
                description: t('simulator.form.step2.presentInUAE.no.description')
              }
            ]}
          />
        </QuestionStep>
      )}

      {((currentStep === 5 && formData.isMortgaged === 'no') || (currentStep === 6 && formData.isMortgaged === 'yes')) && (
        <QuestionStep
          step={getDisplayStep()}
          totalSteps={getTotalDisplaySteps()}
          title={t('simulator.form.step3.documentsLabel')}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={canGoNext()}
          canGoPrevious={true}
        >
          <div className="space-y-4">
            <TypeformCheckbox
              checked={formData.hasValidPassport}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasValidPassport: checked }))}
              label={t('simulator.form.step3.hasValidPassport.title')}
              description={t('simulator.form.step3.hasValidPassport.description')}
            />
            
            <TypeformCheckbox
              checked={formData.hasHealthInsurance}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasHealthInsurance: checked }))}
              label={t('simulator.form.step3.hasHealthInsurance.title')}
              description={t('simulator.form.step3.hasHealthInsurance.description')}
            />
          </div>
        </QuestionStep>
      )}

      {/* Final step - Family sponsoring (optional) */}
      {((currentStep === 5 && formData.isMortgaged === 'no') || (currentStep === 6 && formData.isMortgaged === 'yes')) && (
        <QuestionStep
          step={getDisplayStep()}
          totalSteps={getTotalDisplaySteps()}
          title="Family Sponsoring"
          subtitle="Do you want to sponsor family members? (Optional)"
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={true}
          canGoPrevious={true}
          isLoading={isLoading}
        >
          <TypeformCheckbox
            checked={formData.sponsorFamily}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sponsorFamily: checked }))}
            label={t('simulator.form.step3.sponsorFamily.title')}
            description={t('simulator.form.step3.sponsorFamily.description')}
          />
        </QuestionStep>
      )}
    </div>
  );
};

export default TypeformStyleSimulator;