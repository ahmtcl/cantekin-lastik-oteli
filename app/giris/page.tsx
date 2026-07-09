"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import Link from "next/link";

// Force dynamic rendering to avoid build-time Firebase initialization
export const dynamic = 'force-dynamic';

export default function GirisPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    console.log("Login attempt:", { email: formData.email, hasAuth: !!auth });
    
    if (!auth) {
      console.error("Firebase auth not initialized");
      setError("Firebase yapılandırması yüklenemedi. Lütfen sayfayı yenileyin.");
      return;
    }
    
    setLoading(true);

    try {
      console.log("Attempting Firebase sign in...");
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("Sign in successful:", userCredential.user.uid);
      
      // Save or remove email based on remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      router.push("/yonetim");
    } catch (error: any) {
      console.error("Login error:", error.code, error.message);
      
      let errorMessage = "E-posta veya şifre hatalı";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Hatalı şifre";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Geçersiz e-posta adresi";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "İnternet bağlantısı hatası";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "E-posta veya şifre hatalı. Firebase Console'da kullanıcı oluşturduğunuzdan emin olun.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 font-medium">
            <span>←</span>
            <span>Ana Sayfa</span>
          </Link>
          
          {/* Login card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🔐</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Personel Girişi
              </h1>
              <p className="text-gray-600">
                Yönetim paneline erişim için giriş yapın
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="E-posta"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="ornek@email.com"
                required
              />

              <Input
                label="Şifre"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                required
              />

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  Beni Hatırla
                </label>
              </div>

              <Button type="submit" fullWidth loading={loading}>
                Giriş Yap
              </Button>
            </form>
            
            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Giriş yapmakta sorun mu yaşıyorsunuz?
              <br />
              <span className="text-gray-500">Yönetici ile iletişime geçin</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
