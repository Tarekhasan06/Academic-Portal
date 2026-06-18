/**
 * db.js — Firestore CRUD helpers
 * All database operations for the academic portal
 */

// ── Site Config ─────────────────────────────────────────────
async function dbGetConfig() {
  const snap = await db.collection('config').doc('site').get();
  return snap.exists ? snap.data() : { ...SITE_DEFAULTS };
}
async function dbSetConfig(data) {
  await db.collection('config').doc('site').set(data, { merge: true });
}

// ── Semesters ────────────────────────────────────────────────
async function dbGetSemesters(includeHidden = false) {
  let q = db.collection('semesters').orderBy('order', 'asc');
  const snap = await q.get();
  const results = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!includeHidden && d.hidden) return;
    results.push({ id: doc.id, ...d });
  });
  return results;
}
async function dbCreateSemester(data) {
  return await db.collection('semesters').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}
async function dbUpdateSemester(id, data) {
  await db.collection('semesters').doc(id).update(data);
}
async function dbDeleteSemester(id) {
  // Also delete all subjects (and their resources) in this semester
  const subjects = await db.collection('subjects').where('semesterId', '==', id).get();
  const batch = db.batch();
  const subIds = [];
  subjects.forEach(doc => {
    subIds.push(doc.id);
    batch.delete(doc.ref);
  });
  // Delete resources for each subject
  for (const subId of subIds) {
    const resources = await db.collection('resources').where('subjectId', '==', subId).get();
    resources.forEach(doc => batch.delete(doc.ref));
  }
  batch.delete(db.collection('semesters').doc(id));
  await batch.commit();
}

// ── Subjects ─────────────────────────────────────────────────
async function dbGetSubjectsBySemester(semesterId, includeHidden = false) {
  const snap = await db.collection('subjects')
    .where('semesterId', '==', semesterId)
    .orderBy('order', 'asc')
    .get();
  const results = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!includeHidden && d.hidden) return;
    results.push({ id: doc.id, ...d });
  });
  return results;
}
async function dbGetAllSubjects() {
  const snap = await db.collection('subjects').orderBy('semesterId').orderBy('order', 'asc').get();
  const results = [];
  snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
  return results;
}
async function dbCreateSubject(data) {
  return await db.collection('subjects').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}
async function dbUpdateSubject(id, data) {
  await db.collection('subjects').doc(id).update(data);
}
async function dbDeleteSubject(id) {
  const resources = await db.collection('resources').where('subjectId', '==', id).get();
  const batch = db.batch();
  resources.forEach(doc => batch.delete(doc.ref));
  batch.delete(db.collection('subjects').doc(id));
  await batch.commit();
}

// ── Resources ────────────────────────────────────────────────
async function dbGetResourcesBySubject(subjectId, includeHidden = false) {
  const snap = await db.collection('resources')
    .where('subjectId', '==', subjectId)
    .orderBy('type')
    .get();
  const results = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!includeHidden && d.hidden) return;
    results.push({ id: doc.id, ...d });
  });
  return results;
}
async function dbCreateResource(data) {
  return await db.collection('resources').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}
async function dbUpdateResource(id, data) {
  await db.collection('resources').doc(id).update(data);
}
async function dbDeleteResource(id) {
  await db.collection('resources').doc(id).delete();
}

// ── Books ────────────────────────────────────────────────────
async function dbGetBooks(includeHidden = false) {
  const snap = await db.collection('books').orderBy('order', 'asc').get();
  const results = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!includeHidden && d.hidden) return;
    results.push({ id: doc.id, ...d });
  });
  return results;
}
async function dbCreateBook(data) {
  return await db.collection('books').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}
async function dbUpdateBook(id, data) { await db.collection('books').doc(id).update(data); }
async function dbDeleteBook(id) { await db.collection('books').doc(id).delete(); }

// ── Software ─────────────────────────────────────────────────
async function dbGetSoftware(includeHidden = false) {
  const snap = await db.collection('software').orderBy('order', 'asc').get();
  const results = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!includeHidden && d.hidden) return;
    results.push({ id: doc.id, ...d });
  });
  return results;
}
async function dbCreateSoftware(data) {
  return await db.collection('software').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}
async function dbUpdateSoftware(id, data) { await db.collection('software').doc(id).update(data); }
async function dbDeleteSoftware(id) { await db.collection('software').doc(id).delete(); }

// ── Tutorials ────────────────────────────────────────────────
async function dbGetTutorials(includeHidden = false) {
  const snap = await db.collection('tutorials').orderBy('order', 'asc').get();
  const results = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!includeHidden && d.hidden) return;
    results.push({ id: doc.id, ...d });
  });
  return results;
}
async function dbCreateTutorial(data) {
  return await db.collection('tutorials').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}
async function dbUpdateTutorial(id, data) { await db.collection('tutorials').doc(id).update(data); }
async function dbDeleteTutorial(id) { await db.collection('tutorials').doc(id).delete(); }

// ── Notices ──────────────────────────────────────────────────
async function dbGetNotices(includeAll = false) {
  const snap = await db.collection('notices').orderBy('pinned', 'desc').orderBy('createdAt', 'desc').get();
  const now = new Date();
  const results = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!includeAll && d.hidden) return;
    if (!includeAll && d.expiresAt && d.expiresAt.toDate && d.expiresAt.toDate() < now) return;
    results.push({ id: doc.id, ...d });
  });
  return results;
}
async function dbCreateNotice(data) {
  return await db.collection('notices').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}
async function dbUpdateNotice(id, data) { await db.collection('notices').doc(id).update(data); }
async function dbDeleteNotice(id) { await db.collection('notices').doc(id).delete(); }

// ── Users ────────────────────────────────────────────────────
async function dbGetUsers() {
  const snap = await db.collection('users').orderBy('registeredAt', 'desc').get();
  const results = [];
  snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
  return results;
}
async function dbGetUser(uid) {
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}
async function dbCreateUser(uid, data) {
  await db.collection('users').doc(uid).set({
    ...data,
    registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
    approved: false,
    role: 'student'
  });
}
async function dbApproveUser(uid) {
  await db.collection('users').doc(uid).update({
    approved: true,
    approvedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}
async function dbRejectUser(uid) {
  await db.collection('users').doc(uid).update({ approved: false });
}
async function dbBanUser(uid) {
  await db.collection('users').doc(uid).update({ banned: true, approved: false });
}
async function dbUnbanUser(uid) {
  await db.collection('users').doc(uid).update({ banned: false });
}
async function dbMakeAdmin(uid) {
  await db.collection('users').doc(uid).update({ role: 'admin', approved: true });
}
async function dbRevokeAdmin(uid) {
  await db.collection('users').doc(uid).update({ role: 'student' });
}

// ── Admin First-time Seed Data ───────────────────────────────
async function dbSeedInitialData(config) {
  const batch = db.batch();

  // Config
  batch.set(db.collection('config').doc('site'), config, { merge: true });

  // 8 Semesters
  const semNames = [
    'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
    'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
  ];
  semNames.forEach((name, i) => {
    const ref = db.collection('semesters').doc(`sem${i + 1}`);
    batch.set(ref, {
      name,
      order: i + 1,
      description: `Year ${Math.ceil((i + 1) / 2)}, ${(i % 2 === 0) ? 'First' : 'Second'} Term`,
      hidden: false
    });
  });

  await batch.commit();
}

// ── Helpers ──────────────────────────────────────────────────
function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
