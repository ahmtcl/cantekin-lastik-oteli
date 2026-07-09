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
  // Parse brand and model from note if not available (backward compatibility)
  const brand = appointment.brand || appointment.note?.match(/Marka:\s*([^|]+)/)?.[1]?.trim() || "-";
  const model = appointment.model || appointment.note?.match(/Model:\s*([^|]+)/)?.[1]?.trim() || "-";
  
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 group-hover:bg-blue-100 rounded-lg p-2 transition-colors">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Saat</p>
            <p className="text-lg font-bold text-gray-900">{appointment.appointmentTime}</p>
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-sm text-gray-900 font-medium">{appointment.name}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <p className="text-sm text-gray-700">{appointment.phone}</p>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">
            <span className="font-semibold text-gray-900">{appointment.plate}</span>
            <span className="text-gray-400 mx-1.5">•</span>
            <span className="text-gray-600">{brand} {model}</span>
          </p>
        </div>
      </div>

      {appointment.note && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Not
          </p>
          <p className="text-sm text-gray-700 line-clamp-2">{appointment.note}</p>
        </div>
      )}
    </div>
  );
};
