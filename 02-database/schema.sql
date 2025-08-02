-- SCHEMAT BAZY DANYCH DLA COACH SYSTEM
-- Skopiuj całość i wklej w Supabase SQL Editor

-- 1. Tabela profili użytkowników (rozszerzenie Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'client')) NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela klientów
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hourly_rate DECIMAL(10,2),
  total_hours DECIMAL(10,2) DEFAULT 0,
  remaining_hours DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Tabela historii godzin
CREATE TABLE hours_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  change_hours DECIMAL(10,2) NOT NULL,
  description TEXT,
  comment TEXT,
  meeting_link TEXT,
  notes_link TEXT,
  balance_after DECIMAL(10,2) NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela transkrypcji Fireflies (na przyszłość)
CREATE TABLE fireflies_transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  meeting_id TEXT UNIQUE,
  transcript_url TEXT,
  duration_minutes INTEGER,
  summary TEXT,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Indeksy dla wydajności
CREATE INDEX idx_hours_history_client_id ON hours_history(client_id);
CREATE INDEX idx_hours_history_created_at ON hours_history(created_at DESC);
CREATE INDEX idx_clients_user_id ON clients(user_id);

-- 6. Włączenie Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE hours_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fireflies_transcripts ENABLE ROW LEVEL SECURITY;

-- 7. Polityki bezpieczeństwa (RLS)
-- Admini widzą wszystko
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY "Admins can view all clients" ON clients
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY "Admins can modify all clients" ON clients
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Klienci widzą tylko swoje dane
CREATE POLICY "Clients can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Clients can view own data" ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Clients can view own hours history" ON hours_history
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- 8. Funkcja do automatycznej aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Trigger dla updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Funkcja do tworzenia profilu po rejestracji
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'client');
  
  INSERT INTO public.clients (user_id, total_hours, remaining_hours)
  VALUES (new.id, 0, 0);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Trigger dla nowych użytkowników
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();