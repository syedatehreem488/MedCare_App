# MedCare – Welcome Page

A MedCare welcome screen built with our project stack:

**React Native (Expo) app → Node.js + Express backend → MySQL database**

When the app opens, it asks the backend for data. The backend reads the number of
patients, caregivers and medicines from MySQL and sends them back. If you see
"● Connected to database" with numbers on the screen, all three parts are working.

```
medcare/
├── database/
│   └── schema.sql      → creates the "medcare" database (7 tables from our Lab 3 ERD) + sample data
├── backend/
│   ├── server.js       → the Express server and its API routes
│   ├── db.js           → the connection to MySQL
│   ├── .env.example    → settings template (database password etc.)
│   └── package.json    → list of backend packages
└── mobile/
    ├── App.js          → the welcome screen
    └── config.js       → the backend's address (your laptop's IP)
```

---

## What you need installed

1. **Node.js** (LTS version) from nodejs.org
2. **MySQL Server + MySQL Workbench** (you already have these from the database course)
3. **Expo Go** app on your Android phone, from the Play Store

---

## Step 1: Create the database

1. Open **MySQL Workbench** and connect to your local server.
2. Go to **File → Open SQL Script** and open `database/schema.sql`.
3. Click the **lightning bolt** ⚡ to run the whole script.
4. Refresh the Schemas panel. You should now see a **medcare** database with 7 tables.

## Step 2: Run the backend

Open a terminal (Command Prompt or VS Code terminal) in the `backend` folder:

```bash
npm install
```

Make a copy of `.env.example` and name the copy `.env`. Open `.env` and put your
MySQL password next to `DB_PASSWORD=`.

Start the server:

```bash
npm run dev
```

You should see:

```
MedCare server running on port 5000
Connected to MySQL database: medcare
```

Test it by opening **http://localhost:5000/api/welcome** in your browser. You should see something like:

```json
{"appName":"MedCare","tagline":"Never miss a dose. Keep your family in the loop.","dbConnected":true,"stats":{"patients":2,"caregivers":1,"medicines":3}}
```

Keep this terminal open. The server needs to stay running.

## Step 3: Run the mobile app

Open a **second** terminal in the folder where you want the app and run:

```bash
npx create-expo-app@latest medcare-app --template blank
cd medcare-app
```

Then:

1. Replace the `App.js` inside `medcare-app` with our `mobile/App.js`.
2. Copy `mobile/config.js` into `medcare-app` too.
3. Find your laptop's IP: in Command Prompt type `ipconfig` and copy the **IPv4 Address**
   under Wi-Fi (e.g. `192.168.1.7`).
4. Open `config.js` and put your IP in it: `http://YOUR_IP:5000`

Start the app:

```bash
npx expo start
```

A QR code appears. Open **Expo Go** on your phone and scan it. The welcome screen
will open on your phone.

> Your phone and laptop must be on the **same Wi-Fi**.

---

## If something goes wrong

| Problem | Fix |
|---|---|
| `Access denied for user 'root'` | Wrong password in `.env`. |
| `Unknown database 'medcare'` | You haven't run `schema.sql` yet (Step 1). |
| App says "Could not reach the server" | 1) Check the IP in `config.js`. 2) Phone and laptop on the same Wi-Fi. 3) Open `http://YOUR_IP:5000/api/health` in your **phone's browser**. If it doesn't open, Windows Firewall is blocking Node.js: search "Allow an app through Windows Firewall" and tick **Node.js** for **Private** networks. |
| Expo Go says the project is incompatible | Update Expo Go from the Play Store. |
| University Wi-Fi blocks the connection | Use your phone's hotspot and connect the laptop to it. |

---

## How it works (for the viva)

1. The app opens and `useEffect` runs `loadWelcome()`.
2. `loadWelcome()` sends a request with `fetch()` to `http://YOUR_IP:5000/api/welcome`.
3. Express receives it in `server.js` and runs three `SELECT COUNT(*)` queries through the
   MySQL connection pool in `db.js`.
4. The server sends the results back as **JSON**.
5. The app saves the JSON in state with `setData()`, and React Native redraws the screen
   with the numbers.

**Why `.env`?** So the database password is not written in the code or uploaded to GitHub
(`.gitignore` keeps `.env` out of Git).

**Why not `localhost` in the app?** On the phone, `localhost` means the phone itself.
The app needs the laptop's IP to reach the server running on the laptop.
