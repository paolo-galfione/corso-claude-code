# Piano di Rilascio - Refactoring Backend Northwind

## Contesto
Backend Express.js "spaghetti code" da trasformare in architettura 3-tier pulita, testata e documentata attraverso rilasci incrementali.

---

## FASE 0: Test Baseline (Preparazione)

### Obiettivo
Catturare il comportamento attuale del sistema legacy come "golden master" per garantire zero regressioni durante il refactoring.

### Criteri di Accettazione
- ✓ Test E2E per tutti gli endpoint CRUD (Customers, Orders, Order Details)
- ✓ Test eseguiti su DB reale Northwind via MCP SQLite
- ✓ Ogni test wrapped in transazione (BEGIN/ROLLBACK per isolation)
- ✓ Cattura snapshot response (status, headers, body JSON)
- ✓ Coverage: 100% degli endpoint esistenti
- **Verifica**: `npm run test:e2e` exit code == 0 sul codice legacy

### Dipendenze
- Nessuna (è la prima fase)

### Rischi e Mitigazioni
| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Test catturano comportamento errato (bug) | Alta | Medio | Accettato: i test catturano "as-is", i bug verranno fixati in Fase 1 |
| DB reale modificato durante test | Media | Alto | Transazioni con rollback obbligatorio |
| Snapshot troppo rigidi (timestamp, ID auto) | Media | Medio | Normalizzare campi dinamici prima di confronto |

### Rilascio
**NO** - Fase preparatoria, non rilasciabile

---

## FASE 1: Bug Fixing

### Obiettivo
Correggere bug critici (sicurezza, logica, performance) prima di refactorare, per non propagarli nella nuova architettura.

### Criteri di Accettazione

#### Sicurezza
- ✓ Zero SQL injection: tutte le query usano prepared statements/parameterized queries
- **Verifica**: `grep -r "SELECT.*\${" . | wc -l` == 0 (no string interpolation in SQL)

#### Logica
- ✓ Filtri corretti (es: query ?city=London ritorna solo Customers di London, non tutti)
- ✓ Edge case gestiti (es: order_id inesistente → 404, non 500)
- **Verifica**: Test specifici per ogni bug fixato

#### Performance
- ✓ N+1 query eliminati (Orders + Details caricati con JOIN, non loop)
- ✓ Baseline performance: latency p95 <= 100ms per endpoint semplici
- **Verifica**:
  - `npm run benchmark` → latency p95 rispetto baseline
  - Log delle query: max 1 query per endpoint semplice, max 3 per endpoint con join

#### Regression
- ✓ Test baseline (Fase 0) continuano a passare
- **Verifica**: `npm run test:e2e` exit code == 0

### Dipendenze
- **Richiede**: Fase 0 completata (test baseline esistono)

### Rischi e Mitigazioni
| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Fix introducono nuovi bug | Media | Alto | Test baseline + test specifici per ogni fix |
| Performance regression | Bassa | Medio | Benchmark automatico in CI |
| Modifiche comportamento atteso | Bassa | Alto | Review manuale prima di merge |

### Rilascio
**SÌ** - Sistema più sicuro, corretto e performante. Deploy in produzione dopo QA.

---

## FASE 2: Separazione Architettura 3-Tier

### Obiettivo
Separare responsabilità in layer (Presentation, Business Logic, Data Access) mantenendo comportamento identico.

### Criteri di Accettazione

#### Struttura
- ✓ Directory: `/routes`, `/services`, `/repositories`
- ✓ Naming: `<Entity>Service.js`, `<Entity>Repository.js`
- **Verifica**: `find routes services repositories -name "*.js" | wc -l` > 0

#### Separazione Responsabilità
- ✓ Routes: zero query SQL, zero business logic (max: parse → service call → response)
- ✓ Services: zero query SQL, zero dipendenze Express (req/res)
- ✓ Repositories: SOLO query SQL + mapping, zero business logic
- **Verifica**:
  - `grep -r "SELECT\|INSERT" routes/ services/ | wc -l` == 0
  - `grep -r "SELECT\|INSERT" . --exclude-dir=repositories --exclude-dir=node_modules | wc -l` == 0

#### Dependency Injection
- ✓ Service riceve Repository come dipendenza (costruttore)
- **Verifica**: `grep -r "constructor.*Repository" services/ | wc -l` == numero di Service

#### Testing
- ✓ Test E2E baseline passano (zero regressioni)
- ✓ Test E2E su DB reale via MCP con transazioni rollback
- **Verifica**: `npm run test:e2e` exit code == 0

### Dipendenze
- **Richiede**: Fase 1 completata (bug fixati, altrimenti propagati nel Repository layer)

### Rischi e Mitigazioni
| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Regressione comportamento | Media | Alto | Test baseline before/after |
| Performance degradation (overhead layer) | Bassa | Medio | Benchmark: max +10% latency rispetto Fase 1 |
| Coupling nascosto tra layer | Media | Alto | Code review + ESLint custom rules |

### Rilascio
**SÌ** - Architettura pulita, stesso comportamento. Deploy dopo QA.

---

## FASE 3: Introduzione Query Builder (Knex.js)

### Obiettivo
Sostituire SQL raw con Knex.js per leggibilità, manutenibilità e portabilità DB.

### Criteri di Accettazione

#### Migrazione
- ✓ Tutti i Repository usano Knex invece di SQL raw
- ✓ Knex configurato per SQLite (ambiente corrente)
- ✓ Zero query SQL raw (tranne migration/seed se necessari)
- **Verifica**: `grep -r "db.query\|db.execute" repositories/ | wc -l` == 0

