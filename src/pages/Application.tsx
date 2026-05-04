import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Check, CreditCard, Shield, Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Application = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: File}>({});
  const [caseId, setCaseId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stateCaseId = (location.state as { caseId?: string } | null)?.caseId;
    if (stateCaseId) {
      setCaseId(stateCaseId);
    } else {
      // No case context — redirect back to simulator so a case gets created first
      toast({
        title: "Veuillez d'abord vérifier votre éligibilité",
        description: "Le simulateur va créer votre dossier en quelques minutes.",
      });
      navigate('/#simulator');
    }
  }, [location.state, navigate, toast]);

  const requiredDocuments = [
    { id: 'passport', name: t('application.documents.passport.name'), description: t('application.documents.passport.description') },
    { id: 'emirates_id', name: t('application.documents.emiratesId.name'), description: t('application.documents.emiratesId.description') },
    { id: 'property_deed', name: t('application.documents.propertyDeed.name'), description: t('application.documents.propertyDeed.description') },
  ];

  const handleFileUpload = async (documentId: string, file: File) => {
    if (!caseId) {
      toast({
        title: "Dossier introuvable",
        description: "Veuillez recommencer la simulation d'éligibilité.",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${caseId}/${documentId}-${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('case-documents')
        .upload(path, file, { upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from('case_documents').insert({
        case_id: caseId,
        document_type: documentId,
        document_name: file.name,
        file_path: path,
        file_size: file.size,
        mime_type: file.type || null,
        is_required: true,
      });
      if (insertError) throw insertError;

      setUploadedDocuments(prev => ({ ...prev, [documentId]: file }));
      toast({
        title: t('application.uploaded'),
        description: file.name,
      });
    } catch (err) {
      console.error('Upload error:', err);
      toast({
        title: "Échec de l'upload",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!caseId) return;
    setIsSubmitting(true);
    try {
      // Record a pending payment (Stripe to be wired later)
      const { error: payErr } = await supabase.from('payments').insert({
        case_id: caseId,
        amount: 13500,
        currency: 'AED',
        status: 'pending',
        payment_method: 'stripe_pending',
      });
      if (payErr) throw payErr;

      // Mark the case as a complete submitted file
      const { error: caseErr } = await supabase
        .from('visa_cases')
        .update({ status: 'dossier_complet' })
        .eq('id', caseId);
      if (caseErr) throw caseErr;

      // Internal notification row (admin will see this in /admin)
      await supabase.from('email_notifications').insert({
        case_id: caseId,
        recipient_email: 'team@uae-visaservices.com',
        subject: 'Nouveau dossier complet à traiter',
        template_name: 'new_case_internal',
        status: 'pending',
      });

      setCurrentStep(4);
      toast({
        title: t('application.confirmation.title'),
        description: t('application.confirmation.description'),
      });
    } catch (err) {
      console.error('Submission error:', err);
      toast({
        title: "Erreur lors de la soumission",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgress = () => {
    switch(currentStep) {
      case 1: return 25;
      case 2: return 50;
      case 3: return 75;
      case 4: return 100;
      default: return 0;
    }
  };

  const renderDocumentUpload = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('application.title')}</h2>
        <p className="text-muted-foreground">{t('application.description')}</p>
      </div>

      <div className="grid gap-4">
        {requiredDocuments.map((doc) => (
          <Card key={doc.id} className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  {uploadedDocuments[doc.id] ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-medium">{t('application.uploaded')}</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUploading || !caseId}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.pdf,.jpg,.jpeg,.png';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            handleFileUpload(doc.id, file);
                          }
                        };
                        input.click();
                      }}
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      {t('application.upload')}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => navigate('/')}>
          {t('application.back')}
        </Button>
        <Button 
          onClick={() => setCurrentStep(2)}
          disabled={Object.keys(uploadedDocuments).length < 3}
        >
          {t('application.continue')}
        </Button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('application.review.title')}</h2>
        <p className="text-muted-foreground">{t('application.review.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t('application.review.documentsUploaded')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(uploadedDocuments).map(([docId, file]) => {
              const docInfo = requiredDocuments.find(d => d.id === docId);
              return (
                <div key={docId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{docInfo?.name}</p>
                    <p className="text-sm text-muted-foreground">{file.name}</p>
                  </div>
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          {t('application.back')}
        </Button>
        <Button onClick={() => setCurrentStep(3)}>
          {t('application.review.proceedToPayment')}
        </Button>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('application.payment.title')}</h2>
        <p className="text-muted-foreground">{t('application.payment.description')}</p>
      </div>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {t('application.payment.orderSummary')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>{t('application.payment.totalFees')}</span>
              <span className="font-bold text-lg">13,500 AED</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Shield className="w-4 h-4" />
                {t('application.payment.securePayment')}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {t('application.payment.guaranteedProcessing')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('application.payment.servicesIncluded')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              {t('application.payment.services.verification')}
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              {t('application.payment.services.submission')}
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              {t('application.payment.services.tracking')}
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              {t('application.payment.services.guarantee')}
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          {t('application.back')}
        </Button>
        <Button onClick={handleSubmitApplication} className="bg-primary" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {t('application.payment.payNow')}
        </Button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">{t('application.confirmation.title')}</h2>
      <p className="text-muted-foreground">
        {t('application.confirmation.description')}
      </p>
      <Button onClick={() => navigate('/')}>
        {t('application.confirmation.backToHome')}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Progress value={getStepProgress()} className="mb-4" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>{t('application.steps.documents')}</span>
            <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>{t('application.steps.verification')}</span>
            <span className={currentStep >= 3 ? 'text-primary font-medium' : ''}>{t('application.steps.payment')}</span>
            <span className={currentStep >= 4 ? 'text-primary font-medium' : ''}>{t('application.steps.confirmation')}</span>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {currentStep === 1 && renderDocumentUpload()}
            {currentStep === 2 && renderReview()}
            {currentStep === 3 && renderPayment()}
            {currentStep === 4 && renderConfirmation()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Application;