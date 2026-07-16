/**
 * Database Migration Script
 * Existing appointments date & time are copied to the new bookedSlots collection.
 */

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

// Read .env.local file
const envPath = path.resolve(process.cwd(), ".env.local");
let envConfig: Record<string, string> = {};
if (fs.existsSync(envPath)) {
  const fileContent = fs.readFileSync(envPath, "utf-8");
  fileContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      envConfig[key] = value.trim();
    }
  });
}

const firebaseConfig = {
  apiKey: envConfig.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB6i_6XT7Q9F3IZ8YoC4nwo5Neg78zvZR0",
  authDomain: envConfig.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "lastikoteli-c0043.firebaseapp.com",
  projectId: envConfig.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "lastikoteli-c0043",
  storageBucket: envConfig.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lastikoteli-c0043.firebasestorage.app",
  messagingSenderId: envConfig.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "536041705534",
  appId: envConfig.NEXT_PUBLIC_FIREBASE_APP_ID || "1:536041705534:web:281e1689b30e7bf34d416f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function migrate() {
  const args = process.argv.slice(2);
  const email = args[0] || "admin@cantekinlastik.com";
  const password = args[1] || "adminpassword123";

  console.log(`🔑 Authenticating as ${email}...`);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Authenticated successfully.");
  } catch (authError: any) {
    console.error("\n❌ Authentication failed!");
    console.error("If you changed the default admin password, please run:");
    console.error("npx tsx scripts/migrate-slots.ts admin@cantekinlastik.com <your_password>");
    console.error("\nError details:", authError.message);
    process.exit(1);
  }

  try {
    console.log("Reading existing appointments...");
    const appointmentsSnap = await getDocs(collection(db, "appointments"));
    const appointments = appointmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    console.log(`Found ${appointments.length} appointments.`);

    console.log("Reading existing booked slots...");
    const slotsSnap = await getDocs(collection(db, "bookedSlots"));
    const existingSlots = slotsSnap.docs.map(doc => doc.data() as any);
    
    // Map existing slot keys to avoid duplicates
    const existingSlotKeys = new Set(existingSlots.map(s => `${s.appointmentDate}_${s.appointmentTime}`));
    console.log(`Found ${existingSlots.length} existing booked slots.`);

    let addedCount = 0;
    for (const apt of appointments) {
      const key = `${apt.appointmentDate}_${apt.appointmentTime}`;
      if (!existingSlotKeys.has(key)) {
        await addDoc(collection(db, "bookedSlots"), {
          appointmentId: apt.id,
          appointmentDate: apt.appointmentDate,
          appointmentTime: apt.appointmentTime,
          createdAt: Timestamp.now(),
        });
        addedCount++;
        console.log(`+ Added slot: ${apt.appointmentDate} ${apt.appointmentTime} (Client: ${apt.name})`);
      }
    }

    console.log(`\n🎉 Migration completed. Added ${addedCount} missing slots to bookedSlots.`);
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Migration failed with error:", error);
    process.exit(1);
  }
}

migrate();
