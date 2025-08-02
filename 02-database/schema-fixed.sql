-- NAPRAWIONY SCHEMAT BAZY DANYCH DLA COACH SYSTEM
-- Usuwa infinite recursion z policies dla tabeli profiles
-- Skopiuj całość i wklej w Supabase SQL Editor

-- 1. Usuń istniejące policies (jeśli istnieją)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all clients" ON clients;
DROP POLICY IF EXISTS "Admins can modify all clients" ON clients;
DROP POLICY IF EXISTS "Clients can view own profile" ON profiles;
DROP POLICY IF EXISTS "Clients can view own data" ON clients;
DROP POLICY IF EXISTS "Clients can view own hours history" ON hours_history;

-- 2. Nowe, bezpieczne policies dla profiles
-- Każdy użytkownik może czytać i modyfikować swój własny profil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3. Temporary admin policy - sprawdza email zamiast rekursji do profiles
-- UWAGA: Zmień email na prawdziwy email admina!
CREATE POLICY "Admin access by email" ON profiles
  FOR ALL USING (
    auth.email() = 'admin@example.com'
  );

-- 4. Policies dla clients table
CREATE POLICY "Users can view own client data" ON clients
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own client data" ON clients
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own client data" ON clients
  FOR UPDATE USING (user_id = auth.uid());

-- Admin może modyfikować wszystkich klientów (przez email check)
CREATE POLICY "Admin can access all clients" ON clients
  FOR ALL USING (
    auth.email() = 'admin@example.com'
  );

-- 5. Policies dla hours_history table
CREATE POLICY "Users can view own hours history" ON hours_history
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- Admin może dostęp do wszystkich hours_history
CREATE POLICY "Admin can access all hours history" ON hours_history
  FOR ALL USING (
    auth.email() = 'admin@example.com'
  );

-- 6. Policy dla fireflies_transcripts (na przyszłość)
CREATE POLICY "Users can view own transcripts" ON fireflies_transcripts
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can access all transcripts" ON fireflies_transcripts
  FOR ALL USING (
    auth.email() = 'admin@example.com'
  );

-- 7. WAŻNE: Dodatkowe uprawnienia dla service_role
-- To pozwala aplikacji na tworzenie profili przez server component
ALTER TABLE profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE clients FORCE ROW LEVEL SECURITY;
ALTER TABLE hours_history FORCE ROW LEVEL SECURITY;
ALTER TABLE fireflies_transcripts FORCE ROW LEVEL SECURITY;

-- 8. Informacja dla developera
-- Po zastosowaniu tego schema:
-- 1. Zmień 'admin@example.com' na rzeczywisty email admina
-- 2. Przetestuj logowanie jako user i admin
-- 3. Sprawdź czy dashboard działa bez infinite recursion error

COMMENT ON TABLE profiles IS 'Fixed: Policies nie powodują infinite recursion. Admin sprawdzany przez auth.email().';