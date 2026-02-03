# corso-claude-code
Corso su Claude Code progettato per Team di sviluppo professionali

Vorrei progettare un corso su Claude Code 2.x per Team di sviluppo con lo scopo di cambiare il modello organizzativo dei team partendo dal presupposto che questo approccio agentico permette di riorganizzare i team nei seguenti ruoli::

Product Owner (flusso Uomo > Agente): definisce le specifiche delle soluzioni in maniera incrementale, usa Claude come supporto per analizzare possibili soluzioni, best practice, validazione e controllo della documetazione ect
Architetto del software (flusso Uomo > Agente): definisce gli standard dell'ambiente agentico attraverso la creazione di Agenti dedicati ai vari ambiti di sviluppo, skills di Claude, Hook e Commands personalizzati. A titolo di esempio le applicazioni front-end in angular devono garantire un medesimo design-system, uno stesso stile di programmazione e organizzazione dei progetti. L'architetto crea gli strumenti attraverso dei POC e poi li rende disponibili attraverso dei pacchetti ve aggiornano l'ambiente dei colleghi
Analista funzionale (flusso Agente > Uomo): Sulla base delle nuove rischieste e degli standard di sviluppo definiti dall'Architeto, Claude genera i documenti con le fasi e le specifiche operative per gli agenti AI che si occuperanno di tutto il processo di scrittura del software. L'analista partirà dal lavoro di Cloude per integrarlo o modificarlo
Sviluppatori e DevOps (Flusso Agente supervisionato da Uomo): il livello produttivo viene coperto interamente da agenti specializzati

Il corso deve essere articolato in moduli della durata massima di 10 minuti che coprano, dopo una parte teorica generale sull'architetura e il flusso di lavoro di Claude Code, tutti gli strumenti che Claude mette a disposizione per i vari ruoli del Team.

Come applicazione di appoggio pensavo di usare un backend realizzato in express volutamente spaghetti code, mettendo tutto il codice in un unico sorgente con metodi API che contengano sia la gestione delle chiamate rest, che la logica di validazione che di business, più la persistenza su DB SQLite 3.
Il DB da usare sarebbe il classico Northwind che è possibile trovare qui

Inizierei sviluppando la struttura del corso:
parte teorica introduttiva
parte pratica in cui viene mostrato come costruire un percorso di analisi del refactoring del codice seguendo le best practice: separazione in più sorgenti, divisione delle responsabilità, introduzione di un semplice orm

Il metodo per verificare la consistenza tra l'applicazione legacy e questa in via di ristrutturazione è la creazione di una serie di test basati sulle chiamate API che verifichino che le stesse chiamate con gli stessi parametri diano gli stessi risultati

una volta steso il programma e lo script del corso con i casi d'uso di refactoring da far fare a Claude Code e da mostrare nella registrazione del corso, sempre Claude code genererà il backend su cui fare il refactoring

Il corso sarà strutturato con degli screencast della durata massima di 10 minuti ciascuno
Alterneremo slide e demo live
Per visualizzare il DB cerca la migliore estensione VS code per visualizzare db sqlite 3
Per testare a mano le chiamate rest API cerca la migliore estensione VS code adatta allo scopo
