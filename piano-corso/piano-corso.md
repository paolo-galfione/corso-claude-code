# Piano del Corso: Claude Code per Team di Sviluppo

## Obiettivo del Corso

Trasformare il modello organizzativo dei team di sviluppo attraverso l'approccio agentico di Claude Code, passando dal paradigma "AI come assistente" al paradigma "AI come agente autonomo con supervisione umana graduata".

Il corso è **ispirazionale, non operativo**: fornisce esempi concreti per stimolare l'approfondimento autonomo dei partecipanti.

---

## Pubblico Target

- **Profilo**: Sviluppatori professionisti, tech lead, architetti software
- **Prerequisiti**: Conoscenza di Git, VS Code, terminale, JavaScript/Node.js
- **Modalità adozione**: Evangelisti che diffonderanno l'approccio nei rispettivi team

---

## Ruoli del Nuovo Modello Organizzativo

| Ruolo | Flusso | Descrizione |
|-------|--------|-------------|
| **Product Owner** | Uomo → Agente | Definisce specifiche incrementali, usa Claude per analisi soluzioni e validazione documentazione |
| **Architetto Software** | Uomo → Agente | Crea standard dell'ambiente agentico: CLAUDE.md, commands, hooks, MCP servers |
| **Analista Funzionale** | Agente → Uomo | Claude genera piani di lavoro in fasi/rilasci, l'analista integra e modifica |
| **Sviluppatori/DevOps** | Agente ⟷ Uomo | Agenti specializzati supervisionati dall'uomo |

---

## Formato e Strumenti

- **Screencast**: massimo 10 minuti ciascuno
- **Struttura**: slide minimaliste + demo live
- **Slide**: Marp (markdown puro, integrato in VS Code)
- **DB Viewer**: estensione VS Code per SQLite
- **API Testing**: estensione VS Code per REST client
- **Uso**: solo interattivo (no CI/headless)

---

## Traccia del Corso

### MODULO 1: Fondamenti

#### Screencast 1.1: Cambio di Paradigma
**Scopo**: Spiegare la differenza fondamentale tra AI come chat/assistente e AI come agente autonomo

- Da "assistente che risponde" ad "agente che agisce"
- Il loop agentico: pianifica → esegue → verifica → corregge
- L'importanza dell'automazione del workflow di verifica
- Perché gli agenti possono auto-correggersi (demo di errore e correzione automatica)

#### Screencast 1.2: Supervisione Umana Graduata
**Scopo**: Presentare il framework di supervisione che varia per ruolo

- Spettro di supervisione: da alta (PO) a bassa (Dev)
- Come calibrare il livello di autonomia dell'agente
- Trust incrementale: partire con supervisione alta, ridurla con l'esperienza
- I quattro ruoli e il loro posizionamento nello spettro

#### Screencast 1.3: Architettura di Claude Code
**Scopo**: Overview tecnica degli strumenti disponibili

- CLAUDE.md: il contesto persistente del progetto
- Custom Commands e Skills: automazione di task ripetitivi
- Hooks: trigger automatici su eventi
- MCP Servers: estensione delle capacità dell'agente
- Plan Mode: pianificazione strutturata (strumento trasversale a tutti i ruoli)

---

### MODULO 2: Il Product Owner

#### Screencast 2.1: Analisi dei Requisiti con Claude
**Scopo**: Mostrare come il PO può usare Claude per esplorare soluzioni

- Presentazione del caso: backend Express "spaghetti code" da refactorare
- Analisi del codice legacy con Claude
- Esplorazione di possibili approcci di refactoring
- Valutazione trade-off delle soluzioni

#### Screencast 2.2: Validazione e Criteri di Accettazione
**Scopo**: Usare Claude per definire criteri di qualità misurabili

- Generazione di criteri di accettazione per il refactoring
- Definizione delle fasi di rilascio incrementale
- Creazione della documentazione dei requisiti
- Validazione della completezza delle specifiche

---

### MODULO 3: L'Architetto Software

#### Screencast 3.1: Configurare CLAUDE.md
**Scopo**: Creare il contesto condiviso del progetto

- Struttura di un CLAUDE.md efficace
- Definire convenzioni di codice e architettura
- Specificare il design system e gli standard
- Best practice per mantenere il contesto aggiornato

#### Screencast 3.2: Custom Commands e Skills
**Scopo**: Automatizzare task ripetitivi specifici del progetto

- Creare comandi personalizzati per il team
- Definire skills riutilizzabili
- Esempio: comando per generare un nuovo endpoint seguendo gli standard
- Distribuzione dei comandi al team

