import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";

import ProfileShell from "@/components/profile/ProfileShell";
import ProfileApplicationForm from "@/pages/ProfileApplicationForm";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        {/* PROFILE TAB */}
        <TabsContent value="profile">
          <Card>
            <CardContent className="space-y-8">

              {/* AVATAR */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={avatarPreview}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#d4af37] shadow-md"
                  />

                  {edit && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAvatarFile(file);
                            const blobUrl = URL.createObjectURL(file);
                            setAvatarPreview(blobUrl);
                          }
                        }}
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition"
                      >
                        Изменить
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* FORM */}
              <div className="grid md:grid-cols-2 gap-6">
                {(
                  ["firstName", "lastName", "age", "city", "email", "phone"] as const
                ).map((field) => (
                  <input
                    key={field}
                    value={form[field] ?? ""}
                    disabled={!edit}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev ? { ...prev, [field]: e.target.value } : prev
                      )
                    }
                    className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-ring"
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() =>
                    edit ? handleProfileSave() : setEdit(true)
                  }
                  disabled={saving}
                  className="px-8 py-3 bg-[#1f2f57] text-white rounded-lg hover:bg-[#2e4379] transition disabled:opacity-50"
                >
                  {saving
                    ? t("profile.saving")
                    : edit
                    ? t("profile.save")
                    : t("profile.edit")}
                </button>
              </div>

              <PasswordChangeSection />

            </CardContent>
          </Card>
        </TabsContent>

        {/* APPLICATIONS TAB */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("profile.tabs.applications")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              {apps.length === 0 ? (
                <p className="text-muted-foreground">
                  {t("profile.applications.empty")}
                </p>
              ) : (
                apps.map((app) => (
                  <div
                    key={app._id}
                    className="border-b pb-4"
                  >
                    <div className="font-medium">
                      {app.nomination}
                    </div>

                    {app.workDescription && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {app.workDescription}
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground mt-1">
                      {t("profile.applications.status")}: {app.status}
                    </div>

                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}

            </CardContent>
          </Card>

          <div className="mt-10">
            <ProfileApplicationForm onSuccess={refreshSubmissions} />
          </div>
        </TabsContent>

        {/* DIPLOMAS TAB */}
        <TabsContent value="diplomas">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("profile.diplomas.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {diplomas.map((d) => (
                <div
                  key={d._id}
                  className="flex justify-between border-b pb-4"
                >
                  <span>{d.title}</span>
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1f2f57] font-semibold"
                  >
                    {t("profile.diplomas.download")}
                  </a>
                </div>
              ))}

            </CardContent>
          </Card>
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