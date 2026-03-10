/**
 * The Box Office - Short Film Competition
 * Backend Server (Node.js + Express + sql.js)
 */

// const express   = require('express');
// const multer    = require('multer');
// const cors      = require('cors');
// const path      = require('path');
// const fs        = require('fs');
// const initSqlJs = require('sql.js');

// const PORT        = process.env.PORT || 3000;
// const ADMIN_PASS  = process.env.ADMIN_PASS || 'boxoffice2025';
// const UPLOADS_DIR = path.join(__dirname, 'uploads');
// const DB_PATH     = path.join(__dirname, 'registrations.db');

// if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// let db;

// function saveDb() {
//   fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
// }

// function run(sql, params = []) {
//   db.run(sql, params);
//   saveDb();
//   const [[rowid]]   = db.exec('SELECT last_insert_rowid()')[0]?.values ?? [[0]];
//   const [[changes]] = db.exec('SELECT changes()')[0]?.values ?? [[0]];
//   return { lastInsertRowid: rowid, changes };
// }

// function all(sql, params = []) {
//   const result = db.exec(sql, params);
//   if (!result.length) return [];
//   const { columns, values } = result[0];
//   return values.map(row => Object.fromEntries(columns.map((col, i) => [col, row[i]])));
// }

// function get(sql, params = []) {
//   return all(sql, params)[0];
// }

// async function initDb() {
//   const SQL = await initSqlJs();
//   db = fs.existsSync(DB_PATH)
//     ? new SQL.Database(fs.readFileSync(DB_PATH))
//     : new SQL.Database();

//   db.run(`
//     CREATE TABLE IF NOT EXISTS registrations (
//       id           INTEGER PRIMARY KEY AUTOINCREMENT,
//       submitted_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
//       status       TEXT NOT NULL DEFAULT 'pending',
//       film_name    TEXT NOT NULL,
//       synopsis     TEXT NOT NULL,
//       film_link    TEXT NOT NULL,
//       payment_file TEXT,
//       tm1_name TEXT, tm1_phone TEXT, tm1_email TEXT, tm1_role TEXT, tm1_college TEXT,
//       tm2_name TEXT, tm2_phone TEXT, tm2_email TEXT, tm2_role TEXT, tm2_college TEXT,
//       tm3_name TEXT, tm3_role TEXT, tm3_college TEXT,
//       tm4_name TEXT, tm4_role TEXT, tm4_college TEXT,
//       tm5_name TEXT, tm5_role TEXT, tm5_college TEXT,
//       tm6_name TEXT, tm6_role TEXT, tm6_college TEXT,
//       tm7_name TEXT, tm7_role TEXT, tm7_college TEXT,
//       tm8_name TEXT, tm8_role TEXT, tm8_college TEXT,
//       tm9_name TEXT, tm9_role TEXT, tm9_college TEXT,
//       tm10_name TEXT, tm10_role TEXT, tm10_college TEXT,
//       tm11_name TEXT, tm11_role TEXT, tm11_college TEXT,
//       tm12_name TEXT, tm12_role TEXT, tm12_college TEXT,
//       tm13_name TEXT, tm13_role TEXT, tm13_college TEXT,
//       tm14_name TEXT, tm14_role TEXT, tm14_college TEXT,
//       tm15_name TEXT, tm15_role TEXT, tm15_college TEXT,
//       total_members INTEGER DEFAULT 0
//     )
//   `);
//   saveDb();
//   console.log('  Database ready:', DB_PATH);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, UPLOADS_DIR),
//   filename:    (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     cb(null, `pay_${Date.now()}_${Math.random().toString(36).slice(2,7)}${ext}`);
//   }
// });
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const allowed = ['.jpg','.jpeg','.png','.webp'];
//     allowed.includes(path.extname(file.originalname).toLowerCase())
//       ? cb(null, true) : cb(new Error('Only JPG, PNG, WEBP allowed'));
//   }
// });

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(UPLOADS_DIR));
// app.use(express.static(path.join(__dirname, 'public')));

