# Skill: Modalità Demo per Registrazione

Attiva la modalità DEMO per registrare screencast del corso seguendo RIGOROSAMENTE lo script pianificato.

## Scopo

Quando registri una demo per il corso, Claude Code deve:
- Seguire ESATTAMENTE lo script della demo
- Generare gli errori specificati (non risolverli subito)
- Usare i messaggi e il ragionamento indicati
- Evitare improvvisazioni o soluzioni alternative

## Input

Argomenti:
- `<nome-modulo>`: nome del modulo (es. `1.1-cambio-di-paradigma`)
- `[numero-demo]`: (opzionale) numero della demo da eseguire (es. `2` per partire dalla DEMO 2)

Esempi:
- `/demo 6.1-identificazione-fix-bug` → tutte le demo del modulo
- `/demo 6.1-identificazione-fix-bug 2` → solo DEMO 2 del modulo

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

#### 3. MESSAGGI E COMUNICAZIONE (per sviluppatori esperti)

- **Conciso e tecnico**: elimina frasi narrative ("Invece di fermarmi...", "Analizzo il problema...")
- **Bullet point essenziali**: raggiunamento in 1-2 righe max
- **Mostra, non raccontare**: lascia che il codice e l'output parlino
- **Commenta azioni solo quando non ovvie**: sviluppatori esperti capiscono i tool base

#### 4. TOOL E COMANDI

- Usa solo i tool necessari per lo script
- Mostra l'output dei comandi nel terminale
- Non nascondere informazioni rilevanti
- Evidenzia i momenti chiave (errore, analisi, correzione, successo)

#### 5. TIMING

- Lascia tempo tra le azioni per la narrazione
- Non eseguire tutto in sequenza troppo rapida
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

## Stile Output per Sviluppatori Esperti

Il pubblico è composto da sviluppatori con notevole esperienza. Adatta lo stile di conseguenza:

### ✅ FARE:
- Output tecnico e diretto
- Mostrare codice e output senza preamboli
- Commento essenziale in 1 riga quando necessario
- Lasciare che errori e fix parlino da soli
- Usare terminologia tecnica senza semplificazioni

### ❌ NON FARE:
- Frasi narrative ("Ora vediamo...", "Cosa succede se...", "Interessante...")
- Spiegazioni didascaliche ("Invece di fermarmi...", "Analizzo il problema...")
- Ripetere l'ovvio ("Eseguo il codice", "Apro il file")
- Liste prolisse di opzioni
- Tono da tutorial per principianti

### Esempio di stile SBAGLIATO (troppo verboso):
```
"Ora scrivo una funzione che legge un file. Uso fs.readFileSync
per semplicità. Vediamo cosa succede quando lo eseguo..."

[Esegue]

"Ho ricevuto un errore! Il file non esiste. Invece di fermarmi,
analizzo il problema. Ci sono due opzioni:
1. Creare il file mancante
2. Gestire l'errore con try-catch
Scelgo la seconda opzione perché è più robusta."
```

### Esempio di stile CORRETTO (asciutto):
```
[Scrive codice con fs.readFileSync]
[Esegue → Error: ENOENT]

File mancante. Gestisco con try-catch.

[Fix con error handling]
[Ri-esegue → funziona]
```

---

## Cosa NON Fare in Modalità Demo

❌ **Non improvvisare** soluzioni diverse da quelle previste
❌ **Non ottimizzare** il codice oltre lo script
❌ **Non correggere** errori prima che lo script lo indichi
❌ **Non usare** shortcut o automazioni non previste
❌ **Non saltare** passaggi anche se ovvi
❌ **Non nascondere** output o errori
❌ **Non aggiungere** narrazione ("Ora faccio...", "Vediamo...")
❌ **Non usare** TodoWrite (distrae dalla demo)
❌ **Non spiegare tool base** (Read, Edit, Bash - sono ovvi per esperti)

---

## Workflow Demo

Quando l'utente esegue `/demo <nome-modulo> [numero-demo]`:

1. **Carica lo script**:
   - Leggi `piano-corso/<nome>/<nome>.md`
   - Identifica tutte le sezioni `## DEMO N:`
   - Se `[numero-demo]` è specificato, seleziona solo quella demo
   - Estrai: Cosa mostrare, Punti da evidenziare

2. **Output PULITO per registrazione**:

   Rispondi SOLO con:
   ```
   ▶ DEMO <N>: <titolo>
   ```

   Poi ATTENDI "via" dall'utente prima di procedere.

3. **Durante la demo**:
   - Esegui lo script passo-passo
   - Output tecnico e asciutto (max 1-2 righe di contesto)
   - Mostra errori → ragionamento essenziale → fix
   - Evita narrazione ("Ora faccio...", "Vediamo cosa succede...")

4. **Fine demo**:
   - Se ci sono altre demo: `▶ DEMO <N+1>: <titolo>`
   - Se è l'ultima: `✅`

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

**Esecuzione in Modalità Demo (stile sviluppatori esperti)**:

```
Utente: /demo 1.1-cambio-di-paradigma 1

Claude: ▶ DEMO 1: L'Agente che si Auto-Corregge

Utente: via

Claude: [Scrive codice con fs.readFileSync senza try-catch]

Claude: [Lancia con node index.js]
Error: ENOENT: no such file or directory, open 'config.json'

Claude: File mancante. Gestisco con try-catch invece di creare file.

Claude: [Modifica con try-catch e fallback]

Claude: [Ri-esegue]
> File config.json non trovato. Uso configurazione di default.

✅
```

**Nota**: Output minimale, tecnico, zero narrazione. L'utente può commentare dal vivo durante la registrazione.

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
