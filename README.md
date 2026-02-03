# Corso Claude Code per Team di Sviluppo

## Requisiti

Il devcontainer installa automaticamente:
- Chromium (per generazione PDF/immagini)
- Marp CLI (conversione slide)
- Mermaid CLI (diagrammi)

## Struttura

```
slides/          # Markdown delle slide (frontmatter Marp)
diagrams/        # File .mmd Mermaid
themes/          # Theme CSS personalizzato (corso.css)
output/          # PDF e JPG generati (in .gitignore)
.claude/commands/  # Skill per Claude Code
```

## Come usare

### 1. Convertire diagrammi Mermaid in SVG

```bash
mmdc -p puppeteer-config.json -i diagrams/nome.mmd -o diagrams/nome.svg
```

### 2. Generare PDF (con tema Zucchetti)

```bash
marp --theme-set themes/ --pdf --allow-local-files -o output/nome.pdf slides/nome.md
```

### 3. Generare JPG (una per slide)

```bash
marp --theme-set themes/ --images jpeg --allow-local-files -o output/nome slides/nome.md
```

I file JPG vengono creati come `output/nome.001.jpg`, `nome.002.jpg`, etc.

### 4. Workflow completo

```bash
# Converti tutti i diagrammi
for f in diagrams/*.mmd; do
  mmdc -p puppeteer-config.json -i "$f" -o "${f%.mmd}.svg"
done

# Genera PDF e JPG per tutte le slide
for f in slides/*.md; do
  name=$(basename "$f" .md)
  marp --theme-set themes/ --pdf --allow-local-files -o "output/${name}.pdf" "$f"
  marp --theme-set themes/ --images jpeg --allow-local-files -o "output/${name}" "$f"
done
```

## Theme Zucchetti

Il tema `corso.css` implementa il design system aziendale:

- **Colore primario**: Blu Zucchetti `#3366CC`
- **Palette secondaria**: Teal `#102D27` → `#9AD2C7`

### Classi disponibili

| Classe | Uso |
|--------|-----|
| `title` | Prima slide (sfondo teal scuro) |
| `section` | Separatore modulo (sfondo blu) |
| `diagram` | Diagrammi ASCII |
| `demo` | Istruzioni demo |
| `takeaway` | Punti chiave finali |

### Formato slide

```markdown
---
marp: true
theme: corso
paginate: true
---

<!-- _class: title -->

# Titolo Screencast

Sottotitolo

---

## Slide Standard

- Punto 1
- Punto 2

---
<!-- _class: demo -->

## Nome Demo

1. Primo passo
2. Secondo passo
```

## Includere diagrammi Mermaid

1. Crea il file `.mmd` in `diagrams/`
2. Converti in SVG con `mmdc`
3. Includi nella slide:

```markdown
![Descrizione](../diagrams/nome.svg)
```

## Skill Claude Code

Lo skill `/genera-slide` guida la conversione delle tracce in `piano-corso/` in slide Marp.

Vedi `.claude/commands/genera-slide.md` per le regole complete.
