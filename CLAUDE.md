# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Descrizione Progetto

Repository per un corso su Claude Code 2.x destinato a team di sviluppo professionali. Il corso è composto da screencast (max 10 minuti) che alternano slide Marp e demo live.


## Comandi Principali

### Diagrammi Mermaid → SVG
```bash
mmdc -p puppeteer-config.json -i piano-corso/<nome>/diagrammi/file.mmd -o piano-corso/<nome>/diagrammi/file.svg
```

### Slide → PDF
```bash
marp --theme-set piano-corso/themes/ --pdf --allow-local-files -o piano-corso/<nome>/<nome>-marp.pdf piano-corso/<nome>/<nome>-marp.md
```

### Slide → JPG (per verifica visiva)
```bash
marp --theme-set piano-corso/themes/ --images jpeg --allow-local-files -o piano-corso/<nome>/output piano-corso/<nome>/<nome>-marp.md
```

## Struttura Repository

```
piano-corso/
├── themes/                    # Tema CSS e logo (corso.css, logo_zucchetti.svg)
├── <modulo>/                  # Es: 1.1-cambio-di-paradigma/
│   ├── <modulo>.md            # Script screencast (sorgente)
│   ├── <modulo>-marp.md       # Slide Marp (generato)
│   ├── <modulo>-marp.pdf      # PDF finale
│   └── diagrammi/             # File .mmd e .svg
```

## Skill Claude Code

### `/genera-slide <nome-modulo>`

Converte uno script screencast in slide Marp. Esempio: `/genera-slide 1.1-cambio-di-paradigma`

Lo skill:
1. Legge la traccia da `piano-corso/<nome>/<nome>.md`
2. Estrae solo il contenuto delle slide (ignora testo narratore)
3. Converte diagrammi ASCII in Mermaid con palette blu Zucchetti
4. Genera `<nome>-marp.md` e PDF

### `/demo <nome-modulo>`

Attiva la modalità DEMO per registrare screencast seguendo lo script. Esempio: `/demo 1.1-cambio-di-paradigma`

Lo skill:
1. Legge lo script della demo da `piano-corso/<nome>/<nome>.md`
2. Estrae le sezioni `## DEMO N:` con azioni da eseguire
3. Configura Claude per seguire RIGIDAMENTE lo script (no improvvisazioni)
4. Genera errori intenzionali come previsto (per scopo didattico)
5. Mostra il loop di auto-correzione commentando ogni passaggio

### Classi CSS Marp disponibili

| Classe | Uso |
|--------|-----|
| `title` | Prima slide (sfondo blu gradient) |
| `section` | Separatore modulo |
| `diagram` | Slide con diagrammi Mermaid |
| `demo` | Istruzioni demo |
| `takeaway` | Punti chiave finali |

### Palette colori Zucchetti

- Blu principale: `#0069b4`
- Blu scuro: `#005291`
- Blu sfondo: `#e6f3fa`

## Convenzioni Linguistiche

- Scrivi i contenuti del corso in italiano
- Sostituire "trade-off" con "compromesso"
- I termini tecnici di uso comune tra sviluppatori restano in inglese (refactoring, pattern, deploy, commit, ecc.)

## Convenzioni Git

- Messaggi di commit essenziali e sintetici
- Non aggiungere firme Co-Authored-By
- Fai commit di tutti i file modificati
