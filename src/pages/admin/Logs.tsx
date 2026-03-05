// src/pages/admin/Logs.tsx
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/services/api";
import { useI18n } from "@/lib/i18n";

interface Log {
  _id: string;
  action: string;
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

/* ========================================
   FORMAT META FOR ADMIN
======================================== */

function formatMeta(action: string, meta: any) {
  if (!meta) return "-";

  switch (action) {

    case "change_user_status":
      return meta.isActive ? "User activated" : "User deactivated";

    case "change_contest_phase":
      return `${meta.oldPhase} → ${meta.newPhase}`;

    case "evaluate_submission":
      return `Score: ${meta.score}`;

    case "create_submission":
      return `Nomination: ${meta.nomination}`;

    case "change_submission_status":
      return `Status → ${meta.newStatus}`;

    default:
      return "-";
  }
}

export default function Logs() {

  const { t } = useI18n();

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

      <h1 className="text-3xl font-bold">
        {t('admin.logs.title')}
      </h1>

      {/* FILTERS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <input
          placeholder={t('admin.logs.filter.action')}
          value={action}
          onChange={(e) => {
            setPage(1);
            setAction(e.target.value);
          }}
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          placeholder={t('admin.logs.filter.user')}
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
                <th className="p-4">{t('admin.logs.user')}</th>
                <th className="p-4">{t('admin.logs.action')}</th>
                <th className="p-4">{t('admin.logs.target')}</th>
                <th className="p-4">{t('admin.logs.meta')}</th>
                <th className="p-4">{t('admin.logs.date')}</th>
              </tr>
            </thead>

            <tbody>

              {data.data.map((log) => (

                <tr key={log._id} className="border-b">

                  {/* USER */}

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
                      t('admin.system')
                    )}

                  </td>

                  {/* ACTION */}

                  <td className="p-4 font-medium">
                    {log.action}
                  </td>

                  {/* TARGET */}

                  <td className="p-4 text-gray-600">

                    {log.meta?.targetName ? (
                      <>
                        <div>{log.meta.targetName}</div>
                        <div className="text-sm text-gray-500">
                          {log.meta.targetEmail}
                        </div>
                      </>
                    ) : "-"}
                    
                  </td>

                  {/* META */}

                  <td className="p-4 text-sm text-gray-500">
                    {formatMeta(log.action, log.meta)}
                  </td>

                  {/* DATE */}

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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          {t('admin.pagination.page')} {data.pagination.page} {t('admin.pagination.of')} {data.pagination.pages}
        </div>

        <div className="space-x-2">

          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded"
          >
            {t('admin.prev')}
          </button>

          <button
            disabled={page >= data.pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded"
          >
            {t('admin.next')}
          </button>

        </div>

      </div>

    </div>
  );
}