# 📁 NOWA STRUKTURA PROJEKTU

## Obecny bałagan:
```
Coach System/
├── Mnóstwo plików .md w głównym folderze
├── Pliki .bat rozrzucone
├── Pliki SQL bez organizacji
├── app-files/ (kod źródłowy)
├── coach test.html (stary plik)
└── Różne pliki pomocnicze
```

## Proponowana czysta struktura:
```
coach-system/
├── 📄 README.md                    # Główna dokumentacja
├── 📄 .gitignore                   # Ignorowane pliki
├── 📁 01-setup/                    # Wszystko do instalacji
│   ├── setup-project.bat
│   ├── install-dependencies.bat
│   └── README-SETUP.md
├── 📁 02-database/                 # Wszystko związane z bazą
│   ├── schema.sql
│   ├── test-data.sql
│   └── migrations/
├── 📁 03-source/                   # Kod źródłowy aplikacji
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── middleware.ts
├── 📁 04-docs/                     # Cała dokumentacja
│   ├── INSTRUKCJA-URUCHOMIENIA.md
│   ├── SUPABASE-AUTH.md
│   ├── API-REFERENCE.md
│   └── FIREFLIES-INTEGRATION.md
├── 📁 05-scripts/                  # Skrypty pomocnicze
│   ├── copy-files.bat
│   ├── clean-project.bat
│   └── backup-data.bat
└── 📁 _archive/                    # Stare pliki do usunięcia
    └── coach test.html
```

## Zalety:
✅ Numerowane foldery - jasna kolejność
✅ Logiczne grupowanie plików
✅ Łatwe znalezienie wszystkiego
✅ Profesjonalny wygląd
✅ Gotowe na Git