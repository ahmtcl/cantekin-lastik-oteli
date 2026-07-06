"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export default function GirisPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/yonetim");
    } catch {
      setError("E-posta veya şifre hatalı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Personel Girişi
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <Button type="submit" fullWidth loading={loading}>
                Giriş Yap
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
