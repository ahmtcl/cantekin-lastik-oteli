"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import Select from "@/components/Select";
import { vehicleBrands, vehicleModels } from "@/lib/data/vehicles";
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

type RegistrationType = "bireysel" | "kurumsal" | "rentacar" | "";
type VehicleType = "otomobil" | "4x4" | "";

export const AppointmentForm = () => {
  const router = useRouter();
  const { settings, loading: settingsLoading } = useSettings();
  const [step, setStep] = useState(1);

  // Step 1 data
  const [registrationType, setRegistrationType] = useState<RegistrationType>("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("");
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Step 2 data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    brand: "",
    model: "",
    plate: "",
    appointmentDate: "",
    appointmentTime: "",
    note: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState("");

  const handleStep1Continue = () => {
    const newErrors: Record<string, string> = {};

    if (!registrationType) {
      newErrors.registrationType = "Lütfen kayıt türü seçiniz";
    }
    if (!vehicleType) {
      newErrors.vehicleType = "Lütfen araç türü seçiniz";
    }
    if (!kvkkAccepted) {
      newErrors.kvkk = "KVKK metnini okumanız gerekmektedir";
    }
    if (!privacyAccepted) {
      newErrors.privacy = "Çerez politikasını kabul etmeniz gerekmektedir";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

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

    if (!formData.email.trim()) {
      newErrors.email = "E-posta gereklidir";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }

    if (registrationType === "kurumsal" && !formData.companyName.trim()) {
      newErrors.companyName = "Firma adı gereklidir";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Marka gereklidir";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model gereklidir";
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
        note: `${registrationType.toUpperCase()} | ${vehicleType.toUpperCase()} | ${formData.companyName ? `Firma: ${formData.companyName} | ` : ""}Email: ${formData.email} | Marka: ${formData.brand} | Model: ${formData.model}${formData.note ? ` | Not: ${formData.note}` : ""}`,
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

  // STEP 1: Registration and Vehicle Type Selection
  if (step === 1) {
    return (
      <div className="space-y-8">
        {/* Kayıt Türü */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
            Kayıt Türü
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: "bireysel", label: "Bireysel" },
              { value: "kurumsal", label: "Kurumsal" },
              { value: "rentacar", label: "Rent A Car" },
            ].map((type) => (
              <label
                key={type.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  registrationType === type.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <input
                  type="radio"
                  name="registrationType"
                  value={type.value}
                  checked={registrationType === type.value}
                  onChange={(e) => setRegistrationType(e.target.value as RegistrationType)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="font-medium text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
          {errors.registrationType && (
            <p className="mt-2 text-sm text-red-600">{errors.registrationType}</p>
          )}
        </div>

        {/* Araç Türü */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
            Araç Türü
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: "otomobil", label: "Otomobil" },
              { value: "4x4", label: "4x4" },
            ].map((type) => (
              <label
                key={type.value}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  vehicleType === type.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <input
                  type="radio"
                  name="vehicleType"
                  value={type.value}
                  checked={vehicleType === type.value}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="font-medium text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
          {errors.vehicleType && (
            <p className="mt-2 text-sm text-red-600">{errors.vehicleType}</p>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-4 pt-4 border-t">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={kvkkAccepted}
              onChange={(e) => setKvkkAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-blue-600 rounded"
            />
            <span className="text-gray-700 group-hover:text-gray-900">
              <strong>KVKK Metnini</strong> Okudum
            </span>
          </label>
          {errors.kvkk && <p className="text-sm text-red-600">{errors.kvkk}</p>}

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-blue-600 rounded"
            />
            <span className="text-gray-700 group-hover:text-gray-900">
              <strong>Çerez Politikası</strong> Okudum
            </span>
          </label>
          {errors.privacy && <p className="text-sm text-red-600">{errors.privacy}</p>}
        </div>

        {/* Continue Button */}
        <div className="flex gap-4 pt-6">
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all"
          >
            Geri
          </button>
          <button
            onClick={handleStep1Continue}
            className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            Devam
          </button>
        </div>
      </div>
    );
  }

  // STEP 2: Form Details (Horizontal Layout)
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 pb-4 border-b">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Geri
        </button>
        <span className="text-gray-400">|</span>
        <span className="text-gray-600">Adım 2/2</span>
      </div>

      {/* Kişisel Bilgiler */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
          Kişisel Bilgiler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            label="E-posta"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="ornek@email.com"
            required
          />
        </div>
        
        {registrationType === "kurumsal" && (
          <div className="mt-4">
            <Input
              label="Firma Adı"
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              error={errors.companyName}
              placeholder="Firma adınız"
              required
            />
          </div>
        )}
      </div>

      {/* Araç Bilgileri */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
          Araç Bilgileri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Marka"
            value={formData.brand}
            onChange={(e) => {
              setFormData({ ...formData, brand: e.target.value, model: "" });
            }}
            error={errors.brand}
            options={vehicleBrands}
            required
          />
          <Select
            label="Model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            error={errors.model}
            options={formData.brand ? vehicleModels[formData.brand] || [] : []}
            required
            disabled={!formData.brand}
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
        </div>
      </div>

      {/* Randevu Bilgileri */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
          Randevu Bilgileri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarih Seçimi */}
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

          {/* Saat Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Randevu Saati
              <span className="text-red-500 ml-1">*</span>
            </label>
            {formData.appointmentDate && !dateError && availableTimes.length > 0 ? (
              <select
                value={formData.appointmentTime}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentTime: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.appointmentTime
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                } focus:ring-4 focus:outline-none transition-all bg-white text-gray-900`}
              >
                <option value="">Saat seçiniz...</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            ) : formData.appointmentDate && !dateError && availableTimes.length === 0 ? (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">
                  Bu tarihte müsait saat yok
                </p>
              </div>
            ) : (
              <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl">
                <p className="text-sm text-gray-500">
                  Önce tarih seçiniz
                </p>
              </div>
            )}
            {errors.appointmentTime && (
              <p className="mt-2 text-sm text-red-600">{errors.appointmentTime}</p>
            )}
          </div>
        </div>
      </div>

      {/* Not */}
      <div>
        <Textarea
          label="Not (İsteğe Bağlı)"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          placeholder="Varsa eklemek istediğiniz notlar..."
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all"
        >
          Geri
        </button>
        <Button type="submit" fullWidth loading={loading}>
          Randevu Oluştur
        </Button>
      </div>
    </form>
  );
};
