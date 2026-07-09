import Link from "next/link";
import { Container } from "@/components/Container";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Container>
          <div className="max-w-4xl mx-auto text-center py-12 md:py-16">
            {/* Logo/Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 mb-6 md:mb-8">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs md:text-sm text-green-700 font-medium">Online Randevu Sistemi</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Can Tekin Oto Lastik
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-3 md:mb-4 font-semibold">
              Profesyonel Lastik Oteli Hizmeti
            </p>
            
            {/* Description */}
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
              Lastik değişimi, balans ve rot ayarı için hızlı ve kolay randevu oluşturun.
              Zamanınızı verimli kullanın, beklemeyin.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
              <Link href="/randevu">
                <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  Randevu Oluştur
                </button>
              </Link>
              <Link href="/giris">
                <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-300 hover:scale-105 hover:border-gray-300">
                  Personel Girişi
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

