import { AppointmentStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const statusConfig = {
  bekliyor: {
    label: "Bekliyor",
    color: "bg-yellow-100 text-yellow-800",
  },
  hazirlaniyor: {
    label: "Hazırlanıyor",
    color: "bg-blue-100 text-blue-800",
  },
  hazir: {
    label: "Hazır",
    color: "bg-green-100 text-green-800",
  },
  tamamlandi: {
    label: "Tamamlandı",
    color: "bg-gray-100 text-gray-800",
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
};
