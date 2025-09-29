import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: "AE", name: "Émirats Arabes Unis", flag: "🇦🇪", dialCode: "+971" },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "MA", name: "Maroc", flag: "🇲🇦", dialCode: "+212" },
  { code: "TN", name: "Tunisie", flag: "🇹🇳", dialCode: "+216" },
  { code: "DZ", name: "Algérie", flag: "🇩🇿", dialCode: "+213" },
  { code: "SA", name: "Arabie Saoudite", flag: "🇸🇦", dialCode: "+966" },
  { code: "EG", name: "Égypte", flag: "🇪🇬", dialCode: "+20" },
  { code: "LB", name: "Liban", flag: "🇱🇧", dialCode: "+961" },
  { code: "JO", name: "Jordanie", flag: "🇯🇴", dialCode: "+962" },
  { code: "SY", name: "Syrie", flag: "🇸🇾", dialCode: "+963" },
  { code: "US", name: "États-Unis", flag: "🇺🇸", dialCode: "+1" },
  { code: "GB", name: "Royaume-Uni", flag: "🇬🇧", dialCode: "+44" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪", dialCode: "+49" },
  { code: "ES", name: "Espagne", flag: "🇪🇸", dialCode: "+34" },
  { code: "IT", name: "Italie", flag: "🇮🇹", dialCode: "+39" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { code: "AU", name: "Australie", flag: "🇦🇺", dialCode: "+61" },
];

interface PhoneInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  selectedCountry?: Country;
  onCountryChange?: (country: Country) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  placeholder,
  value,
  onChange,
  selectedCountry: initialSelectedCountry,
  onCountryChange
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    initialSelectedCountry || countries[0]
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    onCountryChange?.(country);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value;
    // Combine country code with phone number
    const fullNumber = `${selectedCountry.dialCode} ${phoneNumber}`;
    onChange(fullNumber);
  };

  // Extract just the phone number part (without country code) for display
  const getPhoneNumber = () => {
    if (!value) return "";
    const cleanValue = value.replace(selectedCountry.dialCode, "").trim();
    return cleanValue;
  };

  return (
    <div className="space-y-2">
      <div className="flex rounded-2xl border-2 border-gray-200 bg-white overflow-hidden focus-within:border-primary/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-14 px-4 rounded-none border-r border-gray-200 hover:bg-gray-50 flex items-center space-x-2"
            >
              <span className="text-xl">{selectedCountry.flag}</span>
              <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-64 max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg z-50"
            align="start"
          >
            {countries.map((country) => (
              <DropdownMenuItem
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
              >
                <span className="text-lg">{country.flag}</span>
                <span className="flex-1 text-sm">{country.name}</span>
                <span className="text-sm text-gray-500">{country.dialCode}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <input
          type="tel"
          placeholder={placeholder}
          value={getPhoneNumber()}
          onChange={handlePhoneChange}
          className="flex-1 h-14 px-4 text-lg bg-transparent border-none outline-none placeholder-gray-400"
        />
      </div>
    </div>
  );
};