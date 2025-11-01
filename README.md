# 🧠 Dev_ArsalanNawaz_TaskAB

**Full-Stack Developer (AI-Driven Systems) – Technical Assessment**  

---

## 🚀 Setup & Run

### 1. Clone the repository
```bash
git clone https://github.com/write-arsalan-nawaz/Dev_ArsalanNawaz_TaskAB.git
cd Dev_ArsalanNawaz_TaskAB
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📘 Task A – Mini Full-Stack Search

### 🧩 Overview
A compact full-stack search feature built with **Next.js (React)** and **TypeScript**, consisting of a search UI and backend API that retrieves and displays the top 3 matches from a local JSON dataset.

---

### 💻 Frontend
- Implemented in `pages/index.tsx`
- Simple search input with "Search" button
- Displays up to 3 best matches with title + snippet
- Handles loading, empty, and error states

---

### 🧠 Backend

**Endpoint:** `POST /api/search`  
**Request Body:**
```json
{ "query": "your search term" }
```

**Response Example:**
```json
[
  {
    "id": "1",
    "title": "Trust badges near CTA",
    "body": "Adding trust badges near the primary CTA increased signups by 12%."
  }
]
```
---

### 🧾 Data
Local dataset located at `data/faqs.json`.

---

### 📸 Screenshots – Task A
| Input 1 | Input 2 |
|---------------|----------------|
| ![Search Input](https://github.com/write-arsalan-nawaz/Dev_ArsalanNawaz_TaskAB/blob/main/public/screenshots/ss2.png) | ![Search Results](https://github.com/write-arsalan-nawaz/Dev_ArsalanNawaz_TaskAB/blob/main/public/screenshots/ss3.png) |

---

## 🌐 Task B – Micro Scraper

### 🧩 Overview
A lightweight scraper API endpoint built with **Puppeteer** to extract webpage details (title, meta description, h1).  
Includes timeout and robust error handling.

---

### ⚙️ Endpoint

**GET** `/api/scrape?url=...`

**Example Request:**
```
http://localhost:3000/api/scrape?url=https://example.com
```

**Response Example:**
```json
{
  "title": "Example Domain",
  "metaDescription": null,
  "h1": "Example Domain",
  "status": 200
}
```

### 📸 Screenshot – Task B
| ![Scraper Success](https://github.com/write-arsalan-nawaz/Dev_ArsalanNawaz_TaskAB/blob/main/public/screenshots/ss1.png)|

---

## 🗂️ Project Structure
```
data/
  └── faqs.json
pages/
  ├── api/
  │   ├── search.ts
  │   └── scrape.ts
  └── index.tsx
package.json
tsconfig.json
README.md
```

---

## 🧠 Notes & Assumptions
- Both tasks use local data only (no external DBs).
- Puppeteer runs fully headless.
- `npm run dev` launches both frontend and API routes.

---

## 🧪 Testing Guide

**Task A**
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "trust badges"}'
```

**Task B**
```bash
curl "http://localhost:3000/api/scrape?url=https://example.com"
```

---

## 👤 Author
**Arsalan Nawaz**  
📧 write.arsalan.nawaz@gmail.com  
🌐 [https://github.com/write-arsalan-nawaz](https://github.com/write-arsalan-nawaz)

---

## ✅ Submission
Please review both tasks by running:
```bash
npm install && npm run dev
```

Repository: [https://github.com/write-arsalan-nawaz/Dev_ArsalanNawaz_TaskAB](https://github.com/write-arsalan-nawaz/Dev_ArsalanNawaz_TaskAB)
