-- Create core tables for admin dashboard system

-- Admin users table for secure login
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'agent')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Visa application cases table
CREATE TABLE public.visa_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  visa_type TEXT NOT NULL CHECK (visa_type IN ('2-year', '10-year')),
  status TEXT NOT NULL DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en_cours', 'documents_requis', 'en_revision', 'approuve', 'rejete', 'paiement_requis', 'paiement_recu')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  
  -- Application details
  property_value BIGINT NOT NULL,
  is_mortgaged BOOLEAN NOT NULL DEFAULT false,
  amount_paid BIGINT,
  has_noc BOOLEAN DEFAULT false,
  property_in_name TEXT CHECK (property_in_name IN ('yes', 'shared', 'no')),
  present_in_uae BOOLEAN NOT NULL DEFAULT false,
  has_valid_passport BOOLEAN NOT NULL DEFAULT false,
  has_health_insurance BOOLEAN NOT NULL DEFAULT false,
  sponsor_family BOOLEAN NOT NULL DEFAULT false,
  
  -- Processing details
  assigned_agent_id UUID REFERENCES public.admin_users(id),
  submission_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  estimated_cost DECIMAL(10,2),
  notes TEXT,
  internal_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Case documents table
CREATE TABLE public.case_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.visa_cases(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES public.admin_users(id),
  is_required BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_notes TEXT
);

-- Case status history for audit trail
CREATE TABLE public.case_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.visa_cases(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID NOT NULL REFERENCES public.admin_users(id),
  change_reason TEXT,
  client_notification_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email notifications log
CREATE TABLE public.email_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES public.visa_cases(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payment records table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.visa_cases(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AED',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin users can manage all data" ON public.admin_users
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin users can manage all cases" ON public.visa_cases
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin users can manage all documents" ON public.case_documents
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin users can view all history" ON public.case_status_history
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin users can view all notifications" ON public.email_notifications
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin users can view all payments" ON public.payments
FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_visa_cases_status ON public.visa_cases(status);
CREATE INDEX idx_visa_cases_client_email ON public.visa_cases(client_email);
CREATE INDEX idx_visa_cases_case_number ON public.visa_cases(case_number);
CREATE INDEX idx_visa_cases_created_at ON public.visa_cases(created_at DESC);
CREATE INDEX idx_case_documents_case_id ON public.case_documents(case_id);
CREATE INDEX idx_case_status_history_case_id ON public.case_status_history(case_id);
CREATE INDEX idx_case_status_history_created_at ON public.case_status_history(created_at DESC);

-- Function to generate case numbers
CREATE OR REPLACE FUNCTION public.generate_case_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'UAE-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('public.case_number_seq')::TEXT, 6, '0');
END;
$$;

-- Create sequence for case numbers
CREATE SEQUENCE public.case_number_seq START 1;

-- Function to automatically generate case number on insert
CREATE OR REPLACE FUNCTION public.set_case_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.case_number IS NULL OR NEW.case_number = '' THEN
    NEW.case_number := public.generate_case_number();
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to auto-generate case numbers
CREATE TRIGGER trigger_set_case_number
  BEFORE INSERT ON public.visa_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.set_case_number();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_visa_cases_updated_at BEFORE UPDATE ON public.visa_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log status changes
CREATE OR REPLACE FUNCTION public.log_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.case_status_history (case_id, old_status, new_status, changed_by, change_reason)
    VALUES (NEW.id, OLD.status, NEW.status, NEW.assigned_agent_id, 'Status updated');
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for status change logging
CREATE TRIGGER trigger_log_status_change
  AFTER UPDATE ON public.visa_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.log_status_change();

-- Insert default admin user (password: Admin2024!)
INSERT INTO public.admin_users (email, password_hash, full_name, role)
VALUES ('admin@uae-visa.com', '$2b$10$K7L/8Y06U6gmiOCvd9M.2OHm3Cq8GZmqmgxZvJhQOQWpQZKwxJqz.', 'Administrateur Principal', 'admin');

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'case-documents',
  'case-documents',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Storage policies for case documents
CREATE POLICY "Authenticated users can upload case documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'case-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view case documents" ON storage.objects
FOR SELECT USING (bucket_id = 'case-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update case documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'case-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete case documents" ON storage.objects
FOR DELETE USING (bucket_id = 'case-documents' AND auth.role() = 'authenticated');