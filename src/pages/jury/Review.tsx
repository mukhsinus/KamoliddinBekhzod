// src/pages/jury/Review.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

interface Submission {
  _id: string;
  fullName: string;
  nomination: string;
  workDescription?: string;
  works: string[];
}

interface Evaluation {
  _id: string;
  score: number;
  comment?: string;
  jury?: {
    _id: string;
  };
}

export default function JuryReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const [score, setScore] = useState<number>(10);
  const [comment, setComment] = useState("");

  /* ===============================
     LOAD SUBMISSION
  =============================== */

  const { data: submission, isLoading } = useQuery<Submission>({
    queryKey: ["jury-submission", id],
    queryFn: async () => {
      const res = await api.get(`/api/jury/submissions/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  /* ===============================
     LOAD EXISTING REVIEW
  =============================== */

  const { data: existingReview } = useQuery<Evaluation | undefined>({
    queryKey: ["jury-review", id],
    queryFn: async () => {
      const res = await api.get(`/api/evaluations/submission/${id}`);
      return res.data?.find((e: any) => e?.jury?._id) || null;
    },
    enabled: !!id
  });

  /* ===============================
     PREFILL REVIEW
  =============================== */

  useEffect(() => {
    if (existingReview) {
      setScore(existingReview.score);
      setComment(existingReview.comment || "");
    }
  }, [existingReview]);

  /* ===============================
     SUBMIT REVIEW
  =============================== */

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/api/evaluations/${id}`, {
        score,
        comment
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success(t("jury.reviewSaved"));

      queryClient.invalidateQueries({
        queryKey: ["jury-submissions"]
      });

      navigate("/jury/submissions");
    },
    onError: () => {
      toast.error(t("jury.reviewError"));
    }
  });

  if (isLoading) return <div>{t('jury.loading')}</div>;
  if (!submission) return null;

  return (
    <div className="space-y-10">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-semibold">
          {t('jury.reviewSubmission')}
        </h1>
      </div>

      {/* SUBMISSION INFO */}

      <div className="bg-white border rounded-xl p-8 space-y-6">

        <div>
          <div className="font-medium text-lg">
            {submission.fullName}
          </div>

          <div className="text-sm text-gray-500">
            {t("jury.nomination")}: {submission.nomination}
          </div>
        </div>

        {submission.workDescription && (
          <p className="text-gray-700">
            {submission.workDescription}
          </p>
        )}

        {/* WORKS */}

        {submission.works?.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4">

            {submission.works.map((work) => (
              <img
                key={work}
                src={`${import.meta.env.VITE_API_URL}${work}`}
                loading="lazy"
                className="rounded-lg border object-cover"
                alt={t("jury.submissionWork")}
              />
            ))}

          </div>
        )}

      </div>

      {/* SCORE */}

      <div className="bg-white border rounded-xl p-8 space-y-6">

        <h2 className="text-xl font-semibold">
          {t('jury.score')}
        </h2>

        <input
          type="range"
          min={0}
          max={10}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full"
        />

        <div className="text-lg font-medium">
          {score}
        </div>

        <textarea
          placeholder={t('jury.comment')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-lg p-3 min-h-[120px]"
        />

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="px-6 py-3 bg-[#1f2f57] text-white rounded-lg hover:opacity-90 transition"
        >
          {mutation.isPending ? t('jury.saving') : t('jury.submitReview')}
        </button>

      </div>

    </div>
  );
}