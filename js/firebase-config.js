/**
 * ============================================================
 *  FIREBASE CONFIGURATION
 *  ============================================================
 *  SETUP INSTRUCTIONS:
 *  1. Go to https://console.firebase.google.com/
 *  2. Create a new project
 *  3. Register a Web App in Project Settings
 *  4. Copy your config values below
 *  5. Replace ADMIN_EMAIL with your real admin email
 *  ============================================================
 */

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY_HERE",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

const ADMIN_EMAIL = "tarekhasan@iut-dhaka.edu";

const SITE_DEFAULTS = {
  deptName:      "Department of Mechanical & Production Engineering (MPE)",
  universityName:"Islamic University of Technology (IUT)",
  heroTitle:     "Welcome to MPE Resource Portal",
  heroSubtitle:  "Study materials, books, software & more — all in one place for MPE students.",
  aboutTitle:    "About the MPE Department",
  aboutText:     "The Department of Mechanical & Production Engineering (MPE) at Islamic University of Technology (IUT) is committed to excellence in engineering education. This portal is your one-stop hub for lecture sheets, books, software, lab reports, and all academic resources — organized semester by semester.",
  footerNote:    "For internal academic use only — MPE, IUT.",
  accentColor:   "#1565C0"
};

// ── Detect if config is still placeholder ─────────────────────
const _isConfigured = !firebaseConfig.apiKey.includes("YOUR_");

if (!_isConfigured) {
  console.warn("⚠️  Firebase not configured. Fill in js/firebase-config.js with your project keys.");
}

// ── Initialize Firebase ───────────────────────────────────────
firebase.initializeApp(firebaseConfig);

const db      = firebase.firestore();
const auth    = firebase.auth();
const storage = firebase.storage();

const googleProvider = new firebase.auth.GoogleAuthProvider();

