# 🏆 Coach System - System Zarządzania Godzinami Konsultacji

System webowy do zarządzania godzinami konsultacji dla coachów i ich klientów.

## 📋 Funkcjonalności

### Panel Administratora
- ✅ Dodawanie nowych klientów
- ✅ Zarządzanie godzinami (dodawanie/odejmowanie)
- ✅ Szczegółowy widok klienta z historią
- ✅ Edycja stawek godzinowych
- ✅ Śledzenie sesji konsultacyjnych

### Panel Klienta
- ✅ Podgląd pozostałych godzin
- ✅ Historia wykorzystania godzin
- ✅ Linki do notatek i nagrań spotkań

### Planowane (w rozwoju)
- 🔄 Integracja z Fireflies (automatyczne transkrypcje)
- 🤖 AI podsumowania spotkań
- 📊 Raporty i statystyki
- 📧 Powiadomienia email

## 🚀 Szybki Start

### 1. Wymagania
- Node.js 18+ 
- Konto Supabase
- Git (opcjonalnie)

### 2. Instalacja

```bash
# Sklonuj lub pobierz projekt
cd coach-system

# Zainstaluj zależności
npm install
```

### 3. Konfiguracja Supabase

1. Utwórz projekt w [Supabase](https://supabase.com)
2. Wykonaj skrypt SQL z `02-database/schema.sql`
3. Skopiuj klucze API z Supabase
4. Utwórz plik `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=twoj_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_klucz
SUPABASE_SERVICE_ROLE_KEY=twoj_service_key
```

### 4. Uruchomienie

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000)

## 📁 Struktura Projektu

```
coach-system/
├── 📁 01-setup/          # Pliki instalacyjne i konfiguracyjne
├── 📁 02-database/       # Schemat bazy danych SQL
├── 📁 03-source/         # Kod źródłowy (backup)
├── 📁 04-docs/           # Dokumentacja szczegółowa
├── 📁 05-scripts/        # Skrypty pomocnicze
├── 📁 app/               # Aplikacja Next.js (App Router)
├── 📁 components/        # Komponenty React
├── 📁 lib/               # Biblioteki i konfiguracje
└── 📄 package.json       # Zależności projektu
```

## 🔧 Technologie

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Baza danych**: PostgreSQL (Supabase)
- **Autoryzacja**: Supabase Auth
- **Hosting**: Vercel (zalecany)

## 📚 Dokumentacja

Szczegółowa dokumentacja znajduje się w folderze `04-docs/`:

- `INSTRUKCJA-URUCHOMIENIA.md` - Krok po kroku dla początkujących
- `SUPABASE-AUTH.md` - Konfiguracja autoryzacji
- `API-REFERENCE.md` - Dokumentacja API endpoints
- `CHANGELOG.md` - Historia zmian

## 👥 Użytkownicy Testowi

Do testowania możesz użyć:

**Admin:**
- Email: `admin@example.com`
- Hasło: `admin123`

**Klient:**
- Email: `client@example.com`
- Hasło: `client123`

## 🛠️ Rozwój

### Dodawanie nowych funkcji

1. Utwórz nową gałąź: `git checkout -b feature/nazwa-funkcji`
2. Wprowadź zmiany
3. Testuj lokalnie
4. Commituj: `git commit -m "Dodaj: opis funkcji"`

### Struktura API

```
/api/clients          - GET, POST
/api/clients/[id]     - GET, PATCH, DELETE
/api/hours            - POST (add/deduct), GET (history)
/api/webhooks/fireflies - POST (w przygotowaniu)
```

## 📄 Licencja

Ten projekt jest własnością prywatną. Wszelkie prawa zastrzeżone.

## 📞 Kontakt

W razie pytań lub problemów, skontaktuj się z autorem projektu.

---

**Coach System** v1.0.0 | Stworzony z ❤️ dla coachów