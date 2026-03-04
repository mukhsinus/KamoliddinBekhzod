// src/pages/jury/Submissions.tsx

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useI18n } from "@/lib/i18n";

interface Submission {
  _id: string;
  title: string;
  nomination: string;
  author: string;
  createdAt: string;
}

export default function JurySubmissions() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const {
    data,
    isLoading,
    isError
  } = useQuery<Submission[]>({
    queryKey: ["jury-submissions"],
    queryFn: async () => {
      const res = await api.get("/api/jury/submissions");
      return res.data;
    }
  });

  /* ===============================
     LOADING STATE
  =============================== */

  if (isLoading) {
    return (
      <div className="space-y-8">

        <h1 className="text-3xl font-semibold">
          {t('jury.submissions')}
        </h1>

        <div className="space-y-4">

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}

        </div>

      </div>
    );
  }

  /* ===============================
     ERROR STATE
  =============================== */

  if (isError) {
    return (
      <div className="text-red-500">
        {t('jury.failedSubmissions')}
      </div>
    );
  }

  /* ===============================
     EMPTY STATE
  =============================== */

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500">
        {t('jury.noSubmissions')}
      </div>
    );
  }

  /* ===============================
     PAGE
  =============================== */

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-semibold">
        {t('jury.submissions')}
      </h1>

      <div className="grid gap-4">

        {data.map((submission) => (

          <div
            key={submission._id}
            className="bg-white border rounded-xl p-6 flex justify-between items-center hover:shadow-sm transition"
          >

            <div>

              <div className="font-medium">
                {submission.title}
              </div>

              <div className="text-sm text-gray-500">
                {submission.nomination} • {submission.author}
              </div>

              <div className="text-xs text-gray-400 mt-1">
                {new Date(submission.createdAt).toLocaleDateString()}
              </div>

            </div>

            <button
              onMouseEnter={() => {
                queryClient.prefetchQuery({
                  queryKey: ["jury-submission", submission._id],
                  queryFn: async () => {
                    const res = await api.get(`/api/jury/submissions/${submission._id}`);
                    return res.data;
                  }
                });
              }}
              onClick={() =>
                navigate(`/jury/submissions/${submission._id}`)
              }
              className="px-4 py-2 bg-[#1f2f57] text-white rounded-md text-sm hover:opacity-90 transition"
            >
              {t('jury.review')}
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}