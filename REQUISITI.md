# Criteri di Accettazione - Fase 2: Separazione Architettura 3-Tier

## Obiettivo
Separare il backend monolitico in architettura 3-tier (Presentation, Business Logic, Data Access) mantenendo il comportamento esistente.

---

## Criteri di Accettazione (Misurabili e Verificabili)

### 1. Struttura Directory
- ✓ Tutte le route/controller sono in `/routes` o `/controllers`
- ✓ Tutta la business logic è in `/services`
- ✓ Tutti gli accessi al database sono in `/repositories`
- **Verifica**: `find routes -name "*.js" | wc -l` > 0 AND `find services -name "*.js" | wc -l` > 0 AND `find repositories -name "*.js" | wc -l` > 0

### 2. Separazione delle Responsabilità

#### Route Layer (Presentation)
- ✓ Nessuna query SQL diretta in `/routes` o `/controllers`
- ✓ Ogni route handler chiama SOLO metodi del Service layer
- ✓ Zero logica di business nei route handler (max 3 righe: parse input → call service → return response)
- **Verifica**: `grep -r "SELECT\|INSERT\|UPDATE\|DELETE" routes/ | wc -l` == 0

#### Service Layer (Business Logic)
- ✓ Ogni Service chiama SOLO metodi del Repository layer
- ✓ Nessuna query SQL diretta in `/services`
- ✓ Zero dipendenze dirette da Express (req, res) nei Service
- **Verifica**: `grep -r "SELECT\|INSERT\|UPDATE\|DELETE" services/ | wc -l` == 0

#### Repository Layer (Data Access)
- ✓ TUTTE le query SQL sono in `/repositories`
- ✓ Ogni Repository espone metodi chiari (es: `findById`, `findAll`, `create`, `update`, `delete`)
- ✓ Zero logica di business nei Repository (solo query + mapping)
- **Verifica**: `grep -r "SELECT\|INSERT\|UPDATE\|DELETE" . --exclude-dir=repositories --exclude-dir=node_modules | wc -l` == 0

### 3. Testing

#### Test di Baseline (Regression)
- ✓ Tutti i test E2E esistenti continuano a passare
- ✓ Zero regressioni nel comportamento
- **Verifica**: `npm test` exit code == 0

#### Unit Test dei Service
- ✓ Ogni Service ha almeno un unit test
- ✓ I test dei Service usano mock/stub del Repository (zero dipendenze dal DB reale)
- ✓ Copertura test sui Service layer >= 70%
- **Verifica**: `npm run test:coverage -- services/` coverage >= 70%

#### Test E2E su DB Reale (via MCP)
- ✓ Test E2E eseguiti su DB reale Northwind (non mock)
- ✓ Ogni test wrapped in transazione: `BEGIN` in `beforeEach`, `ROLLBACK` in `afterEach`
- ✓ Test suite include seed script riproducibile per stato iniziale DB
- ✓ Test passano sia su DB pulito che su DB con dati esistenti (idempotenza)
- ✓ Zero side-effects tra test (isolation garantita da rollback)
- **Verifica**:
  - `npm run test:e2e` passa senza cleanup manuale
  - Eseguire 2 volte consecutivamente → stesso risultato
  - Query `SELECT COUNT(*) FROM orders` identico prima/dopo test suite

### 4. Interfacce e Contratti

#### File Structure
- ✓ Un file = una classe/modulo (es: `ProductService.js`, `ProductRepository.js`)
- ✓ Naming consistente: `<Entity>Service.js` in `/services`, `<Entity>Repository.js` in `/repositories`
- **Verifica**: Manuale review della struttura file

#### Dependency Injection
- ✓ Ogni Service riceve il Repository come dipendenza (costruttore o parametro)
- ✓ Zero `require()` o `import` diretto del Repository dentro metodi del Service
- **Verifica**: Code review dei costruttori Service

### 5. Backward Compatibility
- ✓ API endpoints mantengono stesso path e parametri
- ✓ Formato response identico a baseline (JSON structure)
- ✓ Status code HTTP identici a baseline
- **Verifica**: Confronto snapshot response prima/dopo refactoring

---

## Acceptance Criteria Checklist

Fase 2 è **COMPLETA** solo quando:

- [ ] `grep -r "SELECT\|INSERT" routes/ | wc -l` ritorna 0
- [ ] `grep -r "SELECT\|INSERT" services/ | wc -l` ritorna 0
- [ ] Struttura directory esiste: `/routes`, `/services`, `/repositories`
- [ ] `npm test` passa al 100%
- [ ] Coverage Service layer >= 70%
- [ ] Zero regressioni negli endpoint E2E

---

## Rischi e Mitigazioni

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Regressione comportamento API | Media | Alto | Test E2E baseline before/after |
| Performance degradation (overhead layer aggiuntivi) | Bassa | Medio | Benchmark prima/dopo |
| Coupling nascosto tra layer | Media | Alto | Code review + lint rules custom |

---

## Dipendenze

- **Richiede**: Fase 0 completata (test baseline esistono)
- **Richiede**: Fase 1 completata (bug SQL injection fixati, altrimenti li propaghiamo nel Repository layer)
- **Blocca**: Fase 3 (introduzione ORM richiede Repository layer pulito)

---

## Note Implementative

- Partire da un singolo endpoint come spike (es: `/products`)
- Migrare endpoint per endpoint, non tutto insieme
- Ogni PR deve passare i criteri sopra prima di merge
- Usare linter custom per bloccare query SQL fuori da `/repositories`
