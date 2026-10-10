# 📊 Arsitektur Aplikasi Laporan Keuangan

## 1️⃣ OVERVIEW SISTEM

### Tujuan Aplikasi
Aplikasi Personal Financial Tracker yang memungkinkan user untuk:
- Mencatat transaksi keuangan harian
- Melihat laporan keuangan (harian, bulanan, tahunan)
- Export laporan dalam format Excel, PDF, Word
- Mengelola kategori pengeluaran/pemasukan
- Kalkulasi otomatis dengan konversi JPY → IDR
- User-friendly interface untuk penggunaan pribadi

### Target User
- Single user (personal use)
- Non-technical user (user-friendly)
- Butuh fleksibilitas kategori custom

---

## 2️⃣ TECH STACK

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js / Fastify
- **Database**: MySQL 8.0+
- **ORM**: Sequelize atau TypeORM
- **Authentication**: JWT (simple, untuk future scalability)
- **Environment**: dotenv

### Frontend
- **Framework**: React.js / Vue.js / Next.js
- **UI Library**: Tailwind CSS / Material-UI
- **Charts**: Chart.js / Recharts
- **State Management**: Redux / Zustand / Context API
- **HTTP Client**: Axios

### Export & Reporting
- **PDF**: PDFKit / pdfmake
- **Excel**: ExcelJS / xlsx
- **Word**: docx

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm / yarn
- **Containerization**: Docker (optional)
- **Database Tool**: MySQL Workbench / DBeaver

---

## 3️⃣ DATABASE SCHEMA

### Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│   categories    │
├─────────────────┤
│ id (PK)         │
│ name            │
│ type            │ (income/expense)
│ icon            │ (optional)
│ color           │ (optional)
│ is_custom       │
│ created_at      │
│ updated_at      │
└─────────────────┘
        ↑
        │ (1 to Many)
        │
┌─────────────────────────────┐
│     transactions            │
├─────────────────────────────┤
│ id (PK)                     │
│ category_id (FK)            │
│ amount (decimal)            │
│ currency (JPY/IDR)          │
│ description                 │
│ transaction_date            │
│ note                        │
│ created_at                  │
│ updated_at                  │
└─────────────────────────────┘

┌──────────────────────┐
│ currency_rates       │
├──────────────────────┤
│ id (PK)              │
│ from_currency        │
│ to_currency          │
│ rate (decimal)       │
│ last_updated         │
└──────────────────────┘

┌──────────────────────┐
│ monthly_budgets      │
├──────────────────────┤
│ id (PK)              │
│ category_id (FK)     │
│ year_month           │
│ budget_amount (IDR)  │
│ created_at           │
│ updated_at           │
└──────────────────────┘
```

### Tabel Detail

#### `categories` - Kategori Transaksi
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  type ENUM('income', 'expense') NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(20),
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Kategori Default yang Disarankan:**
- **Expense (Pengeluaran):**
  - Jajan (custom friendly)
  - Investasi
  - Menabung
  - Orang Tua
  - Sedekah
  - Bayar Utang
  - Kebutuhan Sehari-hari
  - Transportasi
  - Hiburan
  - Kesehatan

- **Income (Pemasukan):**
  - Gaji
  - Bonus
  - Freelance
  - Bunga Bank
  - Dividen

#### `transactions` - Data Transaksi
```sql
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency ENUM('JPY', 'IDR') DEFAULT 'IDR',
  amount_idr DECIMAL(15, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN currency = 'JPY' THEN amount * (SELECT rate FROM currency_rates WHERE from_currency='JPY' AND to_currency='IDR' ORDER BY last_updated DESC LIMIT 1)
      ELSE amount
    END
  ) STORED,
  description VARCHAR(255),
  transaction_date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_transaction_date (transaction_date),
  INDEX idx_category_date (category_id, transaction_date)
);
```

#### `currency_rates` - Kurs Konversi
```sql
CREATE TABLE currency_rates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  from_currency VARCHAR(3) DEFAULT 'JPY',
  to_currency VARCHAR(3) DEFAULT 'IDR',
  rate DECIMAL(15, 8) NOT NULL,
  source VARCHAR(100),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_rate (from_currency, to_currency),
  INDEX idx_last_updated (last_updated)
);
```

#### `monthly_budgets` - Budget Bulanan (Optional)
```sql
CREATE TABLE monthly_budgets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  year_month VARCHAR(7) NOT NULL,
  budget_amount DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_budget (category_id, year_month)
);
```

---

## 4️⃣ ARSITEKTUR BACKEND

### Folder Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Konfigurasi MySQL
│   │   ├── sequelize.js         # ORM setup
│   │   └── constants.js         # Constants & enums
│   │
│   ├── models/
│   │   ├── Category.js
│   │   ├── Transaction.js
│   │   ├── CurrencyRate.js
│   │   └── MonthlyBudget.js
│   │
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── currencyRoutes.js
│   │   └── index.js
│   │
│   ├── controllers/
│   │   ├── categoryController.js
│   │   ├── transactionController.js
│   │   ├── reportController.js
│   │   └── currencyController.js
│   │
│   ├── services/
│   │   ├── reportService.js     # Logika laporan
│   │   ├── exportService.js     # Excel, PDF, Word
│   │   ├── currencyService.js   # Konversi kurs
│   │   └── analyticsService.js  # Analitik data
│   │
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   ├── validate.js
│   │   └── cors.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── dateFormatter.js
│   │   ├── numberFormatter.js
│   │   └── apiResponse.js
│   │
│   ├── migrations/
│   │   ├── 001_create_categories.js
│   │   ├── 002_create_transactions.js
│   │   ├── 003_create_currency_rates.js
│   │   └── 004_create_monthly_budgets.js
│   │
│   └── app.js                   # Express setup
│
├── .env.example
├── .env.local
├── package.json
├── server.js
└── README.md
```