#### Screencast 3.3: Hooks per l'Automazione
**Scopo**: Configurare trigger automatici per garantire qualità

- Hooks pre-commit: validazione automatica
- Hooks post-generazione: formattazione e linting
- Esempio: hook che esegue test dopo ogni modifica
- Pattern di hooks per il controllo qualità

#### Screencast 3.4: MCP Servers
**Scopo**: Estendere le capacità di Claude con server esterni

- **MCP Filesystem**: permette a Claude di leggere/scrivere file di configurazione, log e asset al di fuori del workspace corrente
- **MCP SQLite**: consente query dirette sul database durante l'analisi, utile per esplorare dati e validare risultati
- **MCP GitHub**: integra operazioni su repository (issues, PR, code review) direttamente nel flusso di lavoro
- Configurazione e uso pratico nel progetto di esempio

#### Screencast 3.5: Subagenti
**Scopo**: Comprendere il ruolo dei subagenti per gestire contesto e specializzazione

- Il problema del contesto che si satura con task eterogenei
- Subagenti come soluzione: contesto pulito e specializzato
- Subagenti espliciti (invocati) vs impliciti (automatici)
- Demo pratica di invocazione subagente
- Subagenti nel corso: Test Agent, Refactoring Agent, Documentation Agent, Code Review Agent
- Parallelizzazione di task indipendenti

---

### MODULO 4: L'Analista Funzionale

#### Screencast 4.1: Generazione del Piano di Lavoro
**Scopo**: Far generare a Claude un piano di refactoring strutturato in fasi

- Input: requisiti del PO + standard dell'Architetto
- Output: piano con fasi distinte = rilasci incrementali
- Uso di Plan Mode per strutturare il lavoro
- Review e integrazione del piano generato

#### Screencast 4.2: Specifiche Operative per gli Agenti
**Scopo**: Tradurre il piano in istruzioni eseguibili

- Dettaglio delle specifiche per ogni fase
- Criteri di verifica per ogni step
- Documentazione delle dipendenze tra fasi
- Handoff agli sviluppatori/agenti

---

### MODULO 5: Sviluppo - Fase 0: Test Baseline

#### Screencast 5.1: Creazione Test API End-to-End
**Scopo**: Creare la baseline di verifica sul codice legacy

- Analisi degli endpoint esistenti (Customers, Orders, Details)
- Generazione automatica di test sulle API
- Cattura dei risultati attesi come "golden master"
- Setup del framework di test

---

### MODULO 6: Sviluppo - Fase 1: Bug Fixing

#### Screencast 6.1: Identificazione e Fix dei Bug
**Scopo**: Mostrare come Claude trova e corregge bug sul codice legacy

- Bug di sicurezza: SQL injection (fix con prepared statements)
- Bug logici: filtri errati, edge case non gestiti
- Bug di performance: N+1 query (fix con JOIN SQL)
- Demo dell'auto-correzione dell'agente

---

### MODULO 7: Sviluppo - Fase 2: Separazione 3-Tier

#### Screencast 7.1: Da Spaghetti a Layered Architecture
**Scopo**: Refactoring verso architettura a 3 livelli

- Identificazione delle responsabilità nel codice legacy
- Estrazione del layer API (route handlers)
- Estrazione del layer Service (business logic)
- Estrazione del layer Repository (data access)
- Verifica con test baseline

---

### MODULO 8: Sviluppo - Fase 3: Introduzione ORM

#### Screencast 8.1: Migrazione a Knex.js
**Scopo**: Sostituire query SQL raw con query builder

- Introduzione a Knex.js (query builder leggibile e semplice)
- Migrazione progressiva dei Repository
- Gestione delle relazioni (Orders → Details)
- Verifica con test baseline

---

### MODULO 9: Sviluppo - Fase 4: Unit Testing

#### Screencast 9.1: Test sui Service Layer
**Scopo**: Aggiungere unit test alla nuova architettura

- Strategia di testing per layer Service
- Mock dei Repository
- Copertura dei casi limite
- Integrazione nel workflow di sviluppo

---

### MODULO 10: Sviluppo - Fase 5: Documentazione

#### Screencast 10.1: Documentazione Automatica
**Scopo**: Generare documentazione di qualità

- JSDoc per il codice sorgente
- OpenAPI/Swagger per le API REST
- Generazione e validazione automatica
- Mantenimento della documentazione sincronizzata

---

### MODULO 11: Conclusioni

#### Screencast 11.1: Retrospettiva e Next Steps
**Scopo**: Consolidare gli apprendimenti e indicare percorsi di approfondimento

