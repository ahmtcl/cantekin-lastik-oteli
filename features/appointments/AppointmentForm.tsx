"use client";

import { useState, useEffect, FormEvent } from "react";
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
  validateEmail,
  validateName,
  validateDate,
  validateTime,
  sanitizeString,
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
type TireSeasonType = "yazlik" | "kislik" | "dort-mevsim" | "";

export const AppointmentForm = () => {
  const router = useRouter();
  const { settings, loading: settingsLoading } = useSettings();
  const [step, setStep] = useState(1);

  // Step 1 data
  const [registrationType, setRegistrationType] = useState<RegistrationType>("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("");
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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

  // Service selection data
  const [wantToBuyProduct, setWantToBuyProduct] = useState(false);
  const [wantToChangeTire, setWantToChangeTire] = useState(false);
  const [productOptions, setProductOptions] = useState({
    summerTire: false,
    winterTire: false,
    allSeasonTire: false,
    rim: false,
    battery: false,
  });
  const [changeTireOptions, setChangeTireOptions] = useState({
    newTire: false,
    tiresWithMe: false,
    tiresAtHotel: false,
  });
  const [tireSize, setTireSize] = useState("");
  const [tireSeason, setTireSeason] = useState<TireSeasonType>("");
  const [hotelPlateNumber, setHotelPlateNumber] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState({ num1: 0, num2: 0 });
  const [securityAnswer, setSecurityAnswer] = useState("");

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
    console.log("handleDateChange called with date:", date);
    console.log("settings:", settings);
    setFormData({ ...formData, appointmentDate: date, appointmentTime: "" });
    setDateError("");
    setAvailableTimes([]);

    if (!date) return;

    if (!settings) {
      console.log("Settings not loaded yet");
      setDateError("Ayarlar yükleniyor...");
      return;
    }

    try {
      const selectedDate = new Date(date + "T00:00:00");
      console.log("Selected date:", selectedDate);

      if (isPastDate(selectedDate)) {
        setDateError("Geçmiş bir tarih seçemezsiniz");
        return;
      }

      const dayOfWeek = selectedDate.getDay();
      console.log("Day of week:", dayOfWeek, "Working days:", settings.workingDays);
      if (!settings.workingDays.includes(dayOfWeek)) {
        setDateError("Seçtiğiniz gün çalışma günü değil");
        return;
      }

      if (isDateClosed(selectedDate, settings.closedDays)) {
        setDateError("Seçtiğiniz gün kapalı");
        return;
      }

      console.log("Generating time slots...");
      const allSlots = generateTimeSlots(
        settings.workingHours.start,
        settings.workingHours.end,
        settings.appointmentInterval
      );
      console.log("All slots:", allSlots);

      console.log("Fetching booked times...");
      const bookedTimes = await getBookedTimes(date);
      console.log("Booked times:", bookedTimes);
      
      const available = allSlots.filter((slot) => !bookedTimes.includes(slot));
      console.log("Available times:", available);

      setAvailableTimes(available);
    } catch (error) {
      console.error("Saat kontrolü hatası:", error);
      setDateError("Müsait saatler yüklenirken bir hata oluştu");
    }
  };

  // Settings yüklendiğinde tarih seçiliyse saatleri yükle
  useEffect(() => {
    if (settings && formData.appointmentDate && availableTimes.length === 0 && !dateError) {
      handleDateChange(formData.appointmentDate);
    }
  }, [settings]);

  // Step 2'ye geçildiğinde yeni bir güvenlik sorusu oluştur
  useEffect(() => {
    if (step === 2) {
      const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
      const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
      setSecurityQuestion({ num1, num2 });
      setSecurityAnswer("");
    }
  }, [step]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation - simplified
    if (!formData.name.trim()) {
      newErrors.name = "Ad Soyad gereklidir";
    } else if (formData.name.trim().length < 2 || formData.name.trim().length > 100) {
      newErrors.name = "Ad soyad 2-100 karakter arasında olmalıdır";
    }

    // Phone validation - simplified
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon numarası gereklidir";
    } else if (formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Geçerli bir telefon numarası giriniz";
    }

    // Email validation - simplified
    if (!formData.email.trim()) {
      newErrors.email = "E-posta gereklidir";
    } else if (!formData.email.includes("@") || formData.email.length < 5) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }

    // Company name validation with sanitization
    if (registrationType === "kurumsal" || registrationType === "rentacar") {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "Firma adı gereklidir";
      } else if (formData.companyName.trim().length < 2 || formData.companyName.trim().length > 100) {
        newErrors.companyName = "Firma adı 2-100 karakter arasında olmalıdır";
      }
    }

    // Brand and model validation
    if (!formData.brand.trim()) {
      newErrors.brand = "Marka gereklidir";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model gereklidir";
    }

    // Plate validation - simplified
    if (!formData.plate.trim()) {
      newErrors.plate = "Plaka gereklidir";
    } else if (formData.plate.trim().length < 5 || formData.plate.trim().length > 15) {
      newErrors.plate = "Geçerli bir plaka giriniz";
    }

    // Date validation - simplified
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Randevu tarihi gereklidir";
    }

    // Time validation - simplified
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Randevu saati gereklidir";
    }

    // Service selection validation
    if (!wantToBuyProduct && !wantToChangeTire) {
      newErrors.service = "En az bir hizmet seçmelisiniz";
    }

    if (wantToBuyProduct && !productOptions.summerTire && !productOptions.winterTire && !productOptions.allSeasonTire && !productOptions.rim && !productOptions.battery) {
      newErrors.productOptions = "En az bir ürün seçmelisiniz";
    }

    if (wantToChangeTire && !changeTireOptions.newTire && !changeTireOptions.tiresWithMe && !changeTireOptions.tiresAtHotel) {
      newErrors.changeTireOptions = "Lastik değiştirme seçeneği seçmelisiniz";
    }

    // Tire size validation for product purchase
    if (wantToBuyProduct && (productOptions.summerTire || productOptions.winterTire || productOptions.allSeasonTire) && !tireSize.trim()) {
      newErrors.tireSize = "Lastik ebatı gereklidir";
    }

    // Tire type and size validation for tire change
    if (wantToChangeTire && changeTireOptions.newTire) {
      if (!tireSeason) {
        newErrors.tireSeason = "Lastik mevsimi seçmelisiniz";
      }
      if (!tireSize.trim()) {
        newErrors.tireSize = "Lastik ebatı gereklidir";
      }
    }

    // Hotel plate number validation
    if (wantToChangeTire && changeTireOptions.tiresAtHotel && !hotelPlateNumber.trim()) {
      newErrors.hotelPlateNumber = "Araç plaka numarası gereklidir";
    }

    // Security question validation
    const expectedAnswer = securityQuestion.num1 + securityQuestion.num2;
    if (!securityAnswer) {
      newErrors.securityAnswer = "Güvenlik sorusunu cevaplamanız gerekmektedir";
    } else if (parseInt(securityAnswer) !== expectedAnswer) {
      newErrors.securityAnswer = "Güvenlik sorusunun cevabı hatalı";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      // Build service details
      const serviceDetails: string[] = [];
      
      if (wantToBuyProduct) {
        const products: string[] = [];
        if (productOptions.summerTire) products.push("Yazlık Yeni Lastik");
        if (productOptions.winterTire) products.push("Kışlık Yeni Lastik");
        if (productOptions.allSeasonTire) products.push("Dört Mevsim Lastik");
        if (productOptions.rim) products.push("Jant");
        if (productOptions.battery) products.push("Akü");
        serviceDetails.push(`Yeni Ürün: ${products.join(", ")}`);
      }
      
      if (wantToChangeTire) {
        const changeOptions: string[] = [];
        if (changeTireOptions.newTire) changeOptions.push("Yeni Lastik");
        if (changeTireOptions.tiresWithMe) changeOptions.push("Lastikler Kendimde");
        if (changeTireOptions.tiresAtHotel) changeOptions.push("Lastikler Otelinizde");
        serviceDetails.push(`Lastik Değiştirme: ${changeOptions.join(", ")}`);
      }
      
      if (tireSeason) {
        const seasonMap = { yazlik: "Yazlık", kislik: "Kışlık", "dort-mevsim": "Dört Mevsim" };
        serviceDetails.push(`Mevsim: ${seasonMap[tireSeason]}`);
      }
      
      if (tireSize) {
        serviceDetails.push(`Lastik Ebatı: ${tireSize}`);
      }

      if (hotelPlateNumber) {
        serviceDetails.push(`Araç Plaka No: ${hotelPlateNumber}`);
      }

      // Sanitize inputs but keep it simple - just remove dangerous HTML tags
      const appointmentNote = `${registrationType.toUpperCase()} | ${vehicleType.toUpperCase()}${formData.companyName ? ` | Firma: ${formData.companyName.trim()}` : ""} | ${serviceDetails.join(" | ")}${formData.note ? ` | Not: ${formData.note.trim()}` : ""}`;

      await createAppointment({
        name: formData.name.trim(),
        phone: formatPhone(formData.phone),
        email: formData.email.trim().toLowerCase(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        plate: formatPlate(formData.plate),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        note: appointmentNote,
      });

      // Send email notifications via backend API
      try {
        const emailResponse = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formatPhone(formData.phone),
            email: formData.email.trim().toLowerCase(),
            brand: formData.brand.trim(),
            model: formData.model.trim(),
            plate: formatPlate(formData.plate),
            appointmentDate: formData.appointmentDate,
            appointmentTime: formData.appointmentTime,
            note: appointmentNote,
          }),
        });
        const emailResult = await emailResponse.json();
        console.log("Email result details:", emailResult);
      } catch (emailError) {
        console.error("E-posta gönderilirken hata oluştu:", emailError);
      }

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
              className="w-5 h-5 mt-0.5 text-blue-600 rounded cursor-pointer"
            />
            <span className="text-gray-700 text-sm">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowKvkkModal(true);
                }}
                className="text-blue-600 hover:underline font-semibold focus:outline-none cursor-pointer"
              >
                KVKK Aydınlatma Metnini
              </button>{" "}
              okudum ve kabul ediyorum.
            </span>
          </label>
          {errors.kvkk && <p className="text-sm text-red-600">{errors.kvkk}</p>}

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-blue-600 rounded cursor-pointer"
            />
            <span className="text-gray-700 text-sm">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPrivacyModal(true);
                }}
                className="text-blue-600 hover:underline font-semibold focus:outline-none cursor-pointer"
              >
                Çerez Politikasını
              </button>{" "}
              okudum ve kabul ediyorum.
            </span>
          </label>
          {errors.privacy && <p className="text-sm text-red-600">{errors.privacy}</p>}
        </div>

        {/* Continue Button */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all cursor-pointer"
          >
            Geri
          </button>
          <button
            type="button"
            onClick={handleStep1Continue}
            className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            Devam
          </button>
        </div>

        {/* KVKK Modal */}
        {showKvkkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden transform scale-100 transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-950">
                  KVKK Aydınlatma Metni
                </h3>
                <button
                  type="button"
                  onClick={() => setShowKvkkModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer focus:outline-none"
                >
                  &times;
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="px-6 py-6 overflow-y-auto space-y-4 text-sm text-gray-700 leading-relaxed">
                <h4 className="font-bold text-gray-900 text-base">Kişisel Verilerin Korunması Hakkında Aydınlatma Metni</h4>
                <p>
                  6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla Can Tekin Lastik olarak kişisel verilerinizin güvenliğine önem vermekteyiz.
                </p>

                <h5 className="font-bold text-gray-950 mt-4 text-sm uppercase tracking-wide">1. Toplanan Kişisel Veriler</h5>
                <p>Web sitemiz üzerinden oluşturduğunuz randevu talepleri kapsamında aşağıdaki bilgiler işlenebilmektedir:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Ad Soyad</li>
                  <li>Telefon Numarası</li>
                  <li>E-posta Adresi (varsa)</li>
                  <li>Araç Bilgileri</li>
                  <li>Plaka Bilgisi</li>
                  <li>Randevu Tarihi ve Saati</li>
                  <li>Tarafınızca iletilen diğer bilgiler</li>
                </ul>

                <h5 className="font-bold text-gray-950 mt-4 text-sm uppercase tracking-wide">2. Kişisel Verilerin İşlenme Amaçları</h5>
                <p>Toplanan kişisel verileriniz;</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Lastik değişim ve servis randevularının oluşturulması,</li>
                  <li>Müşteri taleplerinin değerlendirilmesi,</li>
                  <li>Hizmet süreçlerinin planlanması ve yürütülmesi,</li>
                  <li>İletişim faaliyetlerinin gerçekleştirilmesi,</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi,</li>
                  <li>Hizmet kalitesinin artırılması</li>
                </ul>
                <p>amaçlarıyla işlenmektedir.</p>

                <h5 className="font-bold text-gray-950 mt-4 text-sm uppercase tracking-wide">3. Kişisel Verilerin Aktarılması</h5>
                <p>Kişisel verileriniz;</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Kanunen yetkili kamu kurum ve kuruluşlarına,</li>
                  <li>Yasal yükümlülükler kapsamında ilgili mercilere,</li>
                  <li>Hizmetin yürütülmesi amacıyla teknik altyapı sağlayıcılarına,</li>
                </ul>
                <p>KVKK'nın 8. ve 9. maddelerinde belirtilen şartlar çerçevesinde aktarılabilir.</p>

                <h5 className="font-bold text-gray-950 mt-4 text-sm uppercase tracking-wide">4. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</h5>
                <p>Kişisel verileriniz;</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Web sitesi üzerindeki iletişim ve randevu formları,</li>
                  <li>Telefon görüşmeleri,</li>
                  <li>Elektronik iletişim kanalları</li>
                </ul>
                <p>aracılığıyla elektronik ortamda toplanmaktadır.</p>
                <p>Bu veriler, KVKK'nın 5. maddesinde belirtilen hukuki sebepler kapsamında işlenmektedir.</p>

                <h5 className="font-bold text-gray-950 mt-4 text-sm uppercase tracking-wide">5. KVKK Kapsamındaki Haklarınız</h5>
                <p>KVKK'nın 11. maddesi kapsamında;</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                  <li>İşlenmişse bilgi talep etme,</li>
                  <li>Amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                  <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme,</li>
                  <li>Verilerin silinmesini veya yok edilmesini talep etme,</li>
                  <li>Kanuna aykırı işlenmesi nedeniyle zarara uğramanız hâlinde tazminat talep etme</li>
                </ul>
                <p>haklarına sahipsiniz.</p>
                <p>Haklarınıza ilişkin taleplerinizi iletişim bilgilerimiz üzerinden tarafımıza iletebilirsiniz.</p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setKvkkAccepted(true);
                    setShowKvkkModal(false);
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all cursor-pointer text-sm shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-100"
                >
                  Okudum, Kabul Ediyorum
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Çerez Politikası Modal */}
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden transform scale-100 transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-950">
                  Çerez Politikası
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer focus:outline-none"
                >
                  &times;
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="px-6 py-6 overflow-y-auto space-y-4 text-sm text-gray-700 leading-relaxed">
                <h4 className="font-bold text-gray-900 text-base">Çerez Politikası</h4>
                <p>
                  Can Tekin Lastik olarak web sitemizi ziyaret ettiğinizde kullanıcı deneyimini geliştirmek amacıyla çerezlerden yararlanmaktayız.
                </p>

                <h5 className="font-bold text-gray-950 mt-4 text-sm uppercase tracking-wide">Çerez Nedir?</h5>
                <p>Çerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır.</p>

                <h5 className="font-bold text-gray-950 mt-4 text-sm uppercase tracking-wide">Hangi Çerezleri Kullanıyoruz?</h5>
                <p>Web sitemizde aşağıdaki çerez türleri kullanılabilir:</p>
                
                <div className="space-y-3 pl-2">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <strong className="text-gray-900 block text-xs uppercase tracking-wide mb-1">Zorunlu Çerezler</strong>
                    <span className="text-gray-600 text-xs">Web sitesinin doğru şekilde çalışabilmesi için gerekli olan çerezlerdir.</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <strong className="text-gray-900 block text-xs uppercase tracking-wide mb-1">Performans ve Analitik Çerezleri</strong>
                    <span className="text-gray-600 text-xs">Web sitesinin kullanım istatistiklerini analiz ederek hizmet kalitesini artırmamıza yardımcı olur.</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <strong className="text-gray-900 block text-xs uppercase tracking-wide mb-1">İşlevsel Çerezler</strong>
                    <span className="text-gray-600 text-xs">Kullanıcı tercihlerini hatırlayarak daha iyi bir kullanım deneyimi sunar.</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <strong className="text-gray-900 block text-xs uppercase tracking-wide mb-1">Üçüncü Taraf Çerezleri</strong>
                    <span className="text-gray-600 text-xs">Web sitemizde kullanılan Google Maps, Google Fonts, WhatsApp bağlantıları, Google reCAPTCHA gibi üçüncü taraf hizmet sağlayıcıları kendi çerezlerini kullanabilir.</span>
                  </div>
                </div>

                <h5 className="font-bold text-gray-950 mt-4 text-sm uppercase tracking-wide">Çerezlerin Yönetimi</h5>
                <p>
                  Tarayıcı ayarlarınız üzerinden çerezleri dilediğiniz zaman silebilir veya engelleyebilirsiniz. Ancak bazı çerezlerin devre dışı bırakılması web sitesinin bazı bölümlerinin düzgün çalışmamasına neden olabilir.
                </p>
                <p className="text-xs text-gray-500 italic mt-4">
                  Web sitemizi kullanmaya devam ederek bu Çerez Politikası'nı kabul etmiş sayılırsınız.
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setPrivacyAccepted(true);
                    setShowPrivacyModal(false);
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all cursor-pointer text-sm shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-100"
                >
                  Okudum, Kabul Ediyorum
                </button>
              </div>
            </div>
          </div>
        )}
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
        
        {(registrationType === "kurumsal" || registrationType === "rentacar") && (
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

      {/* İstenilen Hizmet */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
          İstenilen Hizmet
        </h3>
        
        {/* Main Service Categories */}
        <div className="space-y-6">
          {/* Yeni Ürün Almak İstiyorum */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer group mb-4">
              <input
                type="checkbox"
                checked={wantToBuyProduct}
                onChange={(e) => {
                  setWantToBuyProduct(e.target.checked);
                  if (!e.target.checked) {
                    setProductOptions({
                      summerTire: false,
                      winterTire: false,
                      allSeasonTire: false,
                      rim: false,
                      battery: false,
                    });
                    if (!wantToChangeTire) {
                      setTireSize("");
                    }
                  }
                }}
                className="w-5 h-5 mt-0.5 text-blue-600 rounded"
              />
              <span className="font-semibold text-gray-900 group-hover:text-blue-600">
                Yeni Ürün Almak İstiyorum
              </span>
            </label>

            {wantToBuyProduct && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 ml-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productOptions.summerTire}
                    onChange={(e) =>
                      setProductOptions({
                        ...productOptions,
                        summerTire: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Yazlık Yeni Lastik</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productOptions.winterTire}
                    onChange={(e) =>
                      setProductOptions({
                        ...productOptions,
                        winterTire: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Kışlık Yeni Lastik</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productOptions.allSeasonTire}
                    onChange={(e) =>
                      setProductOptions({
                        ...productOptions,
                        allSeasonTire: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Dört Mevsim</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productOptions.rim}
                    onChange={(e) =>
                      setProductOptions({
                        ...productOptions,
                        rim: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Jant</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productOptions.battery}
                    onChange={(e) =>
                      setProductOptions({
                        ...productOptions,
                        battery: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Akü</span>
                </label>
              </div>
            )}

            {errors.productOptions && (
              <p className="mt-2 ml-8 text-sm text-red-600">{errors.productOptions}</p>
            )}

            {/* Tire Size for Product Purchase */}
            {wantToBuyProduct && (productOptions.summerTire || productOptions.winterTire || productOptions.allSeasonTire) && (
              <div className="mt-4 ml-8">
                <Input
                  label="Lastik Ebatı"
                  type="text"
                  value={tireSize}
                  onChange={(e) => setTireSize(e.target.value)}
                  error={errors.tireSize}
                  placeholder="Örn: 205/55 R16"
                  required
                />
              </div>
            )}
          </div>

          {/* Lastik Değiştirmek İstiyorum */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer group mb-4">
              <input
                type="checkbox"
                checked={wantToChangeTire}
                onChange={(e) => {
                  setWantToChangeTire(e.target.checked);
                  if (!e.target.checked) {
                    setChangeTireOptions({
                      newTire: false,
                      tiresWithMe: false,
                      tiresAtHotel: false,
                    });
                    setTireSeason("");
                    setHotelPlateNumber("");
                    if (!wantToBuyProduct) {
                      setTireSize("");
                    }
                  }
                }}
                className="w-5 h-5 mt-0.5 text-blue-600 rounded"
              />
              <span className="font-semibold text-gray-900 group-hover:text-blue-600">
                Lastik Değiştirmek İstiyorum
              </span>
            </label>

            {wantToChangeTire && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={changeTireOptions.newTire}
                      onChange={(e) =>
                        setChangeTireOptions({
                          ...changeTireOptions,
                          newTire: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Yeni Lastik</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={changeTireOptions.tiresWithMe}
                      onChange={(e) =>
                        setChangeTireOptions({
                          ...changeTireOptions,
                          tiresWithMe: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Lastikler Kendimde</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={changeTireOptions.tiresAtHotel}
                      onChange={(e) => {
                        setChangeTireOptions({
                          ...changeTireOptions,
                          tiresAtHotel: e.target.checked,
                        });
                        if (!e.target.checked) {
                          setHotelPlateNumber("");
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Lastikler Otelinizde</span>
                  </label>
                </div>

                {/* Hotel Plate Number for Tires at Hotel */}
                {changeTireOptions.tiresAtHotel && (
                  <div className="mt-4 ml-8">
                    <Input
                      label="Araç Plaka No"
                      type="text"
                      value={hotelPlateNumber}
                      onChange={(e) => setHotelPlateNumber(e.target.value.toUpperCase())}
                      error={errors.hotelPlateNumber}
                      placeholder="34ABC123"
                      required
                    />
                  </div>
                )}

                {/* Tire Season and Size for New Tire */}
                {changeTireOptions.newTire && (
                  <div className="mt-4 ml-8 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lastik Mevsimi
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tireSeason"
                            value="yazlik"
                            checked={tireSeason === "yazlik"}
                            onChange={(e) => setTireSeason(e.target.value as TireSeasonType)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Yazlık</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tireSeason"
                            value="kislik"
                            checked={tireSeason === "kislik"}
                            onChange={(e) => setTireSeason(e.target.value as TireSeasonType)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Kışlık</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tireSeason"
                            value="dort-mevsim"
                            checked={tireSeason === "dort-mevsim"}
                            onChange={(e) => setTireSeason(e.target.value as TireSeasonType)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Dört Mevsim</span>
                        </label>
                      </div>
                      {errors.tireSeason && (
                        <p className="mt-2 text-sm text-red-600">{errors.tireSeason}</p>
                      )}
                    </div>

                    <Input
                      label="Lastik Ebatı"
                      type="text"
                      value={tireSize}
                      onChange={(e) => setTireSize(e.target.value)}
                      error={errors.tireSize}
                      placeholder="Örn: 205/55 R16"
                      required
                    />
                  </div>
                )}
              </>
            )}

            {errors.changeTireOptions && (
              <p className="mt-2 ml-8 text-sm text-red-600">{errors.changeTireOptions}</p>
            )}
          </div>

          {errors.service && (
            <p className="text-sm text-red-600">{errors.service}</p>
          )}
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

      {/* Güvenlik Sorusu */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Güvenlik Sorusu
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-sm text-gray-600">
              Lütfen bot olmadığınızı doğrulamak için işlemi yanıtlayın: <strong className="text-blue-600 text-base">{securityQuestion.num1} + {securityQuestion.num2} = ?</strong>
            </p>
          </div>
          <Input
            label="Cevap"
            type="number"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            error={errors.securityAnswer}
            placeholder="İşlem Sonucu"
            required
          />
        </div>
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
