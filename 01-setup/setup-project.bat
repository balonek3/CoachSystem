@echo off
echo ========================================
echo TWORZENIE PROJEKTU COACH SYSTEM
echo ========================================
echo.

echo Tworzenie nowego projektu Next.js...
echo Prosze czekac, to moze potrwac 2-3 minuty...
echo.

cd /d "%~dp0"
npx create-next-app@latest coach-system-app --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-npm

echo.
echo ========================================
echo PROJEKT UTWORZONY!
echo ========================================
echo.
echo Instalowanie dodatkowych bibliotek...
cd coach-system-app
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

echo.
echo ========================================
echo INSTALACJA ZAKONCZONA!
echo ========================================
echo.
echo Nacisnij dowolny klawisz aby zamknac to okno...
pause > nul