### API Endpoints

#### Categories
```
GET    /api/categories              # List semua kategori
POST   /api/categories              # Tambah kategori custom
GET    /api/categories/:id          # Detail kategori
PUT    /api/categories/:id          # Update kategori
DELETE /api/categories/:id          # Hapus kategori custom
```

#### Transactions
```
GET    /api/transactions            # List transaksi (dengan filter)
POST   /api/transactions            # Tambah transaksi
GET    /api/transactions/:id        # Detail transaksi
PUT    /api/transactions/:id        # Update transaksi
DELETE /api/transactions/:id        # Hapus transaksi

Query Parameters:
- from_date, to_date
- category_id
- type (income/expense)
- currency
```

#### Reports
```
GET    /api/reports/daily/:date     # Laporan harian
GET    /api/reports/monthly/:year/:month  # Laporan bulanan
GET    /api/reports/yearly/:year    # Laporan tahunan
GET    /api/reports/summary         # Ringkasan keseluruhan
GET    /api/reports/category-breakdown  # Breakdown per kategori
```

#### Export
```
POST   /api/export/excel            # Export ke Excel
POST   /api/export/pdf              # Export ke PDF
POST   /api/export/word             # Export ke Word
```

#### Currency
```
GET    /api/currency/rates          # List kurs terbaru
GET    /api/currency/convert        # Konversi JPY → IDR
POST   /api/currency/update-rates   # Update kurs (manual/API)
```

---

## 5️⃣ ARSITEKTUR FRONTEND

### Folder Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Dashboard/
│   │   │   ├── DashboardCard.jsx
│   │   │   └── Summary.jsx
│   │   ├── Transaction/
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   └── TransactionFilter.jsx
│   │   ├── Report/
│   │   │   ├── ReportViewer.jsx
│   │   │   ├── Charts.jsx
│   │   │   └── ExportButton.jsx
│   │   ├── Category/
│   │   │   ├── CategoryManager.jsx
│   │   │   └── CategoryForm.jsx
│   │   └── Common/
│   │       ├── Modal.jsx
│   │       ├── LoadingSpinner.jsx
│   │       └── NotificationToast.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── AddTransaction.jsx
│   │   ├── TransactionHistory.jsx
│   │   ├── Reports.jsx
│   │   │   ├── DailyReport.jsx
│   │   │   ├── MonthlyReport.jsx
│   │   │   └── YearlyReport.jsx
│   │   └── Settings.jsx
│   │
│   ├── hooks/
│   │   ├── useTransaction.js
│   │   ├── useReport.js
│   │   ├── useCategory.js
│   │   └── useCurrency.js
│   │
│   ├── context/
│   │   ├── TransactionContext.jsx
│   │   ├── CategoryContext.jsx
│   │   └── CurrencyContext.jsx
│   │
│   ├── services/
│   │   ├── api.js                 # Axios instance
│   │   ├── transactionService.js
│   │   ├── reportService.js
│   │   ├── categoryService.js
│   │   └── currencyService.js
│   │
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   ├── dateHelpers.js
│   │   └── constants.js
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── tailwind.config.js
│   │
│   ├── App.jsx
│   └── index.js
│
└── package.json
```

### User Interface Flow

```
Landing/Dashboard
├── Top Summary Card
│   ├── Total Income (Bulan ini)
│   ├── Total Expense (Bulan ini)
│   └── Balance
│
├── Quick Add Transaction Button
│   └── Form Modal
│
├── Recent Transactions Widget
│
└── Navigation Menu
    ├── Dashboard
    ├── Add Transaction
    ├── Transaction History
    ├── Reports
    │   ├── Daily Report
    │   ├── Monthly Report
    │   └── Yearly Report
    ├── Categories
    └── Settings
