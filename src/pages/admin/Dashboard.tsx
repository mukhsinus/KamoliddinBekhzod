// src/pages/admin/Dashboard.tsx
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { useI18n } from "@/lib/i18n";


interface DashboardData {
  contest: {
    phase: string;
  };
  users: {
    total: number;
    jury: number;
  };
  submissions: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  nominations: {
    total: number;
  };
  evaluations: {
    total: number;
    averageScore: number;
  };
}

export default function Dashboard() {
  const { t } = useI18n();
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await api.get("/api/dashboard/admin");
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-10">

      {/* PHASE */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('admin.dashboard.title')}</h1>

        <div className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium">
          {t('admin.dashboard.phase')}: {data.contest.phase}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        <StatsCard
          title={t('admin.stats.totalUsers')}
          value={data.users.total}
        />

        <StatsCard
          title={t('admin.stats.juryMembers')}
          value={data.users.jury}
        />

        <StatsCard
          title={t('admin.stats.totalSubmissions')}
          value={data.submissions.total}
        />

        <StatsCard
          title={t('admin.stats.pending')}
          value={data.submissions.pending}
        />

        <StatsCard
          title={t('admin.stats.approved')}
          value={data.submissions.approved}
        />

        <StatsCard
          title={t('admin.stats.rejected')}
          value={data.submissions.rejected}
        />

        <StatsCard
          title={t('admin.stats.nominations')}
          value={data.nominations.total}
        />

        <StatsCard
          title={t('admin.stats.totalEvaluations')}
          value={data.evaluations.total}
        />

        <StatsCard
          title={t('admin.stats.averageScore')}
          value={data.evaluations.averageScore}
        />

      </div>
    </div>
  );
}

/* ============================
   REUSABLE CARD
============================ */

function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border rounded-2xl p-5 sm:p-6 hover:shadow-md transition">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl sm:text-3xl font-bold">{value}</div>
    </div>
  );
}