// function adminAuth(req, res, next) {
//   const token = req.headers['x-admin-token'] || req.query.token;
//   if (token !== ADMIN_PASS) return res.status(401).json({ error: 'Unauthorized' });
//   next();
// }

// // ── Register ──────────────────────────────────────────────────────────────────
// app.post('/api/register', upload.single('paymentFile'), (req, res) => {
//   try {
//     const b = req.body;

//     // HTML form sends filmName/filmLink (camelCase) — normalise to snake_case
//     b.film_name = (b.film_name || b.filmName || '').trim();
//     b.film_link = (b.film_link || b.filmLink || '').trim();

//     const required = [
//       'film_name','synopsis','film_link',
//       'tm1_name','tm1_phone','tm1_email','tm1_role','tm1_college',
//       'tm2_name','tm2_phone','tm2_email','tm2_role','tm2_college',
//       'tm3_name','tm3_role','tm3_college',
//       'tm4_name','tm4_role','tm4_college'
//     ];
//     const missing = required.filter(k => !b[k]?.trim());
//     if (missing.length) return res.status(400).json({ error: 'Missing required fields', fields: missing });
//     if (!req.file)      return res.status(400).json({ error: 'Payment screenshot is required' });

//     let total = 0;
//     for (let i = 1; i <= 15; i++) if (b[`tm${i}_name`]?.trim()) total++;
//     const v = k => b[k]?.trim() || null;

//     // Columns: film_name, synopsis, film_link, payment_file = 4
//     // tm1: 5 fields, tm2: 5 fields = 10
//     // tm3-tm15: 3 fields each x 13 = 39
//     // total_members = 1
//     // Total = 4 + 10 + 39 + 1 = 54 columns, 54 values
//     const values = [
//       v('film_name'), v('synopsis'), v('film_link'), req.file.filename,  // 4
//       v('tm1_name'), v('tm1_phone'), v('tm1_email'), v('tm1_role'), v('tm1_college'), // 5
//       v('tm2_name'), v('tm2_phone'), v('tm2_email'), v('tm2_role'), v('tm2_college'), // 5
//       v('tm3_name'),  v('tm3_role'),  v('tm3_college'),   // 3
//       v('tm4_name'),  v('tm4_role'),  v('tm4_college'),   // 3
//       v('tm5_name'),  v('tm5_role'),  v('tm5_college'),   // 3
//       v('tm6_name'),  v('tm6_role'),  v('tm6_college'),   // 3
//       v('tm7_name'),  v('tm7_role'),  v('tm7_college'),   // 3
//       v('tm8_name'),  v('tm8_role'),  v('tm8_college'),   // 3
//       v('tm9_name'),  v('tm9_role'),  v('tm9_college'),   // 3
//       v('tm10_name'), v('tm10_role'), v('tm10_college'),  // 3
//       v('tm11_name'), v('tm11_role'), v('tm11_college'),  // 3
//       v('tm12_name'), v('tm12_role'), v('tm12_college'),  // 3
//       v('tm13_name'), v('tm13_role'), v('tm13_college'),  // 3
//       v('tm14_name'), v('tm14_role'), v('tm14_college'),  // 3
//       v('tm15_name'), v('tm15_role'), v('tm15_college'),  // 3
//       total                                               // 1
//     ];

//     console.log('Inserting', values.length, 'values');

