INSTRUKCJA KONFIGURACJI SUPABASE

Po utworzeniu projektu musisz skonfigurować połączenie z Supabase.

1. Wejdź do swojego projektu w Supabase
2. Kliknij "Settings" (Ustawienia) w menu po lewej
3. Kliknij "API"
4. Znajdź i skopiuj:
   - Project URL (zaczyna się od https://)
   - anon public key (długi ciąg znaków)

5. W folderze coach-system-app utwórz plik .env.local
6. Wklej do niego:

NEXT_PUBLIC_SUPABASE_URL=tu_wklej_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_wklej_anon_public_key

7. Zapisz plik

WAŻNE: Zastąp "tu_wklej_" rzeczywistymi wartościami z Supabase!