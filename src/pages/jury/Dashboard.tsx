// src/pages/jury/Dashboard.tsx
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useI18n } from "@/lib/i18n";

interface Stats {
  total: number;
  reviewed: number;
  pending: number;
  averageScore: number;
}

export default function JuryDashboard() {
  const { t } = useI18n();
  const [stats, setStats] = useState<Stats>({
    total: 0,
    reviewed: 0,
    pending: 0,
    averageScore: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/api/jury/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load jury stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div>{t('jury.loadingDashboard')}</div>;
  }

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-semibold">
        {t('jury.title')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title={t('jury.totalSubmissions')}
          value={stats.total}
        />

        <StatCard
          title={t('jury.reviewed')}
          value={stats.reviewed}
        />

        <StatCard
          title={t('jury.pending')}
          value={stats.pending}
        />

        <StatCard
          title={t('jury.averageScore')}
          value={stats.averageScore}
        />

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className="text-sm text-gray-0">
        {title}
      </div>

      <div className="text-3xl font-semibold mt-2">
        {value}
      </div>
    </div>
  );
}