- Recap del percorso: da spaghetti code ad architettura pulita
- Metriche del refactoring (linee, complessità, copertura test)
- Come scalare l'approccio nel team
- Risorse per approfondimento

---

## Caso Pratico: Backend Northwind

### Descrizione
Backend Express.js volutamente "spaghetti code":
- Tutto il codice in un unico file
- Mix di routing, validazione, business logic e persistenza
- Query SQL inline
- Nessun test
- Bug intenzionali (logici, sicurezza, performance)

### Database
- SQLite 3 con dataset Northwind
- Entità coinvolte: **Customers**, **Orders**, **Order Details**
- Escluso: ramo Employees

### Caratteristiche del Codice Legacy
- CRUD complete per le tre entità
- Read con filtri "pasticciati" (aggiunti senza criterio)
- Relazioni gestite manualmente
- Nessuna separazione delle responsabilità

### Fasi di Refactoring

| Fase | Obiettivo | Verifica |
|------|-----------|----------|
| 0 | Test API end-to-end (baseline) | Test passano sul legacy |
| 1 | Separazione 3-tier (API/Service/Repository) | Test baseline passano |
| 2 | Introduzione Knex.js nei Repository | Test baseline passano |
| 3 | Unit test sui Service | Copertura > 80% |
| 4 | Fix bug (logici, sicurezza, performance) | Test specifici + baseline |
| 5 | Documentazione (JSDoc + OpenAPI) | Docs generate e validate |

---

## Strumenti Claude Code per Ruolo

| Ruolo | Strumenti Principali |
|-------|---------------------|
| Product Owner | Plan Mode, Chat per analisi |
| Architetto | CLAUDE.md, Commands, Skills, Hooks, MCP, Subagenti |
| Analista | Plan Mode, generazione documenti |
| Sviluppatore | Tutti + Subagenti specializzati (esecuzione supervisionata) |

**Plan Mode**: strumento trasversale usato da tutti i ruoli per strutturare il lavoro.

**Subagenti**: agenti specializzati che mantengono contesto pulito e permettono parallelizzazione.

### Subagenti nel Corso

| Subagente | Specializzazione | Fasi di utilizzo |
|-----------|------------------|------------------|
| Test Agent | Creazione e verifica test | Fase 0, Fase 4 |
| Bug Fix Agent | Sicurezza, logica, performance | Fase 1 |
| Refactoring Agent | Estrazione layer, pattern | Fase 2, Fase 3 |
| Documentation Agent | JSDoc, OpenAPI | Fase 5 |
| Code Review Agent | Qualità, security | Trasversale |

---

## Note Tecniche

### ORM Scelto: Knex.js
Query builder semplice e leggibile, non un ORM completo. Permette di mostrare il pattern Repository senza aggiungere complessità.

```javascript
// Esempio di leggibilità
const customers = await knex('customers')
  .where('city', 'London')
  .orderBy('company_name')
  .select('*');
```

### MCP Servers nel Corso
1. **Filesystem**: operazioni su file esterni al workspace
2. **SQLite**: query dirette per analisi dati
3. **GitHub**: integrazione con repository

### Estensioni VS Code Necessarie
- SQLite Viewer (da identificare la migliore)
- REST Client (da identificare la migliore)
- Marp for VS Code (per le slide)

---

## Requisiti Derivati dalla Sessione Q&A

### Must Have
- [ ] Screencast dedicato a "Cambio di paradigma" + "Supervisione umana graduata"
- [ ] Demo di errori Claude con auto-correzione
- [ ] Piano di lavoro generato in fasi = rilasci
- [ ] Percorso progressivo attraverso tutti i ruoli
- [ ] Slide minimaliste con Marp

### Caratteristiche Demo
- [ ] Backend Express spaghetti code da generare
- [ ] Bug intenzionali: logici, sicurezza, performance
- [ ] Filtri "pasticciati" nelle Read
- [ ] Test baseline come golden master

### Esclusi dal Corso
- Configurazione ambiente (API keys, settings)
- Creazione app da zero (futuro corso)
- Uso in CI/pipeline (solo interattivo)
- Basi di Git, VS Code, terminale

---

## Prossimi Passi

1. **Sessione approfondimento**: definire nel dettaglio il codice spaghetti da generare
2. **Identificare estensioni VS Code**: SQLite viewer e REST client
3. **Creare template Marp**: stile slide del corso
4. **Generare backend legacy**: con Claude Code
5. **Testare il flusso**: dry-run di tutti gli screencast