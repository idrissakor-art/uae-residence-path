
CREATE OR REPLACE FUNCTION public.validate_case_document_mime_type()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.mime_type IS NOT NULL AND NEW.mime_type NOT IN (
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) THEN
    RAISE EXCEPTION 'Invalid mime_type %. Allowed: pdf, jpg, png, docx.', NEW.mime_type;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_case_document_mime_type_trigger ON public.case_documents;

CREATE TRIGGER validate_case_document_mime_type_trigger
BEFORE INSERT OR UPDATE ON public.case_documents
FOR EACH ROW
EXECUTE FUNCTION public.validate_case_document_mime_type();
