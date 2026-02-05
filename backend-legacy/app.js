/**
 * Northwind Legacy API
 *
 * Backend per la gestione ordini - versione legacy
 *
 * TODO: Rifattorizzare questo file (nota del 2019)
 * FIXME: Ci sono alcuni problemi di performance (nota del 2020)
 *
 * Questo codice funziona, non toccarlo se non sai cosa fai!
 */

const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

// Configurazione
const app = express();
const PORT = process.env.PORT || 3000;

// Il database è nella cartella db/ del progetto principale
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'db', 'northwind.db');

// Connessione database
let db;
try {
  db = new Database(DB_PATH);
  console.log('Database connesso:', DB_PATH);
} catch (err) {
  console.error('Errore connessione database:', err.message);
  process.exit(1);
}

// Middleware
app.use(express.json());

// Logger semplice (aggiunto in fretta per debug)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ============================================
// CUSTOMERS ENDPOINTS
// ============================================

// GET tutti i customers con filtri
// Nota: i filtri sono stati aggiunti nel tempo, la logica è un po' incasinata
app.get('/customers', (req, res) => {
  try {
    const { city, country, contactName, companyName, search } = req.query;

    // Costruzione query dinamica
    let sql = 'SELECT * FROM Customers WHERE 1=1';

    // Filtro per città
    if (city) {
      sql += ` AND City = '${city}'`;
    }

    // Filtro per paese
    // BUG: copia-incolla sbagliato, usa City invece di Country!
    if (country) {
      sql += ` AND City = '${country}'`;
    }

    // Filtro per nome contatto (LIKE)
    if (contactName) {
      sql += ` AND ContactName LIKE '%${contactName}%'`;
    }

    // Filtro per nome azienda (inizia con)
    if (companyName) {
      sql += ` AND CompanyName LIKE '${companyName}%'`;
    }

    // Ricerca generica - BUG: SQL INJECTION!
    // TODO: sistemare questa cosa (mai fatto)
    if (search) {
      sql += ` AND (CompanyName LIKE '%${search}%' OR ContactName LIKE '%${search}%' OR City LIKE '%${search}%')`;
    }

    const customers = db.prepare(sql).all();
    res.json(customers);

  } catch (err) {
    console.error('Errore GET /customers:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET singolo customer
app.get('/customers/:id', (req, res) => {
  const customerId = req.params.id;

  try {
    const sql = `SELECT * FROM Customers WHERE CustomerID = ?`;
    const customer = db.prepare(sql).get(customerId);

    // BUG: non gestisce il caso in cui customer non esiste
    // Ritorna 200 con undefined invece di 404
    res.json(customer);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST nuovo customer
app.post('/customers', (req, res) => {
  // Nessuna validazione dell'input - va bene così per ora
  const {
    CustomerID, CompanyName, ContactName, ContactTitle,
    Address, City, Region, PostalCode, Country, Phone, Fax
  } = req.body;

  // Verifica solo CustomerID perché è la PK
  if (!CustomerID) {
    return res.status(400).json({ error: 'CustomerID è obbligatorio' });
  }

  try {
    const sql = `
      INSERT INTO Customers (CustomerID, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.prepare(sql).run(
      CustomerID, CompanyName, ContactName, ContactTitle,
      Address, City, Region, PostalCode, Country, Phone, Fax
    );

    // Ritorna il customer creato
    const created = db.prepare('SELECT * FROM Customers WHERE CustomerID = ?').get(CustomerID);
    res.status(201).json(created);

  } catch (err) {
    // Errore generico, potrebbe essere duplicato o altro
    res.status(500).json({ error: err.message });
  }
});

// PUT aggiorna customer
app.put('/customers/:id', (req, res) => {
  const cust_id = req.params.id; // Naming diverso da sopra...
  const data = req.body;

  try {
    // Verifica che esista
    const existing = db.prepare('SELECT * FROM Customers WHERE CustomerID = ?').get(cust_id);
    if (!existing) {
      // Almeno qui gestiamo il 404...
      return res.status(404).json({ error: 'Customer non trovato' });
    }

    // Aggiorna solo i campi passati
    // Questo codice è brutto ma funziona
    let updates = [];
    let values = [];

    if (data.CompanyName !== undefined) { updates.push('CompanyName = ?'); values.push(data.CompanyName); }
    if (data.ContactName !== undefined) { updates.push('ContactName = ?'); values.push(data.ContactName); }
    if (data.ContactTitle !== undefined) { updates.push('ContactTitle = ?'); values.push(data.ContactTitle); }
    if (data.Address !== undefined) { updates.push('Address = ?'); values.push(data.Address); }
    if (data.City !== undefined) { updates.push('City = ?'); values.push(data.City); }
    if (data.Region !== undefined) { updates.push('Region = ?'); values.push(data.Region); }
    if (data.PostalCode !== undefined) { updates.push('PostalCode = ?'); values.push(data.PostalCode); }
    if (data.Country !== undefined) { updates.push('Country = ?'); values.push(data.Country); }
    if (data.Phone !== undefined) { updates.push('Phone = ?'); values.push(data.Phone); }
    if (data.Fax !== undefined) { updates.push('Fax = ?'); values.push(data.Fax); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nessun campo da aggiornare' });
    }

    values.push(cust_id);
    const sql = `UPDATE Customers SET ${updates.join(', ')} WHERE CustomerID = ?`;

    db.prepare(sql).run(...values);

    // Ritorna customer aggiornato
    const updated = db.prepare('SELECT * FROM Customers WHERE CustomerID = ?').get(cust_id);
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE customer
app.delete('/customers/:id', (req, res) => {
  const id = req.params.id;

  try {
    // Verifica esistenza
    const existing = db.prepare('SELECT CustomerID FROM Customers WHERE CustomerID = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Customer non trovato' });
    }

    // Verifica se ha ordini (non possiamo cancellare se ha ordini)
    const ordersCount = db.prepare('SELECT COUNT(*) as count FROM Orders WHERE CustomerID = ?').get(id);

    if (ordersCount.count > 0) {
      return res.status(400).json({
        error: 'Impossibile eliminare: il customer ha ordini associati',
        ordersCount: ordersCount.count
      });
    }

    db.prepare('DELETE FROM Customers WHERE CustomerID = ?').run(id);

    res.json({ message: 'Customer eliminato', id: id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================
// ORDERS ENDPOINTS
// ============================================

// GET tutti gli ordini
// ATTENZIONE: questo endpoint ha problemi di performance!
app.get('/orders', (req, res) => {
  try {
    const { customerId, employeeId, dateFrom, date_to, minTotal, shipped } = req.query;

    let sql = 'SELECT * FROM Orders WHERE 1=1';
    let params = [];

    // Filtro customer
    if (customerId) {
      sql += ' AND CustomerID = ?';
      params.push(customerId);
    }

    // Filtro employee
    if (employeeId) {
      sql += ' AND EmployeeID = ?';
      params.push(employeeId);
    }

    // Filtro data da (formato 1)
    if (dateFrom) {
      sql += ' AND OrderDate >= ?';
      params.push(dateFrom);
    }

    // Filtro data a (formato 2 con underscore - inconsistente!)
    if (date_to) {
      sql += ' AND OrderDate <= ?';
      params.push(date_to);
    }

    // Filtro shipped (accetta sia 'true' che '1')
    if (shipped !== undefined) {
      if (shipped === 'true' || shipped === '1') {
        sql += ' AND ShippedDate IS NOT NULL';
      } else if (shipped === 'false' || shipped === '0') {
        sql += ' AND ShippedDate IS NULL';
      }
    }

    let orders = db.prepare(sql).all(...params);

    // BUG N+1: Per ogni ordine facciamo una query per prendere il nome del customer
    // Questo è MOLTO lento con tanti ordini!
    orders = orders.map(order => {
      const customer = db.prepare('SELECT CompanyName FROM Customers WHERE CustomerID = ?').get(order.CustomerID);
      order.CustomerName = customer ? customer.CompanyName : null;
      return order;
    });

    // Filtro minTotal - BUG PERFORMANCE!
    // Calcoliamo il totale per ogni ordine in JS invece che in SQL
    // Questo è lentissimo!
    if (minTotal) {
      const minTotalNum = parseFloat(minTotal);
      orders = orders.filter(order => {
        // Query per ogni ordine... N+1 di nuovo!
        const details = db.prepare('SELECT UnitPrice, Quantity, Discount FROM [Order Details] WHERE OrderID = ?').all(order.OrderID);
        const total = details.reduce((sum, d) => {
          return sum + (d.UnitPrice * d.Quantity * (1 - d.Discount));
        }, 0);
        order.Total = total; // Aggiungiamo il totale calcolato
        return total >= minTotalNum;
      });
    }

    // Limita risultati per evitare problemi (magic number!)
    if (orders.length > 999) {
      orders = orders.slice(0, 999);
    }

    res.json(orders);

  } catch (err) {
    console.error('Errore GET /orders:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET singolo ordine
app.get('/orders/:id', (req, res) => {
  const OrderID = req.params.id;
  const includeDetails = req.query.includeDetails === 'true';

  try {
    const order = db.prepare('SELECT * FROM Orders WHERE OrderID = ?').get(OrderID);

    // BUG: come per customers, non gestiamo il 404
    if (!order) {
      // Qui lo gestiamo... a volte sì a volte no
      return res.status(404).json({ error: 'Ordine non trovato' });
    }

    // Aggiungi nome customer
    const customer = db.prepare('SELECT CompanyName FROM Customers WHERE CustomerID = ?').get(order.CustomerID);
    order.CustomerName = customer ? customer.CompanyName : null;

    // Opzionalmente include i dettagli
    if (includeDetails) {
      const details = db.prepare(`
        SELECT od.*, p.ProductName
        FROM [Order Details] od
        LEFT JOIN Products p ON od.ProductID = p.ProductID
        WHERE od.OrderID = ?
      `).all(OrderID);
      order.Details = details;
    }

    res.json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST nuovo ordine
app.post('/orders', (req, res) => {
  const orderData = req.body;

  // Validazione minima
  if (!orderData.CustomerID) {
    return res.status(400).json({ error: 'CustomerID obbligatorio' });
  }

  // Verifica che il customer esista
  const customerExists = db.prepare('SELECT 1 FROM Customers WHERE CustomerID = ?').get(orderData.CustomerID);
  if (!customerExists) {
    return res.status(400).json({ error: 'Customer non esiste' });
  }

  try {
    // Imposta data ordine se non specificata
    const orderDate = orderData.OrderDate || new Date().toISOString().split('T')[0];

    const sql = `
      INSERT INTO Orders (CustomerID, EmployeeID, OrderDate, RequiredDate, ShippedDate, ShipVia, Freight, ShipName, ShipAddress, ShipCity, ShipRegion, ShipPostalCode, ShipCountry)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = db.prepare(sql).run(
      orderData.CustomerID,
      orderData.EmployeeID || null,
      orderDate,
      orderData.RequiredDate || null,
      orderData.ShippedDate || null,
      orderData.ShipVia || null,
      orderData.Freight || 0,
      orderData.ShipName || null,
      orderData.ShipAddress || null,
      orderData.ShipCity || null,
      orderData.ShipRegion || null,
      orderData.ShipPostalCode || null,
      orderData.ShipCountry || null
    );

    const newOrderId = result.lastInsertRowid;

    // Ritorna l'ordine creato
    const created = db.prepare('SELECT * FROM Orders WHERE OrderID = ?').get(newOrderId);
    res.status(201).json(created);

  } catch (err) {
    console.error('Errore creazione ordine:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT aggiorna ordine
app.put('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const data = req.body;

  // Verifica esistenza
  const existing = db.prepare('SELECT * FROM Orders WHERE OrderID = ?').get(orderId);
  if (!existing) {
    return res.status(404).json({ error: 'Ordine non trovato' });
  }

  try {
    // Stesso pattern brutto di customers
    let updates = [];
    let values = [];

    if (data.CustomerID !== undefined) { updates.push('CustomerID = ?'); values.push(data.CustomerID); }
    if (data.EmployeeID !== undefined) { updates.push('EmployeeID = ?'); values.push(data.EmployeeID); }
    if (data.OrderDate !== undefined) { updates.push('OrderDate = ?'); values.push(data.OrderDate); }
    if (data.RequiredDate !== undefined) { updates.push('RequiredDate = ?'); values.push(data.RequiredDate); }
    if (data.ShippedDate !== undefined) { updates.push('ShippedDate = ?'); values.push(data.ShippedDate); }
    if (data.ShipVia !== undefined) { updates.push('ShipVia = ?'); values.push(data.ShipVia); }
    if (data.Freight !== undefined) { updates.push('Freight = ?'); values.push(data.Freight); }
    if (data.ShipName !== undefined) { updates.push('ShipName = ?'); values.push(data.ShipName); }
    if (data.ShipAddress !== undefined) { updates.push('ShipAddress = ?'); values.push(data.ShipAddress); }
    if (data.ShipCity !== undefined) { updates.push('ShipCity = ?'); values.push(data.ShipCity); }
    if (data.ShipRegion !== undefined) { updates.push('ShipRegion = ?'); values.push(data.ShipRegion); }
    if (data.ShipPostalCode !== undefined) { updates.push('ShipPostalCode = ?'); values.push(data.ShipPostalCode); }
    if (data.ShipCountry !== undefined) { updates.push('ShipCountry = ?'); values.push(data.ShipCountry); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nessun campo da aggiornare' });
    }

    values.push(orderId);
    const sql = `UPDATE Orders SET ${updates.join(', ')} WHERE OrderID = ?`;

    db.prepare(sql).run(...values);

    const updated = db.prepare('SELECT * FROM Orders WHERE OrderID = ?').get(orderId);
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE ordine
app.delete('/orders/:id', (req, res) => {
  const ORDER_ID = req.params.id; // Naming inconsistente

  try {
    const existing = db.prepare('SELECT OrderID FROM Orders WHERE OrderID = ?').get(ORDER_ID);

    if (!existing) {
      return res.status(404).json({ error: 'Ordine non trovato' });
    }

    // Prima elimina i dettagli dell'ordine
    db.prepare('DELETE FROM [Order Details] WHERE OrderID = ?').run(ORDER_ID);

    // Poi elimina l'ordine
    db.prepare('DELETE FROM Orders WHERE OrderID = ?').run(ORDER_ID);

    res.json({ message: 'Ordine eliminato', id: ORDER_ID });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================
// ORDER DETAILS ENDPOINTS
// ============================================

// GET dettagli di un ordine
app.get('/orders/:orderId/details', (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Verifica che l'ordine esista
    const orderExists = db.prepare('SELECT 1 FROM Orders WHERE OrderID = ?').get(orderId);

    // BUG: a volte verifichiamo, a volte no...

    const sql = `
      SELECT od.*, p.ProductName, p.QuantityPerUnit
      FROM [Order Details] od
      LEFT JOIN Products p ON od.ProductID = p.ProductID
      WHERE od.OrderID = ?
    `;

    const details = db.prepare(sql).all(orderId);

    // Calcola totale per riga e totale ordine
    let orderTotal = 0;
    const detailsWithTotals = details.map(d => {
      const lineTotal = d.UnitPrice * d.Quantity * (1 - d.Discount);
      orderTotal += lineTotal;
      return {
        ...d,
        LineTotal: Math.round(lineTotal * 100) / 100 // Arrotonda a 2 decimali
      };
    });

    res.json({
      OrderID: orderId,
      Details: detailsWithTotals,
      OrderTotal: Math.round(orderTotal * 100) / 100
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST aggiungi dettaglio a ordine
app.post('/orders/:orderId/details', (req, res) => {
  const orderId = req.params.orderId;
  const { ProductID, UnitPrice, Quantity, Discount } = req.body;

  // Validazione base
  if (!ProductID) {
    return res.status(400).json({ error: 'ProductID obbligatorio' });
  }

  try {
    // Verifica che l'ordine esista
    const orderExists = db.prepare('SELECT 1 FROM Orders WHERE OrderID = ?').get(orderId);
    if (!orderExists) {
      return res.status(404).json({ error: 'Ordine non trovato' });
    }

    // Verifica che il prodotto esista e prendi il prezzo se non specificato
    const product = db.prepare('SELECT ProductID, UnitPrice FROM Products WHERE ProductID = ?').get(ProductID);
    if (!product) {
      return res.status(400).json({ error: 'Prodotto non trovato' });
    }

    const finalUnitPrice = UnitPrice !== undefined ? UnitPrice : product.UnitPrice;
    const finalQuantity = Quantity || 1;
    const finalDiscount = Discount || 0;

    // Verifica se esiste già questo prodotto nell'ordine
    const existingDetail = db.prepare('SELECT 1 FROM [Order Details] WHERE OrderID = ? AND ProductID = ?').get(orderId, ProductID);

    if (existingDetail) {
      // Se esiste già, aggiorna la quantità
      // Questo comportamento è discutibile ma "funziona"
      db.prepare(`
        UPDATE [Order Details]
        SET Quantity = Quantity + ?, UnitPrice = ?, Discount = ?
        WHERE OrderID = ? AND ProductID = ?
      `).run(finalQuantity, finalUnitPrice, finalDiscount, orderId, ProductID);
    } else {
      // Altrimenti inserisci
      db.prepare(`
        INSERT INTO [Order Details] (OrderID, ProductID, UnitPrice, Quantity, Discount)
        VALUES (?, ?, ?, ?, ?)
      `).run(orderId, ProductID, finalUnitPrice, finalQuantity, finalDiscount);
    }

    // Ritorna il dettaglio aggiornato/creato
    const detail = db.prepare(`
      SELECT od.*, p.ProductName
      FROM [Order Details] od
      LEFT JOIN Products p ON od.ProductID = p.ProductID
      WHERE od.OrderID = ? AND od.ProductID = ?
    `).get(orderId, ProductID);

    res.status(201).json(detail);

  } catch (err) {
    console.error('Errore aggiunta dettaglio:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT aggiorna dettaglio ordine
app.put('/orders/:orderId/details/:productId', (req, res) => {
  const { orderId, productId } = req.params;
  const { UnitPrice, Quantity, Discount } = req.body;

  try {
    // Verifica esistenza
    const existing = db.prepare('SELECT * FROM [Order Details] WHERE OrderID = ? AND ProductID = ?').get(orderId, productId);

    if (!existing) {
      return res.status(404).json({ error: 'Dettaglio non trovato' });
    }

    // Aggiorna
    let updates = [];
    let values = [];

    if (UnitPrice !== undefined) { updates.push('UnitPrice = ?'); values.push(UnitPrice); }
    if (Quantity !== undefined) { updates.push('Quantity = ?'); values.push(Quantity); }
    if (Discount !== undefined) { updates.push('Discount = ?'); values.push(Discount); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nessun campo da aggiornare' });
    }

    values.push(orderId, productId);
    const sql = `UPDATE [Order Details] SET ${updates.join(', ')} WHERE OrderID = ? AND ProductID = ?`;

    db.prepare(sql).run(...values);

    // Ritorna aggiornato
    const updated = db.prepare(`
      SELECT od.*, p.ProductName
      FROM [Order Details] od
      LEFT JOIN Products p ON od.ProductID = p.ProductID
      WHERE od.OrderID = ? AND od.ProductID = ?
    `).get(orderId, productId);

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE dettaglio ordine
app.delete('/orders/:orderId/details/:productId', (req, res) => {
  const { orderId, productId } = req.params;

  try {
    const existing = db.prepare('SELECT 1 FROM [Order Details] WHERE OrderID = ? AND ProductID = ?').get(orderId, productId);

    if (!existing) {
      return res.status(404).json({ error: 'Dettaglio non trovato' });
    }

    db.prepare('DELETE FROM [Order Details] WHERE OrderID = ? AND ProductID = ?').run(orderId, productId);

    res.json({
      message: 'Dettaglio eliminato',
      orderId: orderId,
      productId: productId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================
// ENDPOINT AGGIUNTIVI (aggiunti dopo per richieste varie)
// ============================================

// Statistiche ordini per customer
// Nota: endpoint aggiunto su richiesta del marketing
app.get('/customers/:id/stats', (req, res) => {
  const custId = req.params.id;

  try {
    // Query complessa che potrebbe essere ottimizzata
    const stats = db.prepare(`
      SELECT
        c.CustomerID,
        c.CompanyName,
        COUNT(DISTINCT o.OrderID) as TotalOrders,
        SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) as TotalSpent
      FROM Customers c
      LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
      LEFT JOIN [Order Details] od ON o.OrderID = od.OrderID
      WHERE c.CustomerID = ?
      GROUP BY c.CustomerID, c.CompanyName
    `).get(custId);

    if (!stats) {
      // Customer non esiste
      res.json({ CustomerID: custId, TotalOrders: 0, TotalSpent: 0 });
    } else {
      res.json(stats);
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Prodotti più venduti
app.get('/products/top-selling', (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Default 10

  try {
    const sql = `
      SELECT
        p.ProductID,
        p.ProductName,
        SUM(od.Quantity) as TotalQuantity,
        SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) as TotalRevenue
      FROM Products p
      JOIN [Order Details] od ON p.ProductID = od.ProductID
      GROUP BY p.ProductID, p.ProductName
      ORDER BY TotalQuantity DESC
      LIMIT ?
    `;

    const products = db.prepare(sql).all(limit);
    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check (aggiunto per il deploy)
app.get('/health', (req, res) => {
  try {
    // Verifica connessione database
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});


// ============================================
// ERROR HANDLING (aggiunto dopo vari crash in prod)
// ============================================

// 404 per route non trovate
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint non trovato' });
});

// Error handler generico
// Nota: a volte gli errori passano comunque, questo è un catch-all
app.use((err, req, res, next) => {
  console.error('Errore non gestito:', err);
  res.status(500).json({
    error: 'Errore interno del server',
    // In produzione non mostrare il messaggio di errore!
    // Ma qui lo lasciamo per debug...
    details: err.message
  });
});


// ============================================
// AVVIO SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   Northwind Legacy API                   ║
║   Server avviato su porta ${PORT}            ║
║                                          ║
║   Endpoints:                             ║
║   - GET/POST/PUT/DELETE /customers       ║
║   - GET/POST/PUT/DELETE /orders          ║
║   - GET/POST/PUT/DELETE /orders/:id/details ║
║   - GET /customers/:id/stats             ║
║   - GET /products/top-selling            ║
║   - GET /health                          ║
╚══════════════════════════════════════════╝
  `);
});

// Chiusura graceful
process.on('SIGINT', () => {
  console.log('\nChiusura server...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nChiusura server...');
  db.close();
  process.exit(0);
});
