// pages/admin/Submissions.tsx
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { useI18n } from "@/lib/i18n";

interface Submission {
  _id: string;
  fullName: string;
  nomination: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
}

interface PaginatedResponse {
  data: Submission[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function Submissions() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<PaginatedResponse>({
    queryKey: ["admin-submissions", page],
    queryFn: async () => {
      const res = await api.get(
        "/api/submissions/admin/all",
        { params: { page, limit: 10 } }
      );
      return res.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return null;

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">
        {t('admin.submissions.title')}
      </h1>

      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">{t('admin.submissions.user')}</th>
              <th className="px-4 py-3">{t('admin.submissions.nomination')}</th>
              <th className="px-4 py-3">{t('admin.submissions.status')}</th>
              <th className="px-4 py-3">{t('admin.submissions.date')}</th>
              <th className="px-4 py-3">{t('admin.submissions.details')}</th>
            </tr>
          </thead>

          <tbody>
            {data.data.map((submission) => (
              <tr key={submission._id} className="border-b">

                <td className="px-4 py-3">
                    {submission.user
                      ? `${submission.user.firstName} ${submission.user.lastName}`
                      : t('admin.submissions.deletedUser')}
                </td>

                <td className="px-4 py-3">
                  {submission.nomination}
                </td>

                <td className="px-4 py-3">
                  {submission.status === "pending" && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                      {t('admin.submissions.status.pending')}
                    </span>
                  )}

                  {submission.status === "approved" && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {t('admin.submissions.status.approved')}
                    </span>
                  )}

                  {submission.status === "rejected" && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                      {t('admin.submissions.status.rejected')}
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  {new Date(
                    submission.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-4 py-3">
                  <Link
                    to={`/admin/submissions/${submission._id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {t('admin.submissions.view')}
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded-lg"
        >
          {t('admin.submissions.prev')}
        </button>

        <span>
          {t('admin.submissions.page')} {data.pagination.page} {t('admin.submissions.of')}{" "}
          {data.pagination.pages}
        </span>

        <button
          disabled={page === data.pagination.pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-lg"
        >
          {t('admin.submissions.next')}
        </button>

      </div>

    </div>
  );
}