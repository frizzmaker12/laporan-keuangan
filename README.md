# Laporan Keuangan

Aplikasi personal financial tracker untuk mengelola pengeluaran, tabungan, investasi, sedekah, orangtua, utang, dan laporan harian/bulanan/tahunan.

## Stack
- Backend: Node.js + Express + MySQL
- Frontend: React + Vite
- Export: Excel, PDF, Word
- Currency: JPY to IDR conversion

## Struktur proyek

```bash
.
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── constants.js
│       │   └── database.js
│       ├── controllers/
│       │   ├── currencyController.js
│       │   ├── exportController.js
│       │   ├── healthController.js
│       │   ├── reportController.js
│       │   └── transactionController.js
│       ├── routes/
│       │   └── index.js
│       ├── services/
│       │   ├── currencyService.js
│       │   ├── exportService.js
│       │   ├── reportService.js
│       │   └── transactionService.js
│       └── utils/
│           └── formatters.js
├── frontend/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── ReportCard.jsx
│       │   ├── StatCard.jsx
│       │   └── TransactionForm.jsx
│       ├── pages/
│       │   └── Dashboard.jsx
│       └── services/
│           └── api.js
└── .gitignore
```

## Cara menjalankan

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API akan tersedia di `http://localhost:5000/api`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

UI akan tersedia di `http://localhost:5173`.

## API utama

- `GET /api/health`
- `GET /api/transactions`
- `POST /api/transactions`
- `GET /api/reports/summary`
- `GET /api/reports/daily?date=2026-10-10`
- `GET /api/reports/monthly?month=2026-10`
- `GET /api/reports/yearly?year=2026`
- `GET /api/currency/rates`
- `POST /api/export/excel`
- `POST /api/export/pdf`
- `POST /api/export/word`

## Catatan

Starter ini dibuat agar project bisa langsung jalan tanpa database MySQL terlebih dahulu, dengan fallback data demo. Setelah basis aplikasi stabil, Anda bisa mengganti layer data ke MySQL penuh sesuai arsitektur yang sudah dirancang.

## Lisensi
MIT
