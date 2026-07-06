/**
 * Test Data Generator
 * Geliştirme için örnek randevu verileri oluşturur
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

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

const testAppointments = [
  {
    name: "Ahmet Yılmaz",
    phone: "0532 123 4567",
    plate: "34 ABC 123",
    appointmentDate: new Date().toISOString().split("T")[0],
    appointmentTime: "09:00",
    note: "4 lastik değişimi",
    status: "bekliyor",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: "Mehmet Demir",
    phone: "0541 234 5678",
    plate: "35 XYZ 456",
    appointmentDate: new Date().toISOString().split("T")[0],
    appointmentTime: "10:00",
    note: "Balans ayarı",
    status: "hazirlaniyor",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: "Ayşe Kaya",
    phone: "0555 345 6789",
    plate: "06 DEF 789",
    appointmentDate: new Date().toISOString().split("T")[0],
    appointmentTime: "11:00",
    status: "hazir",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

async function createTestData() {
  try {
    console.log("📝 Test randevuları oluşturuluyor...");

    for (const appointment of testAppointments) {
      await addDoc(collection(db, "appointments"), appointment);
      console.log(`✅ ${appointment.name} - ${appointment.appointmentTime}`);
    }

    console.log("\n🎉 Test verileri başarıyla oluşturuldu!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

createTestData();
