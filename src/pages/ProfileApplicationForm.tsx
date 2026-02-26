// ProfileApplicationForm.tsx

import { useState, useEffect, useRef, useCallback } from "react";
import api from "../services/api";
import { Upload, X, CheckCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

interface Nomination {
  _id: string;
  slug: string;
  title: {
    ru: string;
    en: string;
  };
}

interface Props {
  onSuccess?: () => Promise<void> | void;
}

interface FormState {
  fullName: string;
  education: string;
  nomination: string;
  driveLink: string;
  workDescription: string;
  works: File[];
}

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ProfileApplicationForm({ onSuccess }: Props) {
  const { t, lang } = useI18n();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState<FormState>({
    fullName: "",
    education: "",
    nomination: "",
    driveLink: "",
    workDescription: "",
    works: []
  });

  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  /* =============================
     LOAD NOMINATIONS
  ============================== */

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Nomination[]>("/api/nominations");
        setNominations(res.data);
      } catch {
        setError(t("profile.form.error.loadNominations"));
      }
    };

    load();
  }, [t]);

  /* =============================
     APPLY NOMINATION FROM QUERY
  ============================== */

  useEffect(() => {
    if (!nominations.length) return;

    const slug = searchParams.get("nomination");
    if (!slug) return;

    setForm((prev) => ({ ...prev, nomination: slug }));
  }, [searchParams, nominations]);

  /* =============================
     FILE HANDLING
  ============================== */

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const existingCount = form.works.length;
    const allowedSlots = MAX_FILES - existingCount;

    if (allowedSlots <= 0) {
      setError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const selected = Array.from(files).slice(0, allowedSlots);

    const validFiles: File[] = [];

    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE) {
        setError("One of the files exceeds 5MB");
        continue;
      }
      validFiles.push(file);
    }

    const newPreviews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setForm((prev) => ({
      ...prev,
      works: [...prev.works, ...validFiles]
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
  }, [form.works.length]);

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);

    setForm((prev) => ({
      ...prev,
      works: prev.works.filter((_, i) => i !== index)
    }));

    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* =============================
     CLEANUP PREVIEWS
  ============================== */

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  /* =============================
     SUBMIT
  ============================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.nomination) {
      setError(t("profile.form.error.noNomination"));
      return;
    }

    if (form.works.length === 0) {
      setError(t("profile.form.error.noWorks"));
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("fullName", form.fullName);
      data.append("education", form.education);
      data.append("nomination", form.nomination);

      if (form.driveLink)
        data.append("driveLink", form.driveLink);

      if (form.workDescription)
        data.append("workDescription", form.workDescription);

      form.works.forEach((file) => {
        data.append("works", file);
      });

      await api.post("/api/submissions", data);

      if (onSuccess) await onSuccess();

      setSuccess(true);

      setForm({
        fullName: "",
        education: "",
        nomination: "",
        driveLink: "",
        workDescription: "",
        works: []
      });

      setPreviews([]);

    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
        t("profile.form.error.submit")
      );
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     SUCCESS SCREEN
  ============================== */

  if (success) {
    return (
      <div className="text-center py-24">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-gold" />
        <h3 className="font-display text-3xl font-bold">
          {t("profile.form.success.title")}
        </h3>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          {t("profile.form.success.subtitle")}
        </p>
      </div>
    );
  }

  /* =============================
     UI
  ============================== */

  return (
    <div className="space-y-14">

      <div className="text-center">
        <h2 className="font-display text-3xl font-bold">
          {t("profile.form.title")}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">

        <div className="rounded-2xl border bg-card p-8 shadow-soft space-y-6">

          <input
            value={form.fullName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, fullName: e.target.value }))
            }
            placeholder={t("profile.form.field.fullName")}
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            value={form.education}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, education: e.target.value }))
            }
            placeholder={t("profile.form.field.education")}
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            value={form.driveLink}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, driveLink: e.target.value }))
            }
            placeholder={t("profile.form.field.drive")}
            className="w-full rounded-lg border px-4 py-3"
          />

          <textarea
            value={form.workDescription}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                workDescription: e.target.value
              }))
            }
            placeholder={t("profile.form.field.description")}
            maxLength={10000}
            rows={6}
            className="w-full rounded-lg border px-4 py-3 resize-none"
          />

        </div>

        {/* NOMINATIONS */}
        <div className="flex flex-wrap gap-3">
          {nominations.map((n) => (
            <button
              key={n._id}
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  nomination: n.slug
                }))
              }
              className={`px-5 py-2 rounded-lg border ${
                form.nomination === n.slug
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              {n.title[lang as "ru" | "en"]}
            </button>
          ))}
        </div>

        {/* FILE UPLOAD */}
        <div
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed p-8 text-center rounded-lg"
        >
          <Upload className="mx-auto mb-3" />
          {t("profile.form.upload")}
          <input
            type="file"
            hidden
            multiple
            ref={inputRef}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {previews.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {previews.map((src, i) => (
              <div key={i} className="relative">
                <img
                  src={src}
                  alt="preview"
                  className="w-28 h-28 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gold px-6 py-4 font-medium disabled:opacity-50"
        >
          {loading
            ? t("profile.form.sending")
            : t("profile.form.submit")}
        </button>

      </form>
    </div>
  );
}