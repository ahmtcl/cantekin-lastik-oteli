import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function TesekkurPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Randevunuz Başarıyla Oluşturuldu
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Randevu talebiniz alınmıştır. Belirttiğiniz tarih ve saatte sizleri
            bekliyoruz.
          </p>
          <Link href="/">
            <Button>Ana Sayfaya Dön</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
