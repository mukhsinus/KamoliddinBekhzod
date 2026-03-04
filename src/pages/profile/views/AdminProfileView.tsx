// JuryProfileView.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";

import ProfileShell from "@/components/profile/ProfileShell";
import ProfileInfoSection from "../sections/ProfileInfoSection";

interface ProfileForm {
  firstName: string;
  lastName: string;
  age?: number;
  city?: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export default function AdminProfileView() {
  const { user, loading, refreshUser } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProfileForm | null>(null);

  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] =
    useState<string>("/default-avatar.png");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      city: user.city,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    });

    const avatarUrl = user.avatar?.startsWith("http")
      ? user.avatar
      : user.avatar
      ? `${import.meta.env.VITE_API_URL}${user.avatar}`
      : "/default-avatar.png";

    setAvatarPreview(avatarUrl);
  }, [user]);

  /* ================= CLEANUP BLOB ================= */

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  /* ================= SAVE PROFILE ================= */

  const handleProfileSave = async () => {
    if (!form) return;

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        await api.put("/api/auth/avatar", formData);
      }

      await api.put("/api/auth/me", {
        firstName: form.firstName,
        lastName: form.lastName,
        age: form.age,
        city: form.city,
        phone: form.phone,
        email: form.email,
      });

      await refreshUser();

      setSuccess(t("profile.success"));
      setEdit(false);
      setAvatarFile(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || t("profile.saveError"));
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading || !user || !form) {
    return (
      <ProfileShell
        title="Профиль администратора"
        subtitle="Управление конкурсом и пользователями"
        containerWidth="md"
      >
        <div className="text-center py-20">
          {t("profile.loading")}
        </div>
      </ProfileShell>
    );
  }

  /* ================= UI ================= */

  return (
    <ProfileShell
      title="Профиль администратора"
      subtitle="Управление конкурсом и пользователями"
      containerWidth="md"
    >
      {error && (
        <div className="text-red-500 text-center mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-600 text-center mb-6">
          {success}
        </div>
      )}

      {/* PROFILE */}
      <ProfileInfoSection
        form={form}
        setForm={setForm}
        edit={edit}
        setEdit={setEdit}
        saving={saving}
        handleProfileSave={handleProfileSave}
        avatarPreview={avatarPreview}
        setAvatarFile={setAvatarFile}
        setAvatarPreview={setAvatarPreview}
      />

      {/* PASSWORD */}
      <PasswordChangeSection />

      {/* ADMIN PANEL BUTTON */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => navigate("/admin")}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:opacity-90 transition"
        >
          Перейти в админ-панель
        </button>
      </div>
    </ProfileShell>
  );
}

/* ================= PASSWORD CHANGE ================= */

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

function PasswordChangeSection() {
  const { t } = useI18n();

  const [form, setForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmNewPassword
    )
      return t("profile.password.error");

    if (form.newPassword.length < 6)
      return t("profile.password.error");

    if (form.newPassword !== form.confirmNewPassword)
      return t("profile.password.error");

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.put("/api/auth/change-password", form);

      setSuccess(t("profile.password.success"));

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          t("profile.password.error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t space-y-6">
      <h3 className="text-xl font-serif">
        {t("profile.password.title")}
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="password"
          placeholder={t("profile.password.current")}
          value={form.currentPassword}
          onChange={(e) =>
            setForm({ ...form, currentPassword: e.target.value })
          }
          className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-ring"
        />

        <input
          type="password"
          placeholder={t("profile.password.new")}
          value={form.newPassword}
          onChange={(e) =>
            setForm({ ...form, newPassword: e.target.value })
          }
          className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-ring"
        />

        <input
          type="password"
          placeholder={t("profile.password.confirm")}
          value={form.confirmNewPassword}
          onChange={(e) =>
            setForm({
              ...form,
              confirmNewPassword: e.target.value,
            })
          }
          className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
        >
          {loading
            ? t("profile.saving")
            : t("profile.password.update")}
        </button>

        {success && (
          <div className="text-green-600 text-sm">{success}</div>
        )}

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
      </div>
    </div>
  );
}