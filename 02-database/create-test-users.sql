-- SKRYPT TWORZĄCY UŻYTKOWNIKÓW TESTOWYCH
-- Uruchom w Supabase SQL Editor

-- Najpierw utwórz użytkowników przez Supabase Auth
-- WAŻNE: Musisz najpierw utworzyć użytkowników w Authentication → Users

-- Po utworzeniu użytkowników, znajdź ich ID i wklej poniżej:
-- Zastąp ADMIN_ID i CLIENT_ID rzeczywistymi ID z tabeli auth.users

DO $$
DECLARE
  admin_email TEXT := 'admin@example.com';
  client_email TEXT := 'client@example.com';
  admin_id UUID;
  client_id UUID;
BEGIN
  -- Znajdź ID użytkowników po emailu
  SELECT id INTO admin_id FROM auth.users WHERE email = admin_email;
  SELECT id INTO client_id FROM auth.users WHERE email = client_email;
  
  IF admin_id IS NOT NULL THEN
    -- Aktualizuj rolę admina
    UPDATE profiles SET role = 'admin' WHERE id = admin_id;
    RAISE NOTICE 'Admin role updated for %', admin_email;
  ELSE
    RAISE NOTICE 'Admin user not found. Please create % in Authentication first', admin_email;
  END IF;
  
  IF client_id IS NOT NULL THEN
    -- Upewnij się że klient ma właściwe dane
    UPDATE clients 
    SET 
      hourly_rate = 150.00,
      total_hours = 10.00,
      remaining_hours = 10.00
    WHERE user_id = client_id;
    RAISE NOTICE 'Client data updated for %', client_email;
  ELSE
    RAISE NOTICE 'Client user not found. Please create % in Authentication first', client_email;
  END IF;
END $$;