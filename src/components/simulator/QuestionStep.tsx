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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {step} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-300" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 bg-white shadow-sm border-0 animate-fade-in">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-foreground leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {children}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Button
            size="lg"
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full min-w-[120px]"
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
    className="text-xl p-6 border-2 border-primary/20 focus:border-primary rounded-xl bg-white"
  />
);

export const TypeformRadioGroup: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string; description?: string }>;
}> = ({ value, onValueChange, options }) => (
  <RadioGroup value={value} onValueChange={onValueChange} className="space-y-4">
    {options.map((option) => (
      <div
        key={option.value}
        className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary/50 cursor-pointer transition-colors"
        onClick={() => onValueChange(option.value)}
      >
        <RadioGroupItem value={option.value} className="mt-1" />
        <div className="flex-1">
          <Label className="text-lg font-medium cursor-pointer">
            {option.label}
          </Label>
          {option.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {option.description}
            </p>
          )}
        </div>
      </div>
    ))}
  </RadioGroup>
);

export const TypeformCheckbox: React.FC<{
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
}> = ({ checked, onCheckedChange, label, description }) => (
  <div
    className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary/50 cursor-pointer transition-colors"
    onClick={() => onCheckedChange(!checked)}
  >
    <Checkbox checked={checked} onCheckedChange={onCheckedChange} className="mt-1" />
    <div className="flex-1">
      <Label className="text-lg font-medium cursor-pointer">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">
          {description}
        </p>
      )}
    </div>
  </div>
);