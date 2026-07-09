import { Timestamp } from "firebase/firestore";

export type AppointmentStatus = "bekliyor" | "hazirlaniyor" | "hazir" | "tamamlandi";

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email?: string;
  brand?: string;
  model?: string;
  plate: string;
  appointmentDate: string;
  appointmentTime: string;
  note?: string;
  status: AppointmentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AppointmentFormData {
  name: string;
  phone: string;
  email: string;
  brand: string;
  model: string;
  plate: string;
  appointmentDate: string;
  appointmentTime: string;
  note?: string;
}

export interface Settings {
  workingDays: number[];
  workingHours: {
    start: string;
    end: string;
  };
  appointmentInterval: number;
  closedDays: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  createdAt: Timestamp;
}
