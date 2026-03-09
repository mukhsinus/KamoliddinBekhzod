// src/pages/admin/Dashboard.tsx
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { useI18n } from "@/lib/i18n";

interface NominationTop {
  nomination: string;
  submissions?: {
    author: string;
    averageScore: number;
  }[];
}

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
    rejected: number;
  };
  evaluations: {
    total: number;
    averageScore?: number;
  };
  topByNomination?: NominationTop[];
}

/* ========================================
   FIXED ORDER OF NOMINATIONS
======================================== */

const NOMINATION_ORDER = [
  "modern-art",
  "decorative-art",
  "illustration",
  "graphic-design"
];

export default function Dashboard() {

  const { t } = useI18n();

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await api.get("/api/dashboard/admin");
      return res.data;
    },
    refetchInterval: 3000
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const medals = ["🥇", "🥈", "🥉"];

  /* ========================================
     MAP NOMINATIONS TO FIXED ORDER
  ======================================== */

  const rankingMap = new Map<string, NominationTop>();

  (data.topByNomination || []).forEach(n => {
    rankingMap.set(n.nomination, n);
  });

  const nominations = NOMINATION_ORDER.map(slug => ({
    nomination: slug,
    submissions: rankingMap.get(slug)?.submissions || []
  }));

  return (
    <div className="space-y-10">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <h1 className="text-3xl font-bold">
          {t("admin.dashboard.title")}
        </h1>

        <div className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium">
          {t("admin.dashboard.phase")}: {data.contest.phase}
        </div>

      </div>

      {/* MAIN STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        <StatsCard
          title={t("admin.stats.totalUsers")}
          value={data.users.total}
        />

        <StatsCard
          title={t("admin.stats.juryMembers")}
          value={data.users.jury}
        />

        <StatsCard
          title={t("admin.stats.totalSubmissions")}
          value={data.submissions.total}
        />

        <StatsCard
          title={t("admin.stats.pending")}
          value={data.submissions.pending}
        />

        <StatsCard
          title={t("admin.stats.rejected")}
          value={data.submissions.rejected}
        />

        <StatsCard
          title={t("admin.stats.totalEvaluations")}
          value={data.evaluations.total}
        />

      </div>

      {/* TOP 3 */}

      <div className="space-y-6">

        <h2 className="text-2xl font-semibold">
          {t("admin.dashboard.topByNomination")}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {nominations.map((nom) => {

            const submissions = nom.submissions ?? [];

            return (

              <div
                key={nom.nomination}
                className="bg-white border rounded-2xl p-6"
              >

                <div className="text-lg font-semibold mb-4 capitalize">
                  {nom.nomination.replace("-", " ")}
                </div>

                <div className="space-y-3">

                  {submissions.map((s, index) => (

                    <div
                      key={`${nom.nomination}-${index}`}
                      className="flex justify-between text-sm"
                    >

                      <span className="flex items-center gap-2">
                        {medals[index] ?? `#${index + 1}`} {s.author}
                      </span>

                      <span className="font-medium">
                        {Number(s.averageScore ?? 0).toFixed(2)}
                      </span>

                    </div>

                  ))}

                  {submissions.length === 0 && (
                    <div className="text-sm text-gray-400">
                      No evaluations yet
                    </div>
                  )}

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}

/* ========================================
   STATS CARD
======================================== */

function StatsCard({
  title,
  value
}: {
  title: string;
  value: number;
}) {

  return (

    <div className="bg-white border rounded-2xl p-5 sm:p-6 hover:shadow-md transition">

      <div className="text-sm text-gray-500">
        {title}
      </div>

      <div className="mt-2 text-2xl sm:text-3xl font-bold">
        {value}
      </div>

    </div>

  );

}