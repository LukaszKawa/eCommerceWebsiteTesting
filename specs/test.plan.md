# Test Plan — demoblaze eCommerce (updated)

## Application Overview

Zaktualizowany plan testów E2E dla https://www.demoblaze.com/ obejmuje rejestrację, logowanie/sesję, dwa sposoby odkrywania produktów (szukaj+filtr / przeglądanie kategorii), dodawanie do koszyka, operacje na koszyku oraz obsługę kuponów/zniżek (jeśli dostępne). Plan zakłada czysty stan przeglądarki, brak zalogowanego użytkownika i dostęp do internetu. Każdy scenariusz zawiera kroki, przypadki negatywne i kryteria sukcesu.

## Test Scenarios

### 1. Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. User Registration - Create Account & Validation

**File:** `tests/authentication/registration.spec.ts`

**Steps:**
  1. Assumptions: czysta sesja przeglądarki, brak zalogowanego użytkownika.
  2. 1. Otwórz stronę główną (`/`).
  3. 2. Kliknij przycisk "Sign up".
  4. 3. Przygotuj unikalną nazwę użytkownika (np. `user_<timestamp>`) i silne hasło (`BezpieczneHaslo1!`).
  5. 4. Wypełnij pola rejestracyjne i kliknij "Sign up".
  6. 5. Obsłuż alert/modal: zaakceptuj alert z komunikatem o sukcesie lub błędzie.
  7. 6. Walidacja negatywna: ponów krok rejestracji z krótkim hasłem (np. `a`) lub pustym polem username i sprawdź, że aplikacja blokuje zapis (pokazanie komunikatu lub brak alertu sukcesu).
  8. 7. Po udanej rejestracji spróbuj się zalogować tymi danymi (przejdź do "Log in" i wprowadź poświadczenia) i zweryfikuj, że logowanie działa.
  9. 8. Opcjonalnie: jeśli aplikacja automatycznie loguje po rejestracji, przeprowadź wylogowanie i ponowne logowanie aby potwierdzić konto.

**Expected Results:**
  - Dla unikalnych danych pojawia się alert/komunikat potwierdzający sukces rejestracji.
  - Dla niepoprawnych danych widoczny jest komunikat walidacyjny i brak rejestracji.
  - Utworzone konto może się zalogować (poprawne poświadczenia).
  - Kryterium sukcesu: konto utworzone i można się na nie zalogować; błędne dane są odrzucane.

#### 1.2. Login and Session Persistence

**File:** `tests/authentication/login-session.spec.ts`

**Steps:**
  1. Assumptions: konto testowe istnieje (może pochodzić z poprzedniego testu).
  2. 1. Otwórz stronę i kliknij "Log in".
  3. 2. Wprowadź poprawne poświadczenia i potwierdź.
  4. 3. Zweryfikuj wyraźny stan zalogowania: obecność nazwy użytkownika, przycisku "Log out" lub innego widocznego wskaźnika.
  5. 4. Odśwież stronę i ponownie sprawdź, czy użytkownik pozostaje zalogowany (session persistence).
  6. 5. Kliknij "Log out" i sprawdź, że interfejs powraca do stanu niezalogowanego (widoczne "Log in"/"Sign up").
  7. 6. Negatywny: spróbuj zalogować się nieprawidłowymi danymi i potwierdź, że pojawia się komunikat błędu i brak zalogowania.

**Expected Results:**
  - Poprawne poświadczenia powodują zalogowanie i widoczny stan użytkownika.
  - Odświeżenie nie powoduje utraty sesji (jeśli aplikacja to wspiera).
  - Po wylogowaniu brak wskaźników zalogowania.
  - Kryterium sukcesu: logowanie, utrzymanie sesji i poprawne wylogowanie działają zgodnie z oczekiwaniami.

### 2. Product Discovery

**Seed:** `tests/seed.spec.ts`

#### 2.1. Product Discovery - Path A: Search + Filter (with fallback)

**File:** `tests/products/search-filter.spec.ts`

**Steps:**
  1. Assumptions: strona może nie mieć pola wyszukiwania; test wykonuje rozgałęzienie: jeśli pole wyszukiwania dostępne → użyj go, w przeciwnym razie wykonaj alternatywę (kategorie + client-side filtering).
  2. 1. Otwórz stronę główną.
  3. 2. Sprawdź, czy istnieje pole wyszukiwania (np. `input[type="search"]` lub widoczny komponent search).
  4. 3a. Jeśli pole wyszukiwania istnieje: wpisz frazę `electronics` i wyślij zapytanie.
  5. 3b. Jeśli nie ma pola wyszukiwania: wybierz odpowiednią kategorię lub użyj pola filtrów (jeśli dostępne) — jeśli UI nie udostępnia filtrów, odnotuj brak i przejdź do kroku weryfikacji wyników (test powinien zwrócić informację o ograniczeniach).
  6. 4. Jeśli dostępne są filtry zakresowe (np. cena), zastosuj zakres ograniczający (np. 100–500) i zastosuj filtr.
  7. 5. Zweryfikuj, że lista produktów odpowiada frazie wyszukiwania i zastosowanym filtrom.
  8. 6. Obsłuż scenariusz 0 wyników: potwierdź, że aplikacja pokazuje komunikat "Brak wyników" lub pustą listę i nie zwraca błędu.

