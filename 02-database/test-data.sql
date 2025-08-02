-- DANE TESTOWE DLA COACH SYSTEM
-- Uruchom ten skrypt w Supabase SQL Editor po utworzeniu pierwszego użytkownika

-- UWAGA: Najpierw musisz utworzyć użytkowników przez Supabase Auth!
-- 1. Przejdź do Authentication -> Users
-- 2. Kliknij "Add user" -> "Create new user"
-- 3. Utwórz dwóch użytkowników:
--    - admin@example.com z hasłem admin123
--    - client@example.com z hasłem client123

-- Po utworzeniu użytkowników, znajdź ich ID w tabeli auth.users
-- i zastąp poniższe wartości:

-- ZASTĄP TE ID RZECZYWISTYMI ID Z TWOJEJ BAZY:
DO $$
DECLARE
  admin_id UUID := 'TUTAJ_WKLEJ_ID_ADMINA';
  client_id UUID := 'TUTAJ_WKLEJ_ID_KLIENTA';
  client_record_id UUID;
BEGIN
  -- Zaktualizuj role użytkowników
  UPDATE profiles SET role = 'admin' WHERE id = admin_id;
  UPDATE profiles SET role = 'client' WHERE id = client_id;

  -- Dodaj dane dla klienta
  UPDATE clients 
  SET 
    hourly_rate = 150.00,
    total_hours = 20.00,
    remaining_hours = 12.50
  WHERE user_id = client_id
  RETURNING id INTO client_record_id;

  -- Dodaj przykładową historię godzin
  INSERT INTO hours_history (client_id, change_hours, description, balance_after, created_by, created_at)
  VALUES 
    (client_record_id, 20.00, 'Początkowy pakiet godzin', 20.00, admin_id, NOW() - INTERVAL '30 days'),
    (client_record_id, -2.50, 'Konsultacja - projekt A', 17.50, admin_id, NOW() - INTERVAL '25 days'),
    (client_record_id, -3.00, 'Warsztaty strategiczne', 14.50, admin_id, NOW() - INTERVAL '20 days'),
    (client_record_id, -2.00, 'Konsultacja - optymalizacja procesów', 12.50, admin_id, NOW() - INTERVAL '10 days');

END $$;

-- Sprawdź wyniki
SELECT * FROM profiles;
SELECT * FROM clients;
SELECT * FROM hours_history ORDER BY created_at;