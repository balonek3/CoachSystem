# 🚀 INSTRUKCJA URUCHOMIENIA COACH SYSTEM

## ✅ Co już masz gotowe:
1. Konto Supabase z bazą danych
2. Projekt Next.js utworzony
3. Pliki aplikacji przygotowane

## 📋 KROKI DO WYKONANIA:

### 1️⃣ SKOPIUJ PLIKI DO PROJEKTU
1. **Kliknij dwukrotnie** na plik `copy-files.bat`
2. Poczekaj aż zobaczy komunikat o sukcesie

### 2️⃣ SKONFIGURUJ KLUCZE SUPABASE
1. **Otwórz VS Code**
2. **Otwórz folder** `coach-system-app`
3. **Utwórz plik** `.env.local` (jeśli jeszcze nie istnieje)
4. **Wejdź na Supabase** → Settings → API
5. **Skopiuj i wklej** do `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=tu_wklej_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_wklej_anon_key
```

### 3️⃣ UTWÓRZ UŻYTKOWNIKÓW TESTOWYCH
1. W **Supabase** przejdź do: Authentication → Users
2. Kliknij **"Add user"** → **"Create new user"**
3. Utwórz ADMINA:
   - Email: `admin@example.com`
   - Password: `admin123`
   - ✅ Auto Confirm User
4. Utwórz KLIENTA:
   - Email: `client@example.com`
   - Password: `client123`
   - ✅ Auto Confirm User

### 4️⃣ USTAW ROLE UŻYTKOWNIKÓW
1. W Supabase przejdź do **Table Editor** → **profiles**
2. Znajdź użytkownika `admin@example.com`
3. Kliknij na niego i zmień `role` na: **admin**
4. Zapisz zmiany

### 5️⃣ URUCHOM APLIKACJĘ
1. W **VS Code** otwórz Terminal (View → Terminal)
2. Wpisz: `npm run dev`
3. Naciśnij Enter
4. Poczekaj aż zobaczysz: `Ready on http://localhost:3000`

### 6️⃣ OTWÓRZ APLIKACJĘ
1. Otwórz przeglądarkę
2. Wejdź na: **http://localhost:3000**
3. Zaloguj się jako:
   - Admin: `admin@example.com` / `admin123`
   - Klient: `client@example.com` / `client123`

## 🛠️ ROZWIĄZYWANIE PROBLEMÓW:

### ❌ Błąd "Cannot find module"
- Upewnij się, że uruchomiłeś `setup-project.bat`
- W terminalu wpisz: `npm install`

### ❌ Błąd "Invalid Supabase URL"
- Sprawdź plik `.env.local`
- Upewnij się, że wkleiłeś prawidłowe klucze

### ❌ Nie mogę się zalogować
- Sprawdź czy utworzyłeś użytkowników w Supabase
- Sprawdź czy zaznaczyłeś "Auto Confirm User"

### ❌ Strona się nie ładuje
- Sprawdź czy w terminalu nie ma błędów
- Zatrzymaj serwer (Ctrl+C) i uruchom ponownie

## 📞 POMOC:
Jeśli coś nie działa, wyślij mi:
1. Zrzut ekranu z błędem
2. Co dokładnie robiłeś przed błędem
3. Zawartość terminala

---

## 🎯 CO DALEJ?
Po uruchomieniu możesz:
- Jako ADMIN: dodawać klientów, zarządzać godzinami
- Jako KLIENT: przeglądać swoje godziny i historię

Integracja z Fireflies będzie następnym krokiem!