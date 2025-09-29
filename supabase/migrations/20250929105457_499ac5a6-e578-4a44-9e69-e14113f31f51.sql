-- Add WhatsApp number field to visa_cases table
ALTER TABLE public.visa_cases 
ADD COLUMN whatsapp_number text;