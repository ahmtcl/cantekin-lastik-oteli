"use client";

import { useState } from "react";
import { Appointment, AppointmentStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/Button";
import { updateAppointmentStatus, deleteAppointment } from "@/lib/services/appointments";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Parse appointment data from note if fields are empty
  const parseNoteData = () => {
    if (appointment.brand && appointment.model && appointment.email) {
      return {
        email: appointment.email,
        brand: appointment.brand,
        model: appointment.model,
      };
    }

    // Parse from note if needed
    const note = appointment.note || "";
    const emailMatch = note.match(/Email:\s*([^\s|]+)/);
    const brandMatch = note.match(/Marka:\s*([^\s|]+)/);
    const modelMatch = note.match(/Model:\s*([^\s|]+)/);

    return {
      email: emailMatch?.[1] || appointment.email || "-",
      brand: brandMatch?.[1] || appointment.brand || "-",
      model: modelMatch?.[1] || appointment.model || "-",
    };
  };

  const { email, brand, model } = parseNoteData();

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAppointment(appointment.id);
      onUpdate();
      onClose();
    } catch {
      alert("Randevu silinirken bir hata oluştu");
    } finally {
      setDeleting(false);
    }
  };

  const statusLabels = {
    bekliyor: "Bekliyor",
    hazirlaniyor: "Hazırlanıyor",
    hazir: "Hazır",
    tamamlandi: "Tamamlandı",
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl my-4 md:my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Randevu Detayı</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Randevu bilgilerini görüntüleyin ve durumu güncelleyin
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors flex-shrink-0"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
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

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
          {/* Left Column - Appointment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date & Time Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-600 rounded-lg p-2">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Randevu Zamanı</p>
                  <p className="text-lg font-bold text-gray-900">
                    {appointment.appointmentDate} • {appointment.appointmentTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Müşteri Bilgileri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Ad Soyad</p>
                  <p className="text-base font-medium text-gray-900">{appointment.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Telefon</p>
                  <p className="text-base font-medium text-gray-900">{appointment.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">E-posta</p>
                  <p className="text-base font-medium text-gray-900">{email}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Araç Bilgileri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Marka</p>
                  <p className="text-base font-medium text-gray-900">{brand}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Model</p>
                  <p className="text-base font-medium text-gray-900">{model}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Plaka</p>
                  <p className="text-base font-semibold text-gray-900 tracking-wider">{appointment.plate}</p>
                </div>
              </div>
            </div>

            {/* Note */}
            {appointment.note && (
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Müşteri Notu
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{appointment.note}</p>
              </div>
            )}
          </div>

          {/* Right Column - Status Update */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 sticky top-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Durum Yönetimi
              </h3>
              
              {/* Current Status */}
              <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-2">Mevcut Durum</p>
                <StatusBadge status={appointment.status} />
              </div>

              {/* Status Options */}
              <div className="space-y-2 mb-6">
                <p className="text-xs font-medium text-gray-500 mb-3">Yeni Durum Seç</p>
                {statusOptions.map((status) => (
                  <label
                    key={status}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedStatus === status
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={selectedStatus === status}
                      onChange={(e) =>
                        setSelectedStatus(e.target.value as AppointmentStatus)
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`ml-3 text-sm font-medium ${
                      selectedStatus === status ? "text-blue-900" : "text-gray-700"
                    }`}>
                      {statusLabels[status]}
                    </span>
                  </label>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleUpdateStatus}
                  fullWidth
                  loading={loading}
                  disabled={selectedStatus === appointment.status}
                >
                  {selectedStatus === appointment.status ? "Değişiklik Yok" : "Durumu Güncelle"}
                </Button>
                <Button variant="outline" onClick={onClose} fullWidth>
                  Kapat
                </Button>
                
                {/* Delete Button */}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full mt-4 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors border border-red-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Randevuyu Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Randevuyu Sil</h3>
                <p className="text-sm text-gray-500">Bu işlem geri alınamaz</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              <strong>{appointment.name}</strong> adlı müşterinin <strong>{appointment.appointmentDate}</strong> tarihli randevusunu silmek istediğinizden emin misiniz?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Siliniyor...
                  </>
                ) : (
                  "Evet, Sil"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
