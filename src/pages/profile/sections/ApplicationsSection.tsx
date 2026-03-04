import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ProfileApplicationForm from "@/pages/ProfileApplicationForm";
import { useI18n } from "@/lib/i18n";

interface Props {
  apps: any[];
  refreshSubmissions: () => void;
}

export default function ApplicationsSection({
  apps,
  refreshSubmissions,
}: Props) {
  const { t } = useI18n();

  return (
    <>
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
              <div key={app._id} className="border-b pb-4">
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
    </>
  );
}