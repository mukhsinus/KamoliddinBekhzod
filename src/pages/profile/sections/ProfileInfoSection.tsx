// ProfileInfoSection.tsx
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

interface Props {
  form: any;
  setForm: any;
  edit: boolean;
  setEdit: (v: boolean) => void;
  saving: boolean;
  handleProfileSave: () => void;
  avatarPreview: string;
  setAvatarFile: (file: File | null) => void;
  setAvatarPreview: (url: string) => void;
}

export default function ProfileInfoSection({
  form,
  setForm,
  edit,
  setEdit,
  saving,
  handleProfileSave,
  avatarPreview,
  setAvatarFile,
  setAvatarPreview,
}: Props) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
                setForm((prev: any) =>
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

      </CardContent>
    </Card>
  );
}