#### Funzionalità
- ✓ CRUD completo per tutte le entità (Customers, Orders, Details)
- ✓ Relazioni gestite (Orders → Details con join)
- ✓ Transazioni supportate (per operazioni multi-table)
- **Verifica**: Test E2E baseline passano

#### Testing
- ✓ Test E2E baseline passano (zero regressioni)
- ✓ Test E2E su DB reale via MCP con transazioni rollback
- **Verifica**: `npm run test:e2e` exit code == 0

### Dipendenze
- **Richiede**: Fase 2 completata (Repository layer pulito e isolato)

### Rischi e Mitigazioni
| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Knex introduce bug (query diverse da SQL raw) | Media | Alto | Confronto query generate con SQL raw originale |
| Performance degradation | Bassa | Medio | Benchmark: max +5% latency rispetto Fase 2 |
| Dipendenza aggiuntiva (Knex) | Bassa | Basso | Knex è stabile, usato in produzione, nessun lock-in DB-specifico |

### Rilascio
**SÌ** - Query più leggibili, DB portabile. Deploy dopo QA.

---

## FASE 4: Unit Test Service Layer

### Obiettivo
Aggiungere unit test sui Service con mock dei Repository per coverage alta e feedback veloce.

### Criteri di Accettazione

#### Coverage
- ✓ Ogni Service ha unit test
- ✓ Coverage Service layer >= 80%
- ✓ Test usano mock/stub dei Repository (zero dipendenze DB)
- **Verifica**: `npm run test:unit -- services/` coverage >= 80%

#### Qualità Test
- ✓ Test coprono happy path + edge case + error handling
- ✓ Mock verificano chiamate corrette al Repository (parametri, count)
- ✓ Test veloci (<100ms totali per suite Service)
- **Verifica**: `npm run test:unit` execution time < 1s

#### Regression
- ✓ Test E2E baseline passano
- **Verifica**: `npm run test:e2e` exit code == 0

### Dipendenze
- **Richiede**: Fase 2 completata (Service layer isolato e testabile)
- **Opzionale**: Fase 3 completata (Repository con Knex più facili da mockare)

### Rischi e Mitigazioni
| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Mock divergono da implementazione reale | Media | Medio | Confronto unit test vs E2E test periodico |
| Coverage bassa non rilevata | Bassa | Medio | CI blocca merge se coverage < 80% |
| Falsa sicurezza (test passano, codice è buggy) | Bassa | Alto | Test E2E obbligatori in aggiunta a unit test |

### Rilascio
**SÌ** - Qualità migliorata, confidence alta per future modifiche. Deploy opzionale (nessun cambiamento funzionale).

---

## FASE 5: Documentazione (JSDoc + OpenAPI)

### Obiettivo
Generare documentazione tecnica completa e sincronizzata con il codice.

### Criteri di Accettazione

#### JSDoc
- ✓ Tutti i Service pubblici documentati con JSDoc
- ✓ Tutti i Repository pubblici documentati con JSDoc
- ✓ Parametri, return types, esempi inclusi
- **Verifica**: ESLint rule `require-jsdoc` attiva, zero warning

#### OpenAPI/Swagger
- ✓ Swagger spec generata per tutti gli endpoint
- ✓ Schema request/response completi
- ✓ Esempi di chiamate inclusi
- ✓ Swagger UI servito su `/api-docs`
- **Verifica**:
  - `npm run swagger:validate` exit code == 0
  - Curl su `http://localhost:3000/api-docs` → 200

#### Sincronizzazione
- ✓ Docs generate automaticamente da codice (non manuali)
- ✓ Hook pre-commit valida docs up-to-date
- **Verifica**: Hook blocca commit se docs non sincronizzati

### Dipendenze
- **Richiede**: Fase 2 completata (architettura stabile da documentare)
- **Opzionale**: Fase 4 completata (esempi da test)

### Rischi e Mitigazioni
| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Docs obsoleti (codice cambia, docs no) | Alta | Medio | Hook pre-commit + CI check |
| Overhead manutenzione | Media | Basso | Docs generate da codice + JSDoc inline |
| Swagger spec incompleta | Bassa | Basso | Validator automatico in CI |

### Rilascio
**SÌ** - Documentazione completa per team e clienti. Deploy opzionale.

---

## Riepilogo Timeline e Rilasci

| Fase | Obiettivo | Rilascio | Valore Business |
|------|-----------|----------|-----------------|
| 0 | Test Baseline | NO | Preparazione |
| 1 | Bug Fix | **SÌ** | +Sicurezza, +Correttezza, +Performance |
| 2 | 3-Tier | **SÌ** | +Manutenibilità, +Scalabilità |
| 3 | Knex.js | **SÌ** | +Leggibilità, +Portabilità DB |
| 4 | Unit Test | **SÌ** | +Qualità, +Confidence |
| 5 | Docs | **SÌ** | +Onboarding, +Collaborazione |

**Durata stimata**: 4-6 sprint (assumendo 1 fase = 1 sprint, Fase 2 potrebbe richiedere 2 sprint)

**Metriche finali**:
- Copertura test: >80% Service layer, 100% endpoint E2E
- Performance: latency <= baseline Fase 1
- Complessità: riduzione ~40% (da spaghetti a layer separati)
- Docs: 100% API documentate
