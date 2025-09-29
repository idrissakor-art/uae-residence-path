import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuestionStepProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLoading?: boolean;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLoading = false
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-3xl">
        {/* Progress indicator - More compact */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">
              {step} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card - More compact */}
        <Card className="p-10 bg-white shadow-xl border-0 animate-fade-in rounded-2xl">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {children}
            </div>
          </div>
        </Card>

        {/* Navigation - Improved styling */}
        <div className="flex justify-between mt-10">
          <Button
            variant="outline"
            size="lg"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex items-center gap-3 border-2 border-primary/20 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 px-10 py-4 rounded-full text-lg font-medium transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Button
            size="lg"
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full min-w-[160px] text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              "Loading..."
            ) : step === totalSteps ? (
              "Get Results"
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Specialized input components for Typeform style
export const TypeformInput: React.FC<{
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}> = ({ placeholder, value, onChange, type = "text" }) => (
  <Input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="text-2xl p-8 border-2 border-gray-200 focus:border-primary rounded-2xl bg-white shadow-sm transition-all duration-200"
  />
);

export const TypeformRadioGroup: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  onNext?: () => void; // Nouvelle prop pour déclencher la navigation automatique
  options: Array<{ value: string; label: string; description?: string }>;
}> = ({ value, onValueChange, onNext, options }) => {

  const handleOptionSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    
    // Navigation automatique après sélection avec un délai pour le feedback visuel
    if (onNext && selectedValue) {
      setTimeout(() => {
        onNext();
      }, 600); // Délai de 600ms pour voir la sélection
    }
  };

  return (
  <RadioGroup value={value} onValueChange={handleOptionSelect} className="space-y-6">
    {options.map((option) => (
      <div
        key={option.value}
        className={`flex items-start space-x-5 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
          value === option.value 
            ? 'border-primary bg-primary/5 shadow-md' 
            : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
        }`}
        onClick={() => handleOptionSelect(option.value)}
      >
        <RadioGroupItem value={option.value} className="mt-1" />
        <div className="flex-1">
          <Label className="text-xl font-semibold cursor-pointer">
            {option.label}
          </Label>
          {option.description && (
            <p className="text-base text-muted-foreground mt-2">
              {option.description}
            </p>
          )}
        </div>
      </div>
    ))}
  </RadioGroup>
  );
};

export const TypeformCheckbox: React.FC<{
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
}> = ({ checked, onCheckedChange, label, description }) => (
  <div
    className="flex items-start space-x-5 p-6 border-2 border-gray-200 rounded-2xl hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
    onClick={() => onCheckedChange(!checked)}
  >
    <Checkbox checked={checked} onCheckedChange={onCheckedChange} className="mt-1" />
    <div className="flex-1">
      <Label className="text-xl font-semibold cursor-pointer">
        {label}
      </Label>
      {description && (
        <p className="text-base text-muted-foreground mt-2">
          {description}
        </p>
      )}
    </div>
  </div>
);