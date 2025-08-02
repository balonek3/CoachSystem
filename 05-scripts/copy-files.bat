@echo off
echo ========================================
echo KOPIOWANIE PLIKOW DO PROJEKTU
echo ========================================
echo.

:: Sprawdź czy folder projektu istnieje
if not exist "coach-system-app" (
    echo BLAD: Folder coach-system-app nie istnieje!
    echo Najpierw uruchom setup-project.bat
    pause
    exit /b 1
)

:: Kopiuj middleware.ts do głównego folderu
echo Kopiowanie middleware.ts...
copy /Y "app-files\middleware.ts" "coach-system-app\middleware.ts"

:: Kopiuj pliki aplikacji
echo Kopiowanie plikow aplikacji...
xcopy /Y /E /I "app-files\app" "coach-system-app\app"

:: Kopiuj komponenty
echo Kopiowanie komponentow...
if not exist "coach-system-app\components" (
    mkdir "coach-system-app\components"
)
xcopy /Y /E /I "app-files\components" "coach-system-app\components"

:: Sprawdź czy folder lib istnieje, jeśli nie - utwórz
if not exist "coach-system-app\lib" (
    mkdir "coach-system-app\lib"
)

:: Kopiuj plik konfiguracji Supabase
echo Kopiowanie konfiguracji Supabase...
copy /Y "supabase-config-template.ts" "coach-system-app\lib\supabase.ts"

echo.
echo ========================================
echo PLIKI SKOPIOWANE POMYSLNIE!
echo ========================================
echo.
echo Co dalej:
echo 1. Otworz VS Code
echo 2. Upewnij sie ze utworzyles plik .env.local z kluczami Supabase
echo 3. W terminalu wpisz: npm run dev
echo 4. Otworz przegladarke na http://localhost:3000
echo.
echo Nacisnij dowolny klawisz aby zamknac...
pause > nul