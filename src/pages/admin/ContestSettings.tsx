// pages/admin/ContestSettings.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import api from "@/services/api";

interface ContestSettings {
  phase: "submission" | "evaluation" | "finished";
  submissionDeadline?: string | null;
  evaluationDeadline?: string | null;
}

export default function ContestSettings() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ContestSettings>({
    queryKey: ["admin-contest-settings"],
    queryFn: async () => {
      const res = await api.get("/api/contest");
      return res.data;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (payload: Partial<ContestSettings>) => {
      await api.patch("/api/contest", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-contest-settings"]
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-phase-indicator"]
      });
    }
  });

  const [phase, setPhase] =
    useState<ContestSettings["phase"]>("submission");
  const [submissionDeadline, setSubmissionDeadline] =
    useState("");
  const [evaluationDeadline, setEvaluationDeadline] =
    useState("");

  useEffect(() => {
    if (data) {
      setPhase(data.phase);
      setSubmissionDeadline(
        data.submissionDeadline
          ? data.submissionDeadline.slice(0, 16)
          : ""
      );
      setEvaluationDeadline(
        data.evaluationDeadline
          ? data.evaluationDeadline.slice(0, 16)
          : ""
      );
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-72 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-72 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">
        Contest Settings
      </h1>

      {/* PHASE CONTROL */}
      <div className="rounded-2xl p-5 sm:p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Contest Phase
          </label>

          <select
            value={phase}
            onChange={(e) => {
              const newPhase =
                e.target.value as ContestSettings["phase"];

              setPhase(newPhase);

              updateSettings.mutate({
                phase: newPhase
              });
            }}
            className="border rounded-lg px-4 py-2"
          >
            <option value="submission">
              Submission
            </option>
            <option value="evaluation">
              Evaluation
            </option>
            <option value="finished">
              Finished
            </option>
          </select>
        </div>
      </div>

      {/* DEADLINES */}
      <div className="w-full sm:w-auto border rounded-lg px-4 py-2">
        <h2 className="text-xl font-semibold">
          Deadlines
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Submission Deadline
            </label>

            <input
              type="datetime-local"
              value={submissionDeadline}
              onChange={(e) =>
                setSubmissionDeadline(e.target.value)
              }
              className="border rounded-lg px-4 py-2"
            />

            <button
              onClick={() =>
                updateSettings.mutate({
                  submissionDeadline:
                    submissionDeadline || null
                })
              }
              className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Evaluation Deadline
            </label>

            <input
              type="datetime-local"
              value={evaluationDeadline}
              onChange={(e) =>
                setEvaluationDeadline(e.target.value)
              }
              className="border rounded-lg px-4 py-2"
            />

            <button
              onClick={() =>
                updateSettings.mutate({
                  evaluationDeadline:
                    evaluationDeadline || null
                })
              }
              className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}