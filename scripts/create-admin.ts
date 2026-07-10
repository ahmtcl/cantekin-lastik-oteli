/**
 * Admin User Generator
 * Firebase Authentication'da admin kullanıcısı oluşturur
 */

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import * as fs from "fs";
import * as path from "path";

// .env.local dosyasını oku
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

async function createAdmin() {
  // Command line arguments: npm run create-admin <email> <password>
  const args = process.argv.slice(2);
  const email = args[0] || "admin@cantekinlastik.com";
  const password = args[1] || "adminpassword123";

  console.log(`👤 Admin kullanıcısı oluşturuluyor: ${email}`);
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("\n✅ Admin kullanıcısı başarıyla oluşturuldu!");
    console.log(`📧 E-posta: ${email}`);
    console.log(`🔑 Şifre: ${password}`);
    console.log("\nLütfen bu şifreyi kullanarak giriş yapın.");
    process.exit(0);
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      console.log(`\nℹ️  Bu kullanıcı (${email}) zaten oluşturulmuş.`);
      console.log("Farklı bir e-posta ile yeni bir admin oluşturabilirsiniz:");
      console.log("Örnek: npm run create-admin admin2@cantekinlastik.com yeni_sifre_123");
    } else if (error.code === "auth/operation-not-allowed") {
      console.error("\n❌ Hata: Firebase Console'da Email/Password giriş yöntemi etkinleştirilmemiş!");
      console.error("Lütfen şu adımları izleyin:");
      console.error("1. Firebase Console'a gidin: https://console.firebase.google.com/");
      console.error(`2. Projenizi seçin: ${firebaseConfig.projectId}`);
      console.error("3. Sol menüden 'Authentication' -> 'Sign-in method' sekmesine gelin.");
      console.error("4. 'Email/Password' sağlayıcısını bulun ve ETKİNLEŞTİRİN (Enable).");
    } else {
      console.error("\n❌ Hata oluştu:", error.code, error.message);
    }
    process.exit(1);
  }
}

createAdmin();
