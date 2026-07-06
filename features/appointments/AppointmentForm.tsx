"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { useSettings } from "@/lib/hooks/useSettings";
import { createAppointment, getBookedTimes } from "@/lib/services/appointments";
import {
  validatePhone,
  validatePlate,
  formatPhone,
  formatPlate,
} from "@/lib/utils/validators";
import {
  generateTimeSlots,
  isPastDate,
  isDateClosed,
} from "@/lib/utils/date";
import { Loading } from "@/components/Loading";

export const AppointmentForm = () => {
  const router = useRouter();
  const { settings, loading: settingsLoading } = useSettings();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    plate: "",
    appointmentDate: "",
    appointmentTime: "",
    note: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState("");

  const handleDateChange = async (date: string) => {
    setFormData({ ...formData, appointmentDate: date, appointmentTime: "" });
    setDateError("");

    if (!date || !settings) return;

    const selectedDate = new Date(date + "T00:00:00");

    if (isPastDate(selectedDate)) {
      setDateError("Geçmiş bir tarih seçemezsiniz");
      setAvailableTimes([]);
      return;
    }

    const dayOfWeek = selectedDate.getDay();
    if (!settings.workingDays.includes(dayOfWeek)) {
      setDateError("Seçtiğiniz gün çalışma günü değil");
      setAvailableTimes([]);
      return;
    }

    if (isDateClosed(selectedDate, settings.closedDays)) {
      setDateError("Seçtiğiniz gün kapalı");
      setAvailableTimes([]);
      return;
    }

    const allSlots = generateTimeSlots(
      settings.workingHours.start,
      settings.workingHours.end,
      settings.appointmentInterval
    );

    const bookedTimes = await getBookedTimes(date);
    const available = allSlots.filter((slot) => !bookedTimes.includes(slot));

    setAvailableTimes(available);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Ad Soyad gereklidir";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon numarası gereklidir";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Geçerli bir telefon numarası giriniz (05XXXXXXXXX)";
    }

    if (!formData.plate.trim()) {
      newErrors.plate = "Plaka gereklidir";
    } else if (!validatePlate(formData.plate)) {
      newErrors.plate = "Geçerli bir plaka giriniz";
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Randevu tarihi gereklidir";
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Randevu saati gereklidir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await createAppointment({
        name: formData.name.trim(),
        phone: formatPhone(formData.phone),
        plate: formatPlate(formData.plate),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        note: formData.note.trim(),
      });

      router.push("/tesekkur");
    } catch {
      alert("Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (settingsLoading) {
    return <Loading />;
  }

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <Input
        label="Ad Soyad"
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        placeholder="Adınız ve soyadınız"
        required
      />

      <Input
        label="Telefon"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        error={errors.phone}
        placeholder="05XXXXXXXXX"
        required
      />

      <Input
        label="Plaka"
        type="text"
        value={formData.plate}
        onChange={(e) =>
          setFormData({ ...formData, plate: e.target.value.toUpperCase() })
        }
        error={errors.plate}
        placeholder="34ABC123"
        required
      />

      <div>
        <Input
          label="Randevu Tarihi"
          type="date"
          value={formData.appointmentDate}
          onChange={(e) => handleDateChange(e.target.value)}
          error={errors.appointmentDate || dateError}
          min={minDate}
          required
        />
      </div>

      {formData.appointmentDate && !dateError && availableTimes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Randevu Saati
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableTimes.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, appointmentTime: time })
                }
                className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                  formData.appointmentTime === time
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-300 hover:border-blue-300"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {errors.appointmentTime && (
            <p className="mt-1 text-sm text-red-600">{errors.appointmentTime}</p>
          )}
        </div>
      )}

      {formData.appointmentDate && !dateError && availableTimes.length === 0 && (
        <p className="text-sm text-red-600">
          Seçtiğiniz tarihte müsait saat bulunmamaktadır.
        </p>
      )}

      <Textarea
        label="Not (İsteğe Bağlı)"
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        placeholder="Varsa eklemek istediğiniz notlar..."
        rows={4}
      />

      <Button type="submit" fullWidth loading={loading}>
        Randevu Oluştur
      </Button>
    </form>
  );
};