//     const info = run(`
//       INSERT INTO registrations (
//         film_name, synopsis, film_link, payment_file,
//         tm1_name, tm1_phone, tm1_email, tm1_role, tm1_college,
//         tm2_name, tm2_phone, tm2_email, tm2_role, tm2_college,
//         tm3_name, tm3_role, tm3_college,
//         tm4_name, tm4_role, tm4_college,
//         tm5_name, tm5_role, tm5_college,
//         tm6_name, tm6_role, tm6_college,
//         tm7_name, tm7_role, tm7_college,
//         tm8_name, tm8_role, tm8_college,
//         tm9_name, tm9_role, tm9_college,
//         tm10_name, tm10_role, tm10_college,
//         tm11_name, tm11_role, tm11_college,
//         tm12_name, tm12_role, tm12_college,
//         tm13_name, tm13_role, tm13_college,
//         tm14_name, tm14_role, tm14_college,
//         tm15_name, tm15_role, tm15_college,
//         total_members
//       ) VALUES (
//         ?,?,?,?,
//         ?,?,?,?,?,
//         ?,?,?,?,?,
//         ?,?,?,
//         ?,?,?,
//         ?,?,?,
//         ?,?,?,
//         ?,?,?,
//         ?,?,?,
//         ?,?,?,
//         ?,?,?,
//         ?,?,?,
//         ?,?,?,
//         ?,?,?,
//         ?,?,?,
//         ?,?,?,
//         ?
//       )
//     `, values);

//     res.json({ success: true, id: info.lastInsertRowid });

//   } catch (err) {
//     console.error(err);
//     if (req.file) fs.unlink(req.file.path, () => {});
//     res.status(500).json({ error: 'Server error. Please try again.' });
//   }
// });

// // ── Admin ─────────────────────────────────────────────────────────────────────
// app.post('/api/admin/login', (req, res) => {
//   const { password } = req.body;
//   if (password !== ADMIN_PASS) return res.status(401).json({ error: 'Incorrect password' });
//   res.json({ token: ADMIN_PASS });
// });

// app.get('/api/admin/registrations', adminAuth, (req, res) => {
//   res.json(all('SELECT * FROM registrations ORDER BY submitted_at DESC'));
// });

// app.get('/api/admin/registrations/:id', adminAuth, (req, res) => {
//   const row = get('SELECT * FROM registrations WHERE id = ?', [req.params.id]);
//   if (!row) return res.status(404).json({ error: 'Not found' });
//   res.json(row);
// });

// app.patch('/api/admin/registrations/:id/status', adminAuth, (req, res) => {
//   const { status } = req.body;
//   if (!['pending','verified','rejected'].includes(status))
//     return res.status(400).json({ error: 'Invalid status' });
//   const info = run('UPDATE registrations SET status = ? WHERE id = ?', [status, req.params.id]);
//   if (!info.changes) return res.status(404).json({ error: 'Not found' });
//   res.json({ success: true });
// });

// app.delete('/api/admin/registrations/:id', adminAuth, (req, res) => {
//   const row = get('SELECT payment_file FROM registrations WHERE id = ?', [req.params.id]);
//   if (!row) return res.status(404).json({ error: 'Not found' });
//   run('DELETE FROM registrations WHERE id = ?', [req.params.id]);
//   if (row.payment_file) fs.unlink(path.join(UPLOADS_DIR, row.payment_file), () => {});
//   res.json({ success: true });
// });

// app.get('/api/admin/stats', adminAuth, (req, res) => {
//   const total    = get("SELECT COUNT(*) as n FROM registrations").n;
//   const pending  = get("SELECT COUNT(*) as n FROM registrations WHERE status='pending'").n;
//   const verified = get("SELECT COUNT(*) as n FROM registrations WHERE status='verified'").n;
//   const rejected = get("SELECT COUNT(*) as n FROM registrations WHERE status='rejected'").n;
//   const avg      = get('SELECT AVG(total_members) as a FROM registrations').a || 0;
//   res.json({ total, pending, verified, rejected, revenue: verified * 300, avgTeam: Number(avg).toFixed(1) });
// });

// app.get('/api/admin/export/csv', adminAuth, (req, res) => {
//   const rows = all('SELECT * FROM registrations ORDER BY submitted_at DESC');
//   if (!rows.length) return res.status(404).json({ error: 'No data' });
//   const cols = Object.keys(rows[0]);
//   const csv  = [
//     cols.join(','),
//     ...rows.map(r => cols.map(c => `"${String(r[c]??'').replace(/"/g,'""')}"`).join(','))
//   ].join('\n');
//   res.setHeader('Content-Type', 'text/csv');
//   res.setHeader('Content-Disposition', `attachment; filename="registrations_${new Date().toISOString().slice(0,10)}.csv"`);
//   res.send(csv);
// });