```

---

## 6️⃣ FITUR EXPORT (PDF, Excel, Word)

### Export Strategy

#### Excel Export
```javascript
// Structure:
- Sheet 1: Summary (Total Income, Expense, Balance)
- Sheet 2: Daily Breakdown
- Sheet 3: Category Breakdown
- Sheet 4: Detailed Transactions
- Custom formatting (colors, fonts, borders)
```

#### PDF Export
```javascript
// Structure:
- Header (Title, Date Range)
- Summary Table
- Charts (Bar/Pie)
- Detailed Transactions Table
- Footer (Generated date, page number)
```

#### Word Export
```javascript
// Structure:
- Header dengan logo/branding
- Executive Summary
- Detailed breakdown per kategori
- Transaction list
- Footer
```

### Libraries
```json
{
  "exceljs": "^4.x",          // Excel generation
  "pdfkit": "^0.13.x",        // PDF generation
  "docx": "^8.x",             // Word generation
  "chart.js": "^3.x"          // Charts untuk export
}
```

---

## 7️⃣ FITUR KONVERSI KURS JPY → IDR

### Strategy
1. **Automated Rate Update**
   - Fetch dari API eksternal (e.g., exchangerate-api.com)
   - Update setiap hari otomatis (scheduled job dengan node-cron)
   - Manual override option

2. **Conversion Logic**
   ```javascript
   const convertJPYtoIDR = (amountJPY, currentRate) => {
     return amountJPY * currentRate;
   };
   ```

3. **Storage**
   - Simpan rate di database
   - Versioning: track historical rates
   - Default display: IDR (tapi bisa pilih JPY)

4. **Display**
   - Selalu tampilkan dalam IDR untuk laporan
   - Opsi tampilkan original currency
   - Format: IDR 150,000 (¥1,000 @ Rate 150)

---

## 8️⃣ SECURITY & BEST PRACTICES

### Authentication (Future-ready)
- JWT tokens (even for single user)
- Refresh token mechanism
- Secure password hashing (bcryptjs)

### Data Validation
- Server-side validation (express-validator)
- Input sanitization
- SQL injection prevention (via ORM)

### API Security
- CORS configuration
- Rate limiting
- Request logging
- Error handling (no sensitive info in error messages)

### Database
- Connection pooling
- Query optimization dengan index
- Regular backups
- Prepared statements (ORM)

---

## 9️⃣ PERFORMANCE OPTIMIZATION

### Database
```sql
-- Important Indexes
CREATE INDEX idx_transaction_date ON transactions(transaction_date);
CREATE INDEX idx_category_type ON categories(type);
CREATE INDEX idx_tx_category_date ON transactions(category_id, transaction_date);
```

### Caching Strategy
- Cache kurs konversi (1 jam)
- Cache summary report (30 menit)
- Cache kategori (1 hari)

### Frontend
- Code splitting
- Lazy loading untuk komponen berat
- Memoization untuk expensive calculations

---

## 🔟 DEPLOYMENT & DEVOPS

### Development Environment
```bash
# Backend
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=laporan_keuangan
DB_USER=root
DB_PASSWORD=xxx
CORS_ORIGIN=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

### Production Considerations
- Environment variables (use .env.production)
- HTTPS only
- Database backups
- Error monitoring (Sentry optional)
- Performance monitoring

### Docker (Optional)
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 1️⃣1️⃣ TIMELINE & ROADMAP

### Phase 1: MVP (4-6 weeks)
- ✅ Setup Backend & Database
- ✅ Basic CRUD Transactions
- ✅ Category Management
- ✅ Simple Dashboard
- ✅ Monthly Report
- ✅ Excel Export

### Phase 2: Enhanced Features (2-3 weeks)
- PDF & Word Export
- Daily & Yearly Reports
- Charts & Visualizations
- Currency Conversion
- Budget Management

### Phase 3: Polish & Deploy (2 weeks)
- UI/UX Refinement
- Performance Optimization
- Testing & QA
- Deployment setup
- Documentation

### Phase 4: Future Enhancements
- Mobile app (React Native)
- Multi-user support
- Cloud sync
- Recurring transactions
- Data analytics (ML)

---

## 1️⃣2️⃣ REKOMENDASI FITUR TAMBAHAN

### Short Term
1. **Budget Tracking** - Set monthly budget per kategori
2. **Goals** - Saving goals (e.g., "Nabung liburan")
3. **Reminders** - Notif untuk kategori tertentu
4. **Recurring Transactions** - Otomatis tambah transaksi rutin

### Medium Term
1. **Analytics Dashboard** - Insights & trends
2. **Tags** - Tag transaksi untuk kategorisasi tambahan
3. **Data Import** - Import dari CSV/Excel
4. **Scheduled Reports** - Email laporan otomatis

### Long Term
1. **Mobile App** - Native/React Native
2. **Cloud Sync** - Sinkronisasi antar device
3. **Multi-user** - Share dengan family
4. **AI Categorization** - Auto-kategorisasi transaksi

---

## Summary
Aplikasi ini akan menjadi financial tracker yang powerful namun tetap user-friendly, dengan fokus pada:
✅ Kemudahan input & view transaksi
✅ Laporan komprehensif (daily, monthly, yearly)
✅ Export fleksibel (Excel, PDF, Word)
✅ Currency conversion otomatis (JPY ↔ IDR)
✅ Extensible architecture untuk fitur tambahan
