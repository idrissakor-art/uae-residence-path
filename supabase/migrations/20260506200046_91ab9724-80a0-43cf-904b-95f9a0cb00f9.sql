
-- Canonical fee constant enforced server-side
CREATE OR REPLACE FUNCTION public.validate_payment_amount()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  expected_amount numeric := 13500;
  expected_currency text := 'AED';
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.currency IS DISTINCT FROM expected_currency THEN
      RAISE EXCEPTION 'Invalid currency %; expected %.', NEW.currency, expected_currency;
    END IF;
    IF NEW.amount IS DISTINCT FROM expected_amount THEN
      RAISE EXCEPTION 'Invalid payment amount %; expected % %.', NEW.amount, expected_amount, expected_currency;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only admins may change amount or currency post-insert
    IF (NEW.amount IS DISTINCT FROM OLD.amount OR NEW.currency IS DISTINCT FROM OLD.currency)
       AND NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
      RAISE EXCEPTION 'Only admins may modify payment amount or currency.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_payment_amount_trigger ON public.payments;

CREATE TRIGGER validate_payment_amount_trigger
BEFORE INSERT OR UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.validate_payment_amount();
