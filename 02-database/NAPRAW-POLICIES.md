# 🚨 NAPRAW INFINITE RECURSION W SUPABASE POLICIES

## Problem
```
infinite recursion detected in policy for relation "profiles"
```

**Root Cause**: Policies dla tabeli `profiles` odwołują się do tej samej tabeli, tworząc nieskończoną rekursję.

## 🔧 ROZWIĄZANIE - KROK PO KROKU

### 1. Zaloguj się do Supabase Dashboard
- Idź do [supabase.com](https://supabase.com)
- Wybierz projekt Coach System
- Idź do **SQL Editor**

### 2. Zastosuj naprawione policies
Skopiuj całą zawartość pliku `schema-fixed.sql` i uruchom w SQL Editor.

### 3. Ustaw prawdziwy email admina
W pliku `schema-fixed.sql` zmień wszystkie wystąpienia:
```sql
auth.email() = 'admin@example.com'
```
na prawdziwy email admina, np.:
```sql
auth.email() = 'twoj.prawdziwy.email@gmail.com'
```

### 4. Sprawdź czy policies działają
Uruchom w SQL Editor:
```sql
-- Test 1: Sprawdź policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Test 2: Sprawdź czy możesz SELECT z profiles
SELECT * FROM profiles LIMIT 1;
```

### 5. Przeładuj aplikację
```bash
# W terminalu:
cd /mnt/d/Code/Coach\ System/coach-system
npm run dev -- -p 3002
```

### 6. Test logowania
1. Idź do http://localhost:3002/login
2. Zaloguj się testowym userem
3. Sprawdź czy dashboard ładuje się bez błędów

## 📊 OCZEKIWANE REZULTATY

**PRZED poprawką:**
```
GET /dashboard 307 in 803ms
🔍 DASHBOARD DEBUG: ❌ infinite recursion detected in policy
```

**PO poprawce:**
```
GET /dashboard 200 in <500ms
🔍 DASHBOARD DEBUG: ✅ Użytkownik znaleziony
🔍 DASHBOARD DEBUG: ✅ Profil znaleziony, rola: client
```

## 🔍 DEBUGOWANIE

Jeśli nadal są problemy, uruchom `debug-users.sql` w SQL Editor:
```sql
-- Zobacz wszystkich użytkowników
SELECT id, email, created_at FROM auth.users;

-- Zobacz profile
SELECT * FROM profiles;

-- Jeśli brak profili, dodaj je
INSERT INTO profiles (id, email, role)
SELECT id, email, 'client' 
FROM auth.users 
WHERE id NOT IN (SELECT id FROM profiles);
```

## ⚡ POPRAWA WYDAJNOŚCI

Po naprawieniu policies, główna strona nadal może ładować się wolno (7.6s).
To jest OSOBNY problem - pierwszy load Next.js kompiluje wszystko.

**Rozwiązania**:
1. `npm run build && npm start` - production build będzie szybszy
2. Optymalizacja bundle size
3. Lazy loading komponentów

Ale NAJPIERW napraw policies - to jest blocker całego systemu!