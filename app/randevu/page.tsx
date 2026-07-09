import { Container } from "@/components/Container";
import { AppointmentForm } from "@/features/appointments/AppointmentForm";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function RandevuPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 md:py-12">
      <Container>
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 font-medium">
            <span>←</span>
            <span>Ana Sayfa</span>
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Randevu Oluştur
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Lastik değişim randevunuz için aşağıdaki formu doldurun
          </p>
        </div>
        
        {/* Form Card */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-xl border border-gray-200">
            <AppointmentForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
