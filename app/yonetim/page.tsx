"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { Loading } from "@/components/Loading";
import { AppointmentCard } from "@/features/appointments/AppointmentCard";
import { AppointmentDetailModal } from "@/features/appointments/AppointmentDetailModal";
import { getTodayAppointments } from "@/lib/services/appointments";
import { Appointment } from "@/lib/types";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function YonetimPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await getTodayAppointments();
        setAppointments(data);
      } catch {
        alert("Randevular yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const refreshAppointments = async () => {
    try {
      const data = await getTodayAppointments();
      setAppointments(data);
    } catch {
      alert("Randevular yüklenirken bir hata oluştu");
    }
  };

  if (loading) {
    return <Loading />;
  }

  const today = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Bugünün Randevuları - {today}</p>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Bugün için randevu bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map((appointment) => (
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
