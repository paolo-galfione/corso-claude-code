# Skill: Modalità Demo per Registrazione

Attiva la modalità DEMO per registrare screencast del corso seguendo RIGOROSAMENTE lo script pianificato.

## Scopo

Quando registri una demo per il corso, Claude Code deve:
- Seguire ESATTAMENTE lo script della demo
- Generare gli errori specificati (non risolverli subito)
- Usare i messaggi e il ragionamento indicati
- Evitare improvvisazioni o soluzioni alternative

## Input

Argomento: nome del modulo (es. `1.1-cambio-di-paradigma`)

## Struttura File Sorgente

Il file traccia `piano-corso/<nome>/<nome>.md` contiene sezioni:

```markdown
## DEMO N: Titolo Demo

**Cosa mostrare**:
1. Azione da eseguire
2. Azione successiva
3. ...

**Punti da evidenziare**:
- Punto importante 1
- Punto importante 2

**Testo da leggere durante la demo**:
"Script per il narratore..."
```

---

## MODALITÀ DEMO ATTIVA

### Istruzioni VINCOLANTI

Quando la modalità demo è attiva per un modulo:

#### 1. SEQUENZA OBBLIGATORIA

- Esegui OGNI azione elencata in `**Cosa mostrare**:` nell'ORDINE ESATTO
- NON saltare passaggi
- NON anticipare soluzioni
- NON aggiungere passaggi extra

#### 2. GESTIONE ERRORI

Se lo script prevede un errore:
- **GENERA** l'errore come specificato
- **MOSTRA** l'errore all'utente
- **ASPETTA** prima di correggerlo (tempo di registrazione)
- **SPIEGA** il ragionamento come indicato in "Punti da evidenziare"
- **CORREGGI** solo quando lo script lo indica

**IMPORTANTE**: Gli errori sono INTENZIONALI per scopo didattico. Non risolverli immediatamente.

#### 3. MESSAGGI E COMUNICAZIONE

- Usa i messaggi suggeriti in `**Testo da leggere durante la demo**:`
- Mantieni il tono educativo e descrittivo
- Mostra il ragionamento esplicitamente
- Commenta ogni azione PRIMA di eseguirla

#### 4. TOOL E COMANDI

- Usa solo i tool necessari per lo script
- Mostra l'output dei comandi nel terminale
- Non nascondere informazioni rilevanti
- Evidenzia i momenti chiave (errore, analisi, correzione, successo)

#### 5. TIMING

- Lascia tempo tra le azioni per la narrazione
- Non eseguire tutto in sequenza rapida
- Attendi conferma implicita prima di correggere errori
- Ricorda: l'utente sta REGISTRANDO, serve tempo per commentare

---

## Comportamento per Tipo di Demo

### Demo "Auto-Correzione"

**Sequenza**:
1. Scrivi codice (con errore intenzionale se previsto)
2. Esegui il codice
3. MOSTRA l'errore senza correggerlo subito
4. SPIEGA cosa è andato storto
5. PROPONI la correzione
6. APPLICA la correzione
7. VERIFICA che funzioni

**Esempio** (da 1.1-cambio-di-paradigma):
```
1. "Scrivo una funzione che legge un file"
   → Scrivi codice con fs.readFileSync senza controllo esistenza
2. "Eseguo il codice"
   → Lancia lo script
3. "Ricevo un errore: file not found"
   → Mostra l'errore, NON correggere
4. "Analizzo: il file non esiste. Posso crearlo o gestire l'errore"
   → Spiega il ragionamento
5. "Correggo aggiungendo controllo try-catch"
   → Applica la correzione
6. "Ri-eseguo per verificare"
   → Verifica successo
```

### Demo "Workflow Multi-Step"

**Sequenza**:
1. Pianifica ad alta voce
2. Esegui primo step
3. Verifica risultato parziale
4. Procedi allo step successivo
5. Mostra come ogni step si basa sul precedente

### Demo "Integrazione Tool"

**Sequenza**:
1. Mostra il problema
2. Identifica quale tool serve
3. Usa il tool
4. Mostra il risultato
5. Spiega perché quel tool era appropriato

---

## Cosa NON Fare in Modalità Demo

❌ **Non improvvisare** soluzioni diverse da quelle previste
❌ **Non ottimizzare** il codice oltre lo script
❌ **Non correggere** errori prima che lo script lo indichi
❌ **Non usare** shortcut o automazioni non previste
❌ **Non saltare** passaggi "ovvi" (sono didattici)
❌ **Non nascondere** output o errori (servono per la registrazione)
❌ **Non aggiungere** spiegazioni non richieste
❌ **Non usare** TodoWrite (distrae dalla demo)

