// Logs.tsx
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/services/api";

interface Log {
  _id: string;
  action: string;
  targetId?: string;
  meta?: any;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

interface PaginatedResponse {
  data: Log[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function Logs() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [userId, setUserId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data, isLoading } = useQuery<PaginatedResponse>({
    queryKey: ["admin-logs", page, action, userId, from, to],
    queryFn: async () => {
      const res = await api.get("/api/logs/admin", {
        params: {
          page,
          limit: 10,
          action: action || undefined,
          user: userId || undefined,
          from: from || undefined,
          to: to || undefined
        }
      });
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">System Logs</h1>

      {/* FILTERS */}
      <div className="
        grid gap-4
        sm:grid-cols-2
        lg:grid-cols-4
      ">

        <input
          placeholder="Action..."
          value={action}
          onChange={(e) => {
            setPage(1);
            setAction(e.target.value);
          }}
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          placeholder="User ID..."
          value={userId}
          onChange={(e) => {
            setPage(1);
            setUserId(e.target.value);
          }}
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="date"
          value={from}
          onChange={(e) => {
            setPage(1);
            setFrom(e.target.value);
          }}
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="date"
          value={to}
          onChange={(e) => {
            setPage(1);
            setTo(e.target.value);
          }}
          className="w-full border rounded-lg px-4 py-2"
        />

      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-left text-sm">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Action</th>
              <th className="p-4">Target</th>
              <th className="p-4">Meta</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {data.data.map((log) => (
              <tr key={log._id} className="border-b">

                <td className="p-4">
                  {log.user ? (
                    <>
                      <div className="font-medium">
                        {log.user.firstName} {log.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {log.user.email}
                      </div>
                    </>
                  ) : (
                    "System"
                  )}
                </td>

                <td className="p-4 font-medium">
                  {log.action}
                </td>

                <td className="p-4 text-gray-600">
                  {log.targetId || "-"}
                </td>

                <td className="p-4 text-sm text-gray-500">
                  {log.meta
                    ? JSON.stringify(log.meta)
                    : "-"}
                </td>

                <td className="p-4">
                  {new Date(log.createdAt).toLocaleString()}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="
        flex flex-col gap-4
        sm:flex-row sm:items-center sm:justify-between
      ">

        <div>
          Page {data.pagination.page} of {data.pagination.pages}
        </div>

        <div className="space-x-2">

          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>

          <button
            disabled={page >= data.pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}