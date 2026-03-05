// pages/admin/SubmissionDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { useI18n } from "@/lib/i18n";

interface Evaluation {
  _id: string;
  score: number;
  comment?: string;
  jury: {
    firstName: string;
    lastName: string;
  };
}

interface Submission {
  _id: string;
  fullName: string;
  education: string;
  driveLink?: string;
  nomination: string;
  status: "pending" | "approved" | "rejected";
  workDescription?: string;
  works: string[];
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function SubmissionDetails() {
  const {t} = useI18n();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Submission>({
    queryKey: ["admin-submission", id],
    queryFn: async () => {
      const res = await api.get(`/api/submissions/admin/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  const { data: evaluations } = useQuery<Evaluation[]>({
    queryKey: ["submission-evaluations", id],
    queryFn: async () => {
      const res = await api.get(
        `/api/evaluations/submission/${id}`
      );
      return res.data;
    },
    enabled: !!id
  });

  const updateStatus = useMutation({
    mutationFn: async (status: Submission["status"]) => {
      await api.patch(`/api/submissions/admin/${id}/status`, {
        status
      });
    },
    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["admin-submission", id]
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-submissions"]
      });

    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  const average =
    evaluations && evaluations.length
      ? (
          evaluations.reduce((sum, e) => sum + e.score, 0) /
          evaluations.length
        ).toFixed(2)
      : null;

  return (
    <div className="space-y-10">

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:underline"
      >
        ← {t('admin.submissionDetails.back')}
      </button>

      <h1 className="text-3xl font-bold">
        {t('admin.submissionDetails.title')}
      </h1>

      {/* META */}
      <div className="bg-white border rounded-2xl p-5 sm:p-6 space-y-4">

        <div>
          <strong>{t('admin.submissionDetails.author')}:</strong>{" "}
          {data.user
            ? `${data.user.firstName} ${data.user.lastName}`
            : t('admin.submissionDetails.deletedUser')}
        </div>

        <div>
          <strong>{t('admin.submissionDetails.email')}:</strong> {data.user ? data.user.email : t('admin.submissionDetails.deletedUser')}
        </div>

        <div>
          <strong>{t('admin.submissionDetails.nomination')}:</strong> {data.nomination}
        </div>

        <div>
          <strong>{t('admin.submissionDetails.status')}:</strong>{" "}
          {data.status === "pending" && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
              {t("admin.submissions.status.pending")}
            </span>
          )}

          {data.status === "approved" && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
              {t("admin.submissions.status.approved")}
            </span>
          )}

          {data.status === "rejected" && (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
              {t("admin.submissions.status.rejected")}
            </span>
          )}
        </div>

        <div>
          <strong>{t('admin.submissionDetails.submitted')}:</strong>{" "}
          {new Date(data.createdAt).toLocaleString()}
        </div>

      </div>

      {/* WORK DESCRIPTION */}
      {data.workDescription && (
        <div className="bg-white border rounded-2xl p-5 sm:p-6">
          <h2 className="font-semibold mb-2">
            {t('admin.submissionDetails.workDescription')}
          </h2>
          <p className="text-gray-700">
            {data.workDescription}
          </p>
        </div>
      )}

      {/* WORK FILES */}
      <div className="bg-white border rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="font-semibold">{t('admin.submissionDetails.works')}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.works.map((work) => (
            <a
              key={work}
              href={work}
              target="_blank"
              rel="noreferrer"
              className="block border rounded-lg overflow-hidden"
            >
              <img
                src={`${import.meta.env.VITE_API_URL}${work}`}
                alt="work"
                className="w-full h-40 object-cover"
              />
            </a>
          ))}
        </div>
      </div>

      {/* EVALUATIONS */}
      <div className="bg-white border rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="font-semibold">
          {t('admin.submissionDetails.juryEvaluations')}
        </h2>

        {average && (
          <div className="text-lg font-bold">
            {t('admin.submissionDetails.averageScore')}: {average}
          </div>
        )}

        {evaluations?.map((evalItem) => (
          <div
            key={evalItem._id}
            className="border rounded-lg p-4"
          >
            <div className="font-medium">
              {evalItem.jury.firstName}{" "}
              {evalItem.jury.lastName}
            </div>
            <div>{t('admin.submissionDetails.score')}: {evalItem.score}</div>
            {evalItem.comment && (
              <div className="text-sm text-gray-600 mt-2">
                {evalItem.comment}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      {data.status === "pending" && (
        <div className="flex flex-col gap-4 sm:flex-row">

          <button
            onClick={() => updateStatus.mutate("approved")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            {t('admin.submissionDetails.approve')}
          </button>

          <button
            onClick={() => updateStatus.mutate("rejected")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            {t('admin.submissionDetails.reject')}
          </button>

        </div>
      )}

    </div>
  );
}