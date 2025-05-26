
-- Update the customer creation trigger to use the new fields
CREATE OR REPLACE FUNCTION public.handle_new_customer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.customers (
    user_id, 
    first_name, 
    middle_name, 
    last_name, 
    email, 
    contact_number,
    birthdate,
    birthplace,
    address,
    valid_government_id
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'middle_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email,
    NEW.raw_user_meta_data ->> 'contact_number',
    (NEW.raw_user_meta_data ->> 'birthdate')::date,
    NEW.raw_user_meta_data ->> 'birthplace',
    NEW.raw_user_meta_data ->> 'address',
    NEW.raw_user_meta_data ->> 'valid_government_id'
  );
  RETURN NEW;
END;
$function$;
