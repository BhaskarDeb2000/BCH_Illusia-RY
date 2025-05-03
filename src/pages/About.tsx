import { Helmet } from "react-helmet-async";
import { useTranslation } from "@/i18n";
import { PageHeader } from "@/components/ui/PageHeader";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t("common.about")}</title>
      </Helmet>

      <PageHeader
        title={t("common.about")}
        description={t("common.aboutDescription")}
      />

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-lg">{t("common.aboutContent1")}</p>
        <p>{t("common.aboutContent2")}</p>
      </div>
    </div>
  );
};

export default About;
