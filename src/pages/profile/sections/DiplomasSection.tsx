import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

interface Props {
  diplomas: any[];
}

export default function DiplomasSection({ diplomas }: Props) {
  const { t } = useI18n();

  return (
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
  );
}