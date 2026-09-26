# 🏥 MediCare HMS - Enterprise Hospital Management System

A full-stack, enterprise-grade Hospital Management System (HMS) built with **React 19**, **TypeScript**, **Express**, and **MySQL**. Designed for modern clinics and multispecialty hospitals with role-based clinical workflows, electronic medical records (EMR), live OPD queue management, IPD bed allocations, pharmacy dispensing, diagnostic laboratory orders, and GST-compliant invoicing.

---

## 🌟 Key Features & Modules

- **📊 Executive Operations Dashboard**:
  - Real-time KPI counters (Admissions, Consultations, Bed Occupancy %, Collections).
  - Daily OPD/IPD patient volume charts and departmental clinical workload meters.
  - Live clinical activity stream with instant timestamps.

- **👤 Patient Master & EMR (Electronic Medical Records)**:
  - Universal Health ID (UHID) automated sequencing (`UHID-2026-XXXX`).
  - Searchable demographic directory by name, UHID, or mobile number.
  - Allergy alert badges, chronic condition tracking, and comprehensive patient history modal.

- **📅 OPD Appointments & Queue Management**:
  - Live consultation token generation (`#Token`).
  - Multi-stage queue progression (`Scheduled` ➔ `Checked-In` ➔ `In-Consultation` ➔ `Completed`).
  - Filter by consulting physician, date, and visit type (OPD, Follow-up, Emergency, Teleconsult).

- **👨‍⚕️ Physicians & Specialists Directory**:
  - Departmental faculty profiles (Cardiology, Neurology, Orthopedics, General Medicine).
  - OPD chamber locations, visiting days, and consultation fees.

- **🛏️ IPD Ward & Bed Matrix**:
  - Visual bed grid across General Wards, Semi-Private, Deluxe Private, and ICU.
  - Instant patient admission/allocation and discharge workflow with sanitization tracking.

- **💊 Pharmacy & Stock Formulary**:
  - Batch number, expiry date, storage rack location, and unit MRP tracking.
  - Automated safety reorder alerts for low-stock drugs.
  - One-click dispensation modal with real-time stock deduction.

- **🔬 Laboratory & Diagnostics (Pathology / Radiology)**:
  - Comprehensive investigation test menu with normal biological reference ranges.
  - Specimen lifecycle tracker (`Ordered` ➔ `Collected` ➔ `In-Analysis` ➔ `Completed`).
  - Diagnostic report entry and verification.

- **💳 Billing, Invoices & Tax Receipts**:
  - Itemized billing with automated 5% GST calculations and discount handling.
  - Partial/full payment collection across UPI, Cards, Net Banking, and Cash.
  - NABH-compliant hospital tax invoice and printable receipt preview.

- **🎨 Modern UI / UX**:
  - Responsive design with medical color palette and glassmorphism.
  - Instant Dark & Light mode toggle.
  - Multi-role simulation switcher (Super Admin, Doctor, Receptionist, Pharmacist, Lab Technician, Billing Manager).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Vanilla CSS Design System, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript, RESTful API, CORS, Dotenv |
| **Database** | MySQL (with zero-config in-memory fallback for instant setup) |
| **Security** | JWT Authentication, Role-Based Access Control (RBAC), bcrypt |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- *(Optional)* [MySQL Server](https://www.mysql.com/)

---

### Installation & Setup

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/hospital-management-system.git
cd hospital-management-system
```

#### 2. Backend Setup
```bash
cd backend
npm install
npm run build
npm start
```
> The API server will start at `http://localhost:5000`.

#### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> The web application will launch at `http://localhost:3000`.

---

## 🗄️ Database Configuration (Optional)

The application includes a self-contained in-memory fallback that works immediately without any setup. If you wish to connect to a local MySQL instance:

1. Create a MySQL database and import schemas:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```
2. Configure your credentials in `backend/.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=hospital_management_db
   JWT_SECRET=super_secret_hospital_jwt_key_2026_medicare
   ```

---

## 📄 License
This project is licensed under the MIT License.
