"use client";

import { useEffect, useState, useMemo } from "react";
import { Container } from "@/components/Container";
import { Loading } from "@/components/Loading";
import { Input } from "@/components/Input";
import { AppointmentCard } from "@/features/appointments/AppointmentCard";
import { AppointmentDetailModal } from "@/features/appointments/AppointmentDetailModal";
import { getAllAppointments } from "@/lib/services/appointments";
import { Appointment } from "@/lib/types";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function RandevularPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const data = await getAllAppointments();
        setAppointments(data);
      } catch {
        alert("Randevular yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    if (!searchTerm.trim()) {
      return appointments;
    }

    const term = searchTerm.toLowerCase();
    return appointments.filter(
      (apt) =>
        apt.name.toLowerCase().includes(term) ||
        apt.phone.includes(term) ||
        apt.plate.toLowerCase().includes(term)
    );
  }, [searchTerm, appointments]);

  const refreshAppointments = async () => {
    try {
      const data = await getAllAppointments();
      setAppointments(data);
    } catch {
      alert("Randevular yüklenirken bir hata oluştu");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Randevular</h1>

          <div className="max-w-md">
            <Input
              label="Ara"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İsim, telefon veya plaka ile ara..."
            />
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? "Arama kriterine uygun randevu bulunamadı."
                : "Henüz randevu bulunmuyor."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onClick={() => setSelectedAppointment(appointment)}
              />
            ))}
          </div>
        )}

        {selectedAppointment && (
          <AppointmentDetailModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onUpdate={refreshAppointments}
          />
        )}
      </Container>
    </div>
  );
}
