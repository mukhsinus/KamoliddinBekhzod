import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

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
        ← Back
      </button>

      <h1 className="text-3xl font-bold">
        Submission Details
      </h1>

      {/* META */}
      <div className="bg-white border rounded-xl p-6 space-y-4">

        <div>
          <strong>Author:</strong>{" "}
          {data.user.firstName} {data.user.lastName}
        </div>

        <div>
          <strong>Email:</strong> {data.user.email}
        </div>

        <div>
          <strong>Nomination:</strong> {data.nomination}
        </div>

        <div>
          <strong>Status:</strong> {data.status}
        </div>

        <div>
          <strong>Submitted:</strong>{" "}
          {new Date(data.createdAt).toLocaleString()}
        </div>

      </div>

      {/* WORK DESCRIPTION */}
      {data.workDescription && (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-2">
            Work Description
          </h2>
          <p className="text-gray-700">
            {data.workDescription}
          </p>
        </div>
      )}

      {/* WORK FILES */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Works</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.works.map((work) => (
            <a
              key={work}
              href={work}
              target="_blank"
              rel="noreferrer"
              className="block border rounded-lg overflow-hidden"
            >
              <img
                src={work}
                alt="work"
                className="w-full h-40 object-cover"
              />
            </a>
          ))}
        </div>
      </div>

      {/* EVALUATIONS */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">
          Jury Evaluations
        </h2>

        {average && (
          <div className="text-lg font-bold">
            Average Score: {average}
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
            <div>Score: {evalItem.score}</div>
            {evalItem.comment && (
              <div className="text-sm text-gray-600 mt-2">
                {evalItem.comment}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={() =>
            updateStatus.mutate("approved")
          }
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Approve
        </button>

        <button
          onClick={() =>
            updateStatus.mutate("rejected")
          }
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Reject
        </button>
      </div>

    </div>
  );
}