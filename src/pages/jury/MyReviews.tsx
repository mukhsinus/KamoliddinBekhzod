// src/pages/jury/MyReviews.tsx
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useI18n } from "@/lib/i18n";

interface Review {
  submissionTitle: string;
  score: number;
  comment: string;
  createdAt: string;
}

export default function JuryMyReviews() {
  const { t } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/api/jury/reviews");
      setReviews(res.data);
    };

    load();
  }, []);

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-semibold">
        {t('jury.myReviews')}
      </h2>

      <div className="bg-white border rounded-xl">

        {reviews.map((r, i) => (
          <div
            key={i}
            className="border-b p-4 flex justify-between"
          >
            <div>
              <div className="font-medium">
                {r.submissionTitle}
              </div>

              <div className="text-sm text-gray-500">
                {r.comment}
              </div>
            </div>

            <div className="text-lg font-semibold">
              {r.score}
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}