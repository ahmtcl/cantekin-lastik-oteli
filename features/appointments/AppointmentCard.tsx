"use client";

import { Appointment } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
}

export const AppointmentCard = ({
  appointment,
  onClick,
}: AppointmentCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-900">
            {appointment.appointmentTime}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="space-y-1">
        <p className="text-sm">
          <span className="font-medium text-gray-700">Plaka:</span>{" "}
          <span className="text-gray-900">{appointment.plate}</span>
        </p>
        <p className="text-sm">
          <span className="font-medium text-gray-700">Ad Soyad:</span>{" "}
          <span className="text-gray-900">{appointment.name}</span>
        </p>
        <p className="text-sm">
          <span className="font-medium text-gray-700">Telefon:</span>{" "}
          <span className="text-gray-900">{appointment.phone}</span>
        </p>
      </div>

      {appointment.note && (
        <p className="mt-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
          {appointment.note}
        </p>
      )}
    </div>
  );
};
