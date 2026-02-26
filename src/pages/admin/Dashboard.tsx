// Dashboard.tsx
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

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
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await api.get("/api/dashboard/admin");
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
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
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium">
          Phase: {data.contest.phase}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid gap-6 md:grid-cols-3">

        <StatsCard
          title="Total Users"
          value={data.users.total}
        />

        <StatsCard
          title="Jury Members"
          value={data.users.jury}
        />

        <StatsCard
          title="Total Submissions"
          value={data.submissions.total}
        />

        <StatsCard
          title="Pending"
          value={data.submissions.pending}
        />

        <StatsCard
          title="Approved"
          value={data.submissions.approved}
        />

        <StatsCard
          title="Rejected"
          value={data.submissions.rejected}
        />

        <StatsCard
          title="Nominations"
          value={data.nominations.total}
        />

        <StatsCard
          title="Total Evaluations"
          value={data.evaluations.total}
        />

        <StatsCard
          title="Average Score"
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
    <div className="bg-white shadow-sm border rounded-xl p-6">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}