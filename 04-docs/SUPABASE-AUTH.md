# ⚠️ WAŻNE - Konfiguracja Supabase Auth Admin

## Problem:
API używa `supabase.auth.admin` do tworzenia użytkowników, co wymaga specjalnego klucza.

## Rozwiązanie:

### Opcja 1: Użyj Service Role Key (zalecane dla developmentu)

1. Wejdź do Supabase → Settings → API
2. Znajdź **"service_role key"** (UWAGA: to tajny klucz!)
3. Dodaj do `.env.local`:
```
SUPABASE_SERVICE_ROLE_KEY=twoj_service_role_key
```

4. Utwórz plik `lib/supabase-admin.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
```

5. W API używaj `supabaseAdmin` zamiast `supabase` dla operacji admin

### Opcja 2: Tymczasowe rozwiązanie (bez Service Key)

Jeśli nie chcesz używać Service Key, możesz:

1. Tworzyć użytkowników ręcznie w Supabase Dashboard
2. W kodzie tylko aktualizować dane (bez tworzenia)

### Opcja 3: Użyj Edge Functions (produkcja)

Dla produkcji zaleca się utworzenie Supabase Edge Function do tworzenia użytkowników.

## Bezpieczeństwo:

⚠️ **NIGDY** nie commituj Service Role Key do repozytorium!
⚠️ Dodaj `.env.local` do `.gitignore`
⚠️ W produkcji używaj zmiennych środowiskowych serwera

## Testowanie:

Jeśli nie masz Service Key, możesz:
1. Utworzyć użytkowników ręcznie w Supabase
2. Zakomentować tworzenie użytkowników w API
3. Skupić się na testowaniu pozostałych funkcji