**Expected Results:**
  - Jeśli funkcja wyszukiwania/filtrów dostępna: wyświetlone produkty spełniają kryteria wyszukiwania i filtru.
  - Jeżeli brak wyników: widoczny komunikat lub pusta lista bez błędu.
  - Kryterium sukcesu: mechanizm zwraca spójne wyniki zgodne z zapytaniem; brak wyników obsługiwany poprawnie.

#### 2.2. Product Discovery - Path B: Browse Category / Featured

**File:** `tests/products/browse-category.spec.ts`

**Steps:**
  1. Assumptions: dostępne kategorie na stronie głównej (Phones, Laptops, Monitors).
  2. 1. Otwórz stronę główną.
  3. 2. Przejdź przez inną ścieżkę niż wyszukiwanie: kliknij kategorię (np. `Phones`) lub sekcję "featured"/polecane.
  4. 3. Wybierz produkt z listy i otwórz stronę szczegółów produktu.
  5. 4. Zweryfikuj obecność tytułu produktu, ceny, opisu, obrazu i przycisku "Add to cart".
  6. 5. Negatyw: jeśli karta produktu ma brakujące dane, zgłoś to jako błąd UI/data.

**Expected Results:**
  - Dostęp do produktu przez kategorię/featured działa poprawnie.
  - Strona produktu zawiera komplet informacji wymaganych do zakupu.
  - Kryterium sukcesu: produkt osiągalny alternatywną ścieżką i wszystkie kluczowe informacje widoczne.

### 3. Cart & Checkout

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add To Cart - From Product Page

**File:** `tests/cart/add-to-cart.spec.ts`

**Steps:**
  1. Assumptions: test korzysta z produktu dostępnego w katalogu; koszyk początkowo pusty.
  2. 1. Przejdź na stronę produktu (może być z Path A lub B).
  3. 2. Kliknij przycisk "Add to cart".
  4. 3. Obsłuż alert/modal (zaakceptuj informację o dodaniu).
  5. 4. Otwórz stronę `Cart`.
  6. 5. Zweryfikuj, że w koszyku znajduje się pozycja o poprawnej nazwie i cenie oraz domyślnej ilości (jeżeli UI pokazuje ilość).
  7. 6. Negatyw: spróbuj dodać produkt z niedostępną ceną/niekompletnymi danymi i sprawdź zachowanie.

**Expected Results:**
  - Po dodaniu produkt pojawia się w koszyku z poprawnymi danymi.
  - Kryterium sukcesu: koszyk pokazuje poprawne nazwy, ceny i sumę.

#### 3.2. Cart Mutations - Update Quantity or Remove Item

**File:** `tests/cart/mutations.spec.ts`

**Steps:**
  1. Assumptions: UI może nie wspierać edycji ilości; test obsłuży oba przypadki (edycja ilości lub dodanie tej samej pozycji wielokrotnie).
  2. 1. Dodaj do koszyka jeden produkt.
  3. 2a. Jeśli interfejs pozwala zmienić ilość: zmień ilość na 2 i potwierdź.
  4. 2b. Jeśli nie ma pola ilości: dodaj ten sam produkt ponownie, aby uzyskać ilość 2 lub drugą pozycję.
  5. 3. Zweryfikuj, że całkowity koszt (suma) zaktualizował się poprawnie (price * qty).
  6. 4. Usuń produkt z koszyka (kliknij "Delete" lub odpowiednik) i sprawdź, że pozycja zniknęła i suma została zaktualizowana.
  7. 5. Negatyw: spróbuj ustawić ilość 0 lub ujemną (jeśli UI pozwala) i potwierdź, że UI odrzuca lub normalizuje wartość.

**Expected Results:**
  - Zmiana ilości lub dodanie drugiej pozycji aktualizuje sumę poprawnie.
  - Usunięcie elementu powoduje aktualizację listy i sumy (np. zero dla pustego koszyka).
  - Kryterium sukcesu: wszystkie mutacje koszyka są odzwierciedlone w podsumowaniu cen.

#### 3.3. Coupon / Discount - Apply Promo Code (conditional)

**File:** `tests/cart/coupon.spec.ts`

**Steps:**
  1. Assumptions: Demoblaze może nie udostępniać pola na kupon; test zaczyna od sprawdzenia obecności mechanizmu kuponowego.
  2. 1. Otwórz `Cart` i sprawdź, czy dostępny jest input/pole na kod promocyjny lub przycisk "Apply coupon".
  3. 2a. Jeśli pole dostępne: wprowadź najpierw nieprawidłowy kod (`INVALIDCODE`) i zastosuj — sprawdź komunikat walidacyjny.
  4. 2b. Wprowadź poprawny kod testowy (jeśli jest dostępny w środowisku testowym) i zastosuj — sprawdź, czy suma uległa obniżeniu odpowiednio do oczekiwanego rabatu.
  5. 3. Jeśli pole nie jest dostępne: zarejestruj test jako N/A z komentarzem o braku funkcjonalności w UI.
  6. 4. Zweryfikuj, że wynik (rabatu lub komunikatu) jest zgodny z oczekiwaniami i nie powoduje naruszeń sumy/formatu cen.

**Expected Results:**
  - Dla nieprawidłowego kodu: komunikat walidacyjny i brak zmiany sumy.
  - Dla prawidłowego kodu: obniżona suma zgodnie z regułą rabatu.
  - Jeśli funkcja niedostępna: test oznaczony jako N/A i odnotowany w raporcie.
  - Kryterium sukcesu: mechanizm kuponów działa (jeśli obecny) i poprawnie aktualizuje ceny lub zwraca walidację dla błędnego kodu.
