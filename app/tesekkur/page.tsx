import Link from "next/link";
import { Container } from "@/components/Container";

export default function TesekkurPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-16">
          {/* Success icon */}
          <div className="mb-8 inline-flex">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Randevunuz Başarıyla Oluşturuldu!
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Randevu talebiniz alınmıştır. Belirttiğiniz tarih ve saatte sizleri bekliyoruz.
            <br />
            <span className="text-gray-500">İyi yolculuklar dileriz!</span>
          </p>
          
          <Link href="/">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
              Ana Sayfaya Dön
            </button>
          </Link>
          
          {/* Additional info */}
          <div className="mt-12 bg-white p-6 rounded-2xl border border-gray-200 shadow-md">
            <p className="text-gray-600 text-sm">
              <strong className="text-gray-900">Bilgi:</strong> Randevu saatinizden 10 dakika önce yerimizde olmanızı rica ederiz.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
