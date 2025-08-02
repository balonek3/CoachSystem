# 📊 PROGRESS BAR KONTEKSTU - Dokumentacja

## 🎯 Cel
Regularne wyświetlanie prostego progress bara pokazującego wykorzystanie kontekstu w każdej konwersacji.

## 📐 Formaty Progress Bara

### Format 1: Prosty tekstowy
```
Kontekst: [████████░░░░░░░░░░░░] 40% (80k/200k tokenów)
```

### Format 2: Z emoji
```
📊 Kontekst: ████████████░░░░░░░░ 60% wykorzystane
```

### Format 3: Kolorowy (markdown)
```
🟢 Kontekst: ▓▓▓▓▓░░░░░ 50% | Pozostało: 100k tokenów
🟡 Kontekst: ▓▓▓▓▓▓▓▓░░ 80% | Uwaga: zbliżamy się do limitu
🔴 Kontekst: ▓▓▓▓▓▓▓▓▓▓ 95% | Rozważ nową sesję!
```

### Format 4: Kompaktowy
```
[40%] ████░░░░░░ Dużo miejsca ✅
[75%] ███████░░░ Oszczędzaj tokeny ⚠️
[90%] █████████░ Nowa sesja wkrótce 🔴
```

## 🔄 Kiedy wyświetlać

1. **Na początku odpowiedzi** - przy dłuższych zadaniach
2. **Co 3-4 odpowiedzi** - przy normalnej konwersacji
3. **Zawsze gdy przekroczymy 70%** - ostrzeżenie
4. **Po dużych operacjach** - np. generowanie wielu plików

## 💡 Przykład użycia w odpowiedzi

```markdown
## Status projektu Coach System

📊 **Kontekst: [███░░░░░░░] 30% wykorzystane**

Oto kolejne pliki do Twojego projektu...
```

## 🎨 Zalecane style dla różnych poziomów

- **0-50%**: 🟢 Zielony, "Dużo miejsca"
- **50-70%**: 🟡 Żółty, "Wszystko OK"
- **70-85%**: 🟠 Pomarańczowy, "Oszczędzaj"
- **85-95%**: 🔴 Czerwony, "Rozważ nową sesję"
- **95%+**: ⚫ Czarny/Krytyczny, "Nowa sesja!"

## 📝 Szablon do kopiowania

```
📊 Kontekst: [████████░░] 80% | Pozostało: ~40k tokenów
```

## 🤖 Instrukcja dla Claude

W każdej konwersacji:
1. Monitoruj przybliżone zużycie tokenów
2. Wyświetlaj progress bar co kilka odpowiedzi
3. Ostrzegaj użytkownika przy 70%+ wykorzystania
4. Sugeruj strategie oszczędzania (--uc, nowa sesja)
5. Używaj prostego, czytelnego formatu

## 🚀 Przykłady implementacji

### Minimalistyczny:
```
[45%] ████░░░░░
```

### Informacyjny:
```
Kontekst: 45% [████░░░░░] ~90k/200k tokenów
```

### Z akcją:
```
⚠️ Kontekst: 75% [███████░░░] 
💡 Tip: Użyj --uc lub rozpocznij nową sesję dla dużych zadań
```

---

**PAMIĘTAJ**: To przybliżone wartości. Dokładne liczenie tokenów jest skomplikowane, ale nawet przybliżony progress bar jest bardzo pomocny dla użytkowników!