// // ── Boot ──────────────────────────────────────────────────────────────────────
// initDb().then(() => {
//   app.listen(PORT, () => {
//     console.log(`\n  The Box Office running at http://localhost:${PORT}`);
//     console.log(`  Admin password: ${ADMIN_PASS}\n`);
//   });
// }).catch(err => { console.error('DB init failed:', err); process.exit(1); });

/**
 * The Box Office - Short Film Competition
 * Backend Server (Node.js + Express + Firebase Firestore)
 *
 * Setup:
 *  1. Create a Firebase project at https://console.firebase.google.com
 *  2. Enable Firestore (Native mode)
 *  3. Go to Project Settings → Service Accounts → Generate new private key
 *  4. Save the JSON file as `serviceAccountKey.json` in this directory
 *     OR set the GOOGLE_APPLICATION_CREDENTIALS env var to its path
 *  5. npm install express multer cors firebase-admin
 */

const express  = require('express');
const multer   = require('multer');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');
const admin    = require('firebase-admin');

// ── Config ────────────────────────────────────────────────────────────────────
const PORT        = process.env.PORT || 3000;
const ADMIN_PASS  = process.env.ADMIN_PASS || 'boxoffice2025';
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Path to your Firebase service account key JSON
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const firestore    = admin.firestore();
const COLLECTION   = 'registrations';

// ── Uploads dir ───────────────────────────────────────────────────────────────
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// ── Multer ────────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `pay_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    allowed.includes(path.extname(file.originalname).toLowerCase())
      ? cb(null, true)
      : cb(new Error('Only JPG, PNG, WEBP allowed'));
  },
});

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(path.join(__dirname, 'public')));

// ── Auth middleware ───────────────────────────────────────────────────────────
function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token !== ADMIN_PASS) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
/** Convert a Firestore DocumentSnapshot to a plain object with an `id` field. */
function docToObj(docSnap) {
  if (!docSnap.exists) return null;
  const data = docSnap.data();
  // Convert Firestore Timestamps to ISO strings
  if (data.submitted_at && data.submitted_at.toDate) {
    data.submitted_at = data.submitted_at.toDate().toISOString();
  }
  return { id: docSnap.id, ...data };
}

// ── Register ──────────────────────────────────────────────────────────────────
app.post('/api/register', upload.single('paymentFile'), async (req, res) => {
  try {
    const b = req.body;

    // Normalise camelCase -> snake_case sent by HTML form
    b.film_name = (b.film_name || b.filmName || '').trim();
    b.film_link = (b.film_link || b.filmLink || '').trim();

    const required = [
      'film_name', 'synopsis', 'film_link',
      'tm1_name', 'tm1_phone', 'tm1_email', 'tm1_role', 'tm1_college',
      'tm2_name', 'tm2_phone', 'tm2_email', 'tm2_role', 'tm2_college',
      'tm3_name', 'tm3_role', 'tm3_college',
      'tm4_name', 'tm4_role', 'tm4_college',
    ];
    const missing = required.filter(k => !b[k]?.trim());
    if (missing.length)
      return res.status(400).json({ error: 'Missing required fields', fields: missing });
    if (!req.file)
      return res.status(400).json({ error: 'Payment screenshot is required' });

    // Count filled team members
    let total_members = 0;
    for (let i = 1; i <= 15; i++) if (b[`tm${i}_name`]?.trim()) total_members++;

    const v = k => b[k]?.trim() || null;

    // Build document
    const docData = {
      submitted_at:  admin.firestore.FieldValue.serverTimestamp(),
      status:        'pending',
      film_name:     v('film_name'),
      synopsis:      v('synopsis'),
      film_link:     v('film_link'),
      payment_file:  req.file.filename,
      total_members,

      // Team member 1 & 2 (full fields)
      tm1_name: v('tm1_name'), tm1_phone: v('tm1_phone'),
      tm1_email: v('tm1_email'), tm1_role: v('tm1_role'), tm1_college: v('tm1_college'),

      tm2_name: v('tm2_name'), tm2_phone: v('tm2_phone'),
      tm2_email: v('tm2_email'), tm2_role: v('tm2_role'), tm2_college: v('tm2_college'),
    };

    // Team members 3-15 (name, role, college only)
    for (let i = 3; i <= 15; i++) {
      docData[`tm${i}_name`]    = v(`tm${i}_name`);
      docData[`tm${i}_role`]    = v(`tm${i}_role`);
      docData[`tm${i}_college`] = v(`tm${i}_college`);
    }

    const docRef = await firestore.collection(COLLECTION).add(docData);

    res.json({ success: true, id: docRef.id });

  } catch (err) {
    console.error(err);
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── Admin login ───────────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASS) return res.status(401).json({ error: 'Incorrect password' });
  res.json({ token: ADMIN_PASS });
});

// ── List all registrations ────────────────────────────────────────────────────
app.get('/api/admin/registrations', adminAuth, async (req, res) => {
  try {
    const snapshot = await firestore
      .collection(COLLECTION)
      .orderBy('submitted_at', 'desc')
      .get();
    res.json(snapshot.docs.map(docToObj));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// ── Get single registration ───────────────────────────────────────────────────
app.get('/api/admin/registrations/:id', adminAuth, async (req, res) => {
  try {
    const docSnap = await firestore.collection(COLLECTION).doc(req.params.id).get();
    const row = docToObj(docSnap);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch registration' });
  }
});

// ── Update status ─────────────────────────────────────────────────────────────
app.patch('/api/admin/registrations/:id/status', adminAuth, async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'verified', 'rejected'].includes(status))
    return res.status(400).json({ error: 'Invalid status' });
  try {
    const ref  = firestore.collection(COLLECTION).doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Not found' });
    await ref.update({ status });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ── Delete registration ───────────────────────────────────────────────────────
app.delete('/api/admin/registrations/:id', adminAuth, async (req, res) => {
  try {
    const ref  = firestore.collection(COLLECTION).doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Not found' });
    const { payment_file } = snap.data();
    await ref.delete();
    if (payment_file) fs.unlink(path.join(UPLOADS_DIR, payment_file), () => {});
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete registration' });
  }
});

// ── Stats ─────────────────────────────────────────────────────────────────────
app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const snapshot = await firestore.collection(COLLECTION).get();
    const docs     = snapshot.docs.map(d => d.data());

    const total    = docs.length;
    const pending  = docs.filter(d => d.status === 'pending').length;
    const verified = docs.filter(d => d.status === 'verified').length;
    const rejected = docs.filter(d => d.status === 'rejected').length;
    const avgTeam  = total
      ? (docs.reduce((s, d) => s + (d.total_members || 0), 0) / total).toFixed(1)
      : '0.0';

    res.json({ total, pending, verified, rejected, revenue: verified * 300, avgTeam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ── Export CSV ────────────────────────────────────────────────────────────────
app.get('/api/admin/export/csv', adminAuth, async (req, res) => {
  try {
    const snapshot = await firestore
      .collection(COLLECTION)
      .orderBy('submitted_at', 'desc')
      .get();

    if (snapshot.empty) return res.status(404).json({ error: 'No data' });

    const rows = snapshot.docs.map(docToObj);
    const cols = Object.keys(rows[0]);
    const csv  = [
      cols.join(','),
      ...rows.map(r =>
        cols.map(c => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="registrations_${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export' });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  The Box Office running at http://localhost:${PORT}`);
  console.log(`  Admin password: ${ADMIN_PASS}\n`);

});
