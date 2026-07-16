import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Appointment, AppointmentFormData, AppointmentStatus } from "@/lib/types";

const COLLECTION_NAME = "appointments";

export const createAppointment = async (
  data: AppointmentFormData
): Promise<string> => {
  if (!db) {
    throw new Error("Firebase not initialized. Please check your internet connection and try again.");
  }

  const appointmentData = {
    ...data,
    status: "bekliyor" as AppointmentStatus,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), appointmentData);

  // Write to public bookedSlots collection (contains no personal/sensitive data)
  try {
    await addDoc(collection(db, "bookedSlots"), {
      appointmentId: docRef.id,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error writing to bookedSlots collection:", error);
  }

  return docRef.id;
};

export const updateAppointmentStatus = async (
  id: string,
  status: AppointmentStatus
): Promise<void> => {
  if (!db) {
    throw new Error("Firebase not initialized");
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const deleteAppointment = async (id: string): Promise<void> => {
  if (!db) {
    throw new Error("Firebase not initialized");
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);

  // Clean up the corresponding public bookedSlots record
  try {
    const q = query(
      collection(db, "bookedSlots"),
      where("appointmentId", "==", id)
    );
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((docVal) => deleteDoc(doc(db, "bookedSlots", docVal.id)));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting from bookedSlots collection:", error);
  }
};

export const getAppointmentsByDate = async (
  date: string
): Promise<Appointment[]> => {
  if (!db) {
    console.warn("Firebase not initialized, returning empty appointments");
    return [];
  }

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
  if (!db) {
    console.warn("Firebase not initialized, returning empty appointments");
    return [];
  }

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
  if (!db) {
    console.warn("Firebase not initialized");
    return null;
  }

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
  // Return empty array if Firebase is not initialized
  if (!db) {
    console.warn("Firebase not initialized, returning empty booked times");
    return [];
  }

  try {
    // Query public bookedSlots instead of private appointments
    const q = query(
      collection(db, "bookedSlots"),
      where("appointmentDate", "==", date)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docVal) => docVal.data().appointmentTime);
  } catch (error) {
    console.error("Error fetching booked times from bookedSlots:", error);
    return [];
  }
};
