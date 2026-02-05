# Backend Legacy - Northwind API

Backend "spaghetti code" per il corso Claude Code. **NON usare come esempio di buon codice!**

Questo backend è intenzionalmente scritto male per scopi didattici. Contiene bug, vulnerabilità di sicurezza e anti-pattern che verranno corretti durante il corso.

## Avvio

```bash
cd backend-legacy
npm install
npm start
```

Il server parte su `http://localhost:3000`

## Endpoint Disponibili

### Customers
- `GET /customers` - Lista clienti (supporta `?search=` e `?country=`)
- `GET /customers/:id` - Dettaglio cliente
- `POST /customers` - Crea cliente
- `PUT /customers/:id` - Aggiorna cliente
- `DELETE /customers/:id` - Elimina cliente

### Orders
- `GET /orders` - Lista ordini (supporta `?customerId=`)
- `GET /orders/:id` - Dettaglio ordine
- `POST /orders` - Crea ordine
- `PUT /orders/:id` - Aggiorna ordine
- `DELETE /orders/:id` - Elimina ordine

### Order Details
- `GET /orders/:orderId/details` - Dettagli di un ordine
- `POST /orders/:orderId/details` - Aggiungi prodotto all'ordine
- `DELETE /orders/:orderId/details/:productId` - Rimuovi prodotto

## Problemi Noti (da correggere nel corso)

- Vulnerabilità SQL injection
- Query N+1 inefficienti
- Gestione errori inconsistente
- Naming conventions miste
- Nessuna separazione di responsabilità
- Codice duplicato
- Magic numbers e commenti obsoleti

## Database

Usa il database Northwind SQLite in `/db/northwind.db`