---

## Workflow Demo

Quando l'utente esegue `/demo <nome-modulo>`:

1. **Carica lo script**:
   - Leggi `piano-corso/<nome>/<nome>.md`
   - Identifica tutte le sezioni `## DEMO N:`
   - Estrai: Cosa mostrare, Punti da evidenziare

2. **Comunica il piano**:
   ```
   📹 MODALITÀ DEMO ATTIVA: <nome-modulo>

   Demo trovate:
   1. DEMO 1: <titolo>
      - <azione 1>
      - <azione 2>
      ...

   Pronto per la registrazione. Dimmi quando iniziare.
   ```

3. **Durante la demo**:
   - Segui lo script passo-passo
   - Commenta ogni azione PRIMA di eseguirla
   - Mostra errori senza correggerli immediatamente
   - Spiega il ragionamento come da "Punti da evidenziare"

4. **Fine demo**:
   ```
   ✅ Demo completata secondo lo script.

   Momento chiave mostrati:
   - [x] Errore generato
   - [x] Analisi eseguita
   - [x] Correzione applicata
   - [x] Verifica successo
   ```

---

## Esempio Completo

**Script** (da 1.1-cambio-di-paradigma.md):
```markdown
## DEMO 1: L'Agente che si Auto-Corregge

**Cosa mostrare**:
1. Aprire VS Code con Claude Code attivo
2. Dare a Claude un task che genererà un errore
3. Mostrare come Claude:
   - Scrive il codice
   - Lo esegue
   - Riceve l'errore (file not found)
   - Riconosce il problema
   - Corregge autonomamente
   - Ri-esegue e verifica il successo

**Punti da evidenziare**:
- Claude non si ferma all'errore
- Non chiede "cosa devo fare?"
- Analizza l'errore, propone e applica la correzione
```

**Esecuzione in Modalità Demo**:

```
Claude: 📹 MODALITÀ DEMO ATTIVA
Demo 1: L'Agente che si Auto-Corregge

Sequenza prevista:
1. Scrivere codice che legge file inesistente
2. Eseguire e ricevere errore
3. Analizzare e correggere
4. Verificare successo

---

Claude: "Scrivo una funzione che legge un file config.json e stampa il contenuto"

[Scrive codice con fs.readFileSync senza try-catch]

---

Claude: "Eseguo il codice"

[Lancia con node index.js]
[Errore: Error: ENOENT: no such file or directory]

---

Claude: "Ho ricevuto un errore: il file config.json non esiste.
Invece di fermarmi, analizzo il problema:
- Opzione 1: Creare il file
- Opzione 2: Gestire l'errore con try-catch

Scelgo l'opzione 2 per robustezza."

---

Claude: "Correggo il codice aggiungendo gestione errore"

[Modifica con try-catch e messaggio user-friendly]

---

Claude: "Ri-eseguo per verificare la correzione"

[Lancia di nuovo]
[Output: "File config.json non trovato. Uso configurazione di default."]

✅ "La correzione funziona. L'agente ha gestito l'errore autonomamente."
```

---

## Verifica Conformità

Dopo ogni demo, verifica:

- [ ] Tutte le azioni previste sono state eseguite
- [ ] Gli errori sono stati mostrati PRIMA della correzione
- [ ] Il ragionamento è stato esplicitato
- [ ] I momenti chiave sono stati evidenziati
- [ ] Non ci sono state improvvisazioni
- [ ] Il timing ha permesso la narrazione

---

## Note Importanti

1. **La demo è didattica, non performativa**: L'obiettivo non è mostrare quanto sei veloce o bravo, ma INSEGNARE il concetto
2. **Gli errori sono preziosi**: Sono la parte più importante della demo, mostrano il loop agentico
3. **La narrazione ha priorità**: Lascia tempo all'utente di commentare ogni passaggio
4. **Lo script è la bibbia**: Non deviare, anche se vedi modi "migliori"

---

## Uscita dalla Modalità Demo

La modalità demo resta attiva finché:
- Tutte le demo dello script sono completate, OPPURE
- L'utente esegue un altro comando, OPPURE
- L'utente dice esplicitamente "fine demo"

Per uscire manualmente: l'utente può dire "disattiva modalità demo".
