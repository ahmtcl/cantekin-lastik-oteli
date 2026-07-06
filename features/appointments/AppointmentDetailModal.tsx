"use client";

import { useState } from "react";
import { Appointment, AppointmentStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/Button";
import { updateAppointmentStatus } from "@/lib/services/appointments";

interface AppointmentDetailModalProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdate: () => void;
}

const statusOptions: AppointmentStatus[] = [
  "bekliyor",
  "hazirlaniyor",
  "hazir",
  "tamamlandi",
];

export const AppointmentDetailModal = ({
  appointment,
  onClose,
  onUpdate,
}: AppointmentDetailModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState(appointment.status);
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    if (selectedStatus === appointment.status) return;

    setLoading(true);
    try {
      await updateAppointmentStatus(appointment.id, selectedStatus);
      onUpdate();
      onClose();
    } catch {
      alert("Durum güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const statusLabels = {
    bekliyor: "Bekliyor",
    hazirlaniyor: "Hazırlanıyor",
    hazir: "Hazır",
    tamamlandi: "Tamamlandı",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Randevu Detayı</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Tarih & Saat</p>
            <p className="text-base text-gray-900">
              {appointment.appointmentDate} - {appointment.appointmentTime}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Ad Soyad</p>
            <p className="text-base text-gray-900">{appointment.name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Telefon</p>
            <p className="text-base text-gray-900">{appointment.phone}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Plaka</p>
            <p className="text-base text-gray-900">{appointment.plate}</p>
          </div>

          {appointment.note && (
            <div>
              <p className="text-sm font-medium text-gray-500">Not</p>
              <p className="text-base text-gray-900">{appointment.note}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Durum</p>
            <div className="mb-3">
              <StatusBadge status={appointment.status} />
            </div>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <label
                  key={status}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={selectedStatus === status}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as AppointmentStatus)
                    }
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-900">
                    {statusLabels[status]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={onClose} fullWidth>
            İptal
          </Button>
          <Button
            onClick={handleUpdateStatus}
            fullWidth
            loading={loading}
            disabled={selectedStatus === appointment.status}
          >
            Güncelle
          </Button>
        </div>
      </div>
    </div>
  );
};
