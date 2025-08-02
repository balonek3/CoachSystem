-- SKRYPT DEBUGOWANIA - uruchom w SQL Editor

-- 1. Sprawdź czy użytkownicy istnieją
SELECT id, email, created_at FROM auth.users;

-- 2. Sprawdź profile
SELECT * FROM profiles;

-- 3. Sprawdź klientów
SELECT * FROM clients;

-- 4. Jeśli widzisz użytkowników ale nie ma ich w profiles, uruchom:
INSERT INTO profiles (id, email, role)
SELECT id, email, 'client' 
FROM auth.users 
WHERE id NOT IN (SELECT id FROM profiles);

-- 5. Ustaw admina
UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';

-- 6. Upewnij się że klienci mają rekordy
INSERT INTO clients (user_id, total_hours, remaining_hours)
SELECT p.id, 0, 0 
FROM profiles p
WHERE p.role = 'client' 
AND p.id NOT IN (SELECT user_id FROM clients);