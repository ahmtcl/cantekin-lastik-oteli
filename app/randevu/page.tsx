import { Container } from "@/components/Container";
import { AppointmentForm } from "@/features/appointments/AppointmentForm";

export default function RandevuPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Randevu Oluştur
          </h1>
          <p className="text-gray-600">
            Lastik değişim randevunuz için aşağıdaki formu doldurun.
          </p>
        </div>
        <AppointmentForm />
      </Container>
    </div>
  );
}
