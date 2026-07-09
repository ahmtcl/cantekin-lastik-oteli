import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Appointment, AppointmentFormData, AppointmentStatus } from "@/lib/types";

const COLLECTION_NAME = "appointments";

export const createAppointment = async (
  data: AppointmentFormData
): Promise<string> => {
  const appointmentData = {
    ...data,
    status: "bekliyor" as AppointmentStatus,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), appointmentData);
  return docRef.id;
};

export const updateAppointmentStatus = async (
  id: string,
  status: AppointmentStatus
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    status,
    updatedAt: Timestamp.now(),
  });
};

export const getAppointmentsByDate = async (
  date: string
): Promise<Appointment[]> => {
  try {
    // Try with index-based query first
    const q = query(
      collection(db, COLLECTION_NAME),
      where("appointmentDate", "==", date),
      orderBy("appointmentTime", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[];
  } catch (error: any) {
    // Fallback: if index is building, fetch all and filter client-side
    if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
      console.log('Index building, using fallback query...');
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const allAppointments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[];
      
      return allAppointments
        .filter((apt) => apt.appointmentDate === date)
        .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));
    }
    throw error;
  }
};

export const getTodayAppointments = async (): Promise<Appointment[]> => {
  const today = new Date().toISOString().split("T")[0];
  return getAppointmentsByDate(today);
};

export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    // Try with index-based query first
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("appointmentDate", "desc"),
      orderBy("appointmentTime", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[];
  } catch (error: any) {
    // Fallback: if index is building, fetch all and sort client-side
    if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
      console.log('Index building, using fallback query...');
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const allAppointments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[];
      
      return allAppointments.sort((a, b) => {
        const dateCompare = b.appointmentDate.localeCompare(a.appointmentDate);
        if (dateCompare !== 0) return dateCompare;
        return b.appointmentTime.localeCompare(a.appointmentTime);
      });
    }
    throw error;
  }
};

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Appointment;
  }

  return null;
};

export const getBookedTimes = async (date: string): Promise<string[]> => {
  const appointments = await getAppointmentsByDate(date);
  return appointments.map((apt) => apt.appointmentTime);
};
