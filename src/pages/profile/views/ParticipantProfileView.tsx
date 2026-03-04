// ParticipantProfileView.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";

import ProfileShell from "@/components/profile/ProfileShell";

import ProfileInfoSection from "../sections/ProfileInfoSection";
import ApplicationsSection from "../sections/ApplicationsSection";
import DiplomasSection from "../sections/DiplomasSection";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

type Tab = "profile" | "applications" | "diplomas";

interface ProfileForm {
  firstName: string;
  lastName: string;
  age?: number;
  city?: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface Submission {
  _id: string;
  nomination: string;
  status: string;
  workDescription?: string;
  createdAt: string;
}

interface Diploma {
  _id: string;
  title: string;
  fileUrl: string;
}

export default function ParticipantProfileView() {
  const { user, loading, refreshUser } = useAuth();
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  /* ================= URL TAB SYNC ================= */

  const tabParam = searchParams.get("tab") as Tab | null;

  const activeTab: Tab =
    tabParam === "applications" || tabParam === "diplomas"
      ? tabParam
      : "profile";

  const setTab = (value: Tab) => {
    setSearchParams({ tab: value });
  };

  /* ================= STATE ================= */

  const [form, setForm] = useState<ProfileForm | null>(null);
  const [apps, setApps] = useState<Submission[]>([]);
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);

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

  /* ================= LOAD EXTRA DATA ================= */

  useEffect(() => {
    if (!user) return;

    const loadExtra = async () => {
      try {
        const [subsRes, diplomasRes] = await Promise.all([
          api.get("/api/submissions/me"),
          api.get("/api/diplomas/my"),
        ]);

        setApps(subsRes.data);
        setDiplomas(diplomasRes.data);
      } catch {
        setError(t("profile.error.load"));
      }
    };

    loadExtra();
  }, [user, t]);

  /* ================= CLEANUP BLOB ================= */

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  /* ================= REFRESH SUBMISSIONS ================= */

  const refreshSubmissions = async () => {
    try {
      const res = await api.get("/api/submissions/me");
      setApps(res.data);
    } catch {
      console.error("Failed to refresh submissions");
    }
  };

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
        title={t("profile.hero.title")}
        subtitle={t("profile.hero.subtitle")}
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
      title={t("profile.hero.title")}
      subtitle={t("profile.hero.subtitle")}
    >
      {error && (
        <div className="text-red-500 text-center mb-6">{error}</div>
      )}
      {success && (
        <div className="text-green-600 text-center mb-6">{success}</div>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList className="mb-10 bg-muted">
          <TabsTrigger value="profile">
            {t("profile.tabs.profile")}
          </TabsTrigger>
          <TabsTrigger value="applications">
            {t("profile.tabs.applications")}
          </TabsTrigger>
          <TabsTrigger value="diplomas">
            {t("profile.tabs.diplomas")}
          </TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile">
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
          <PasswordChangeSection />
        </TabsContent>

        {/* APPLICATIONS */}
        <TabsContent value="applications">
          <ApplicationsSection
            apps={apps}
            refreshSubmissions={refreshSubmissions}
          />
        </TabsContent>

        {/* DIPLOMAS */}
        <TabsContent value="diplomas">
          <DiplomasSection diplomas={diplomas} />
        </TabsContent>
      </Tabs>
    </ProfileShell>
  );
}

/* ================= PASSWORD CHANGE SECTION ================= */

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

  const validate = (): string | null => {
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
    if (loading) return;

    setSuccess(null);
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

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
          value={form.currentPassword}
          onChange={(e) =>
            setForm({ ...form, currentPassword: e.target.value })
          }
          placeholder={t("profile.password.current")}
          className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-ring"
        />
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) =>
            setForm({ ...form, newPassword: e.target.value })
          }
          placeholder={t("profile.password.new")}
          className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-ring"
        />
        <input
          type="password"
          value={form.confirmNewPassword}
          onChange={(e) =>
            setForm({
              ...form,
              confirmNewPassword: e.target.value,
            })
          }
          placeholder={t("profile.password.confirm")}
          className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#1f2f57] text-white px-6 py-2 rounded-lg hover:bg-[#2e4379] transition disabled:opacity-50"
        >
          {loading
            ? t("profile.saving")
            : t("profile.password.update")}
        </button>

        {success && (
          <div className="text-green-600 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}