/**
 * Firebase Initial Setup Script
 * Bu script ilk çalıştırmada gerekli ayarları Firestore'a yazar
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase config - .env.local'dan kopyalanmış
const firebaseConfig = {
  apiKey: "AIzaSyB6i_6XT7Q9F3IZ8YoC4nwo5Neg78zvZR0",
  authDomain: "lastikoteli-c0043.firebaseapp.com",
  projectId: "lastikoteli-c0043",
  storageBucket: "lastikoteli-c0043.firebasestorage.app",
  messagingSenderId: "536041705534",
  appId: "1:536041705534:web:281e1689b30e7bf34d416f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const defaultSettings = {
  workingDays: [1, 2, 3, 4, 5], // Pazartesi-Cuma
  workingHours: {
    start: "09:00",
    end: "18:00",
  },
  appointmentInterval: 30, // dakika
  closedDays: [],
};

async function setupFirebase() {
  try {
    console.log("🔧 Firebase ayarları yapılandırılıyor...");

    // Default settings'i Firestore'a yaz
    await setDoc(doc(db, "settings", "general"), defaultSettings);
    console.log("✅ Varsayılan ayarlar oluşturuldu");

    console.log("\n🎉 Firebase başarıyla yapılandırıldı!");
    console.log("\n📝 Sonraki adım:");
    console.log("   Firebase Console'dan admin kullanıcısı oluşturun:");
    console.log("   Authentication > Users > Add User");
    console.log("   Email: admin@cantekinlastik.com");
    console.log("   Password: [güvenli bir şifre]");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

setupFirebase();
