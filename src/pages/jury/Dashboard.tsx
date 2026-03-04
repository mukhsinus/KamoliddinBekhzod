import { useEffect, useState } from "react";
import api from "@/services/api";

interface Stats {
  total: number;
  reviewed: number;
  pending: number;
  averageScore: number;
}

export default function JuryDashboard() {
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
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-semibold">
        Jury Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <StatCard
          title="Total Submissions"
          value={stats.total}
        />

        <StatCard
          title="Reviewed"
          value={stats.reviewed}
        />

        <StatCard
          title="Pending"
          value={stats.pending}
        />

        <StatCard
          title="Average Score"
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
      <div className="text-sm text-gray-500">
        {title}
      </div>

      <div className="text-3xl font-semibold mt-2">
        {value}
      </div>
    </div>
  );
}