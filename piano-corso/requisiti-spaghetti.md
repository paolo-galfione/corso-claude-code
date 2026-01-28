# Requisiti per il Backend Spaghetti Code

Questo documento specifica le caratteristiche che il backend legacy deve avere per essere usato nelle demo del corso. Queste specifiche servono a Claude Code per generare il codice spaghetti iniziale.

---

## Struttura Generale

### File Unico
- Tutto il codice in un unico file `app.js`
- Dimensione target: circa 800-1200 righe
- Nessuna separazione di responsabilità
- Import/require tutti in cima, poi tutto il resto mischiato

### Tecnologie
- Node.js con Express
- SQLite 3 con driver `better-sqlite3` (sincrono) o `sqlite3` (callback)
- Database Northwind (standard)

---

## Entità da Implementare

### Customers
Endpoint CRUD completi:
- `GET /customers` - lista con filtri
- `GET /customers/:id` - singolo customer
- `POST /customers` - crea nuovo
- `PUT /customers/:id` - aggiorna
- `DELETE /customers/:id` - elimina

### Orders
Endpoint CRUD completi:
- `GET /orders` - lista con filtri
- `GET /orders/:id` - singolo ordine (con o senza details)
- `POST /orders` - crea nuovo
- `PUT /orders/:id` - aggiorna
- `DELETE /orders/:id` - elimina

### Order Details
Endpoint CRUD:
- `GET /orders/:orderId/details` - dettagli di un ordine
- `POST /orders/:orderId/details` - aggiungi dettaglio
- `PUT /orders/:orderId/details/:productId` - aggiorna
- `DELETE /orders/:orderId/details/:productId` - elimina

---

## Filtri "Pasticciati"

I filtri devono sembrare aggiunti incrementalmente senza un design coerente.

### Customers
```javascript
// Filtri supportati (logica pasticciata)
GET /customers?city=London
GET /customers?country=UK
GET /customers?city=London&country=UK  // AND
GET /customers?contactName=Maria       // LIKE %Maria%
GET /customers?companyName=A           // Inizia con A
GET /customers?search=wine             // Cerca in più campi (inconsistente)
```

### Orders
```javascript
// Filtri con logica inconsistente
GET /orders?customerId=ALFKI
GET /orders?employeeId=5
GET /orders?dateFrom=1997-01-01        // Formato data 1
GET /orders?date_to=1997-12-31         // Formato data 2 (underscore!)
GET /orders?minTotal=100               // Calcolato al volo (lento)
GET /orders?shipped=true               // Boolean come stringa
GET /orders?shipped=1                  // Boolean come numero (entrambi funzionano)
```

---

## Bug da Inserire

### Bug di Sicurezza

#### SQL Injection
```javascript
// BUG: Concatenazione diretta
app.get('/customers', (req, res) => {
  const { search } = req.query;
  // VULNERABILE!
  const sql = `SELECT * FROM Customers WHERE CompanyName LIKE '%${search}%'`;
  db.all(sql, ...);
});
```

#### Mancata Validazione Input
```javascript
// BUG: Nessuna validazione
app.post('/customers', (req, res) => {
  // Inserisce direttamente senza validare
  const sql = `INSERT INTO Customers VALUES (...)`;
});
```

### Bug Logici

#### Filtro con Campo Sbagliato
```javascript
// BUG: Copia-incolla sbagliato
if (city) query += ` AND City = '${city}'`;
if (country) query += ` AND City = '${country}'`;  // Dovrebbe essere Country!
```

#### Data Parsing Errato
```javascript
// BUG: Parsing data inconsistente
if (dateFrom) {
  // A volte funziona, a volte no a seconda del formato
  query += ` AND OrderDate >= '${dateFrom}'`;
}
```

#### Edge Case Non Gestito
```javascript
// BUG: ID non esistente non gestito correttamente
app.get('/customers/:id', (req, res) => {
  db.get(`SELECT * FROM Customers WHERE CustomerID = ?`, [req.params.id], (err, row) => {
    // Se row è undefined, risponde con status 200 e body undefined
    res.json(row);  // Dovrebbe essere 404
  });
});
```

### Bug di Performance

#### N+1 Query
```javascript
// BUG: N+1 query
app.get('/orders', (req, res) => {
  db.all('SELECT * FROM Orders', (err, orders) => {
    // Per ogni ordine, query separata!
    orders.forEach(order => {
      db.get('SELECT CompanyName FROM Customers WHERE CustomerID = ?',
        [order.CustomerID], (err, customer) => {
          order.CustomerName = customer?.CompanyName;
        });
    });
    // Race condition: risponde prima che le query finiscano
    setTimeout(() => res.json(orders), 100);  // "Fix" con timeout...
  });
});
```

#### Query Inefficiente
```javascript
// BUG: Calcolo totale order per filtrare (lentissimo)
if (minTotal) {
  // Carica TUTTI gli ordini, poi filtra in JS
  orders = orders.filter(order => {
    const details = db.all('SELECT * FROM OrderDetails WHERE OrderID = ?', [order.OrderID]);
    const total = details.reduce((sum, d) => sum + d.UnitPrice * d.Quantity, 0);
    return total >= minTotal;
  });
}
```

---

## Stile del Codice "Spaghetti"

### Caratteristiche da Riprodurre

1. **Nomi inconsistenti**
```javascript
const customerId = req.params.id;
const cust_id = req.body.customer_id;
const CustID = row.CustomerID;
```

2. **Mix di callback e promise**
```javascript
// Alcuni endpoint con callback
db.all(sql, (err, rows) => { ... });

// Altri con promise
db.all(sql).then(rows => { ... });
```

3. **Error handling inconsistente**
```javascript
// A volte gestisce errori
if (err) return res.status(500).json({ error: err.message });

// A volte no
db.run(sql);  // Errore ignorato
```

4. **Commenti obsoleti**
```javascript
// TODO: aggiungere validazione (aggiunto 2 anni fa, mai fatto)
// FIX: sistemare questo (quale fix?)
// Questo non dovrebbe servire ma senza non funziona
```

5. **Codice duplicato**
```javascript
// Stesso codice di costruzione query in più endpoint
let sql = 'SELECT * FROM Customers WHERE 1=1';
if (city) sql += ` AND City = '${city}'`;
// ... copiato 5 volte
```

6. **Magic numbers**
```javascript
setTimeout(() => res.json(orders), 100);  // Perché 100?
if (results.length > 999) { ... }  // Perché 999?
```

---

## Requisiti per le Demo

### Demo 1.1 - Auto-correzione
Il codice deve contenere almeno un caso dove:
- Claude fa una modifica
- I test (una volta creati) falliscono
- Claude può identificare e correggere il problema

### Demo 2.1 - Analisi Requisiti
Il codice deve avere problemi evidenti che Claude può identificare:
- Mancanza di separazione
- SQL inline
- Bug visibili nell'analisi

### Demo 5.1 - Test Baseline
Gli endpoint devono:
- Funzionare (pur con bug)
- Avere comportamento deterministico per i test
- Supportare i filtri documentati

### Demo 6.1 - Separazione 3-Tier
Il codice deve avere:
- Logica di business separabile
- Query SQL identificabili
- Validazione input identificabile

### Demo 9.1 - Bug Fixing
I bug devono essere:
- Reali e riproducibili
- Di tutti e tre i tipi (sicurezza, logica, performance)
- Fixabili con modifiche chiare

---

## Database Northwind

### Tabelle Necessarie

```sql
Customers (CustomerID, CompanyName, ContactName, City, Country, ...)
Orders (OrderID, CustomerID, EmployeeID, OrderDate, ShippedDate, ...)
OrderDetails (OrderID, ProductID, UnitPrice, Quantity, Discount)
```

### Dati Minimi
- Almeno 50 customers
- Almeno 200 orders
- Almeno 500 order details
- Diversità nei dati per testare filtri

### Setup Script
Includere script per:
1. Creare il database
2. Caricare i dati Northwind
3. Verificare che tutto sia pronto

---

## File da Generare

```
/backend-legacy/
├── app.js              # Il monolite spaghetti (800-1200 righe)
├── package.json        # Dipendenze minime
├── database/
│   ├── northwind.db    # Database SQLite popolato
│   └── setup.sql       # Script di setup (opzionale)
└── README.md           # Come avviare
```

---

## Checklist Finale

Prima di usare il backend nelle demo, verificare:

- [ ] `npm start` avvia il server senza errori
- [ ] Tutti gli endpoint CRUD funzionano
- [ ] I filtri "pasticciati" funzionano (anche se male)
- [ ] Il bug SQL injection è presente e sfruttabile
- [ ] Il bug del filtro country esiste
- [ ] Il bug N+1 è presente
- [ ] Il bug del timeout è presente
- [ ] Il database ha dati sufficienti
- [ ] Il codice è leggibile (seppur brutto)
- [ ] Nessun crash inaspettato durante uso normale

---

## Note per la Generazione

Quando si chiede a Claude di generare questo backend:

1. **Non troppo rotto**: Deve funzionare per le demo
2. **Abbastanza rotto**: I problemi devono essere evidenti
3. **Realistico**: Deve sembrare codice legacy vero
4. **Documentato internamente**: Commenti che aiutino a capire cosa fa

Prompt suggerito:
```
Genera un backend Express.js "spaghetti code" per il database Northwind
seguendo le specifiche in requisiti-spaghetti.md. Il codice deve:
- Funzionare correttamente per l'uso base
- Contenere i bug specificati
- Sembrare codice legacy realistico
- Essere in un unico file app.js
```
