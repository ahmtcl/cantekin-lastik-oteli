"use client";

import { useEffect, useState, FormEvent } from "react";
import { Container } from "@/components/Container";
import { Loading } from "@/components/Loading";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { getSettings, updateSettings } from "@/lib/services/settings";
import { Settings } from "@/lib/types";

const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

export default function AyarlarPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch {
        alert("Ayarlar yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleDayToggle = (day: number) => {
    if (!settings) return;

    const workingDays = settings.workingDays.includes(day)
      ? settings.workingDays.filter((d) => d !== day)
      : [...settings.workingDays, day].sort();

    setSettings({ ...settings, workingDays });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      await updateSettings(settings);
      alert("Ayarlar başarıyla kaydedildi");
    } catch {
      alert("Ayarlar kaydedilirken bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayarlar</h1>
          <p className="text-gray-600">Randevu sistemi ayarlarını yönetin</p>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Çalışma Günleri
              </h2>
              <div className="grid grid-cols-7 gap-2">
                {dayNames.map((dayName, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDayToggle(index)}
                    className={`py-2 px-3 rounded-lg border-2 transition-colors ${
                      settings.workingDays.includes(index)
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-300 text-gray-600"
                    }`}
                  >
                    {dayName}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Çalışma Saatleri
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Başlangıç"
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      workingHours: {
                        ...settings.workingHours,
                        start: e.target.value,
                      },
                    })
                  }
                  required
                />
                <Input
                  label="Bitiş"
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      workingHours: {
                        ...settings.workingHours,
                        end: e.target.value,
                      },
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Randevu Aralığı
              </h2>
              <div className="max-w-xs">
                <Input
                  label="Dakika"
                  type="number"
                  value={settings.appointmentInterval.toString()}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appointmentInterval: parseInt(e.target.value),
                    })
                  }
                  min="15"
                  step="15"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={saving}>
                Ayarları Kaydet
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
