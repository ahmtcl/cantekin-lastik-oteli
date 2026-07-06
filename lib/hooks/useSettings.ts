"use client";

import { useEffect, useState } from "react";
import { Settings } from "@/lib/types";
import { getSettings } from "@/lib/services/settings";

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ayarlar yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};
