
// Submissions.tsx
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";

interface Submission {
  _id: string;
  fullName: string;
  nomination: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
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
        Submissions
      </h1>

      <div className="bg-white border rounded-xl overflow-hidden">

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Nomination</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>

          <tbody>
            {data.data.map((submission) => (
              <tr key={submission._id} className="border-b">

                <td className="p-4">
                  {submission.user.firstName}{" "}
                  {submission.user.lastName}
                </td>

                <td className="p-4">
                  {submission.nomination}
                </td>

                <td className="p-4 capitalize">
                  {submission.status}
                </td>

                <td className="p-4">
                  {new Date(
                    submission.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <Link
                    to={`/admin/submissions/${submission._id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    View
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* Pagination */}
      <div className="flex justify-between">

        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded-lg"
        >
          Prev
        </button>

        <span>
          Page {data.pagination.page} of{" "}
          {data.pagination.pages}
        </span>

        <button
          disabled={page === data.pagination.pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-lg"
        >
          Next
        </button>

      </div>

    </div>
  );
}