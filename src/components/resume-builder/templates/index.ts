import type { TemplateId } from "../types";
import { TemplateGovt } from "./TemplateGovt";
import { TemplateBanking } from "./TemplateBanking";
import { TemplateIT } from "./TemplateIT";
import { TemplateTeaching } from "./TemplateTeaching";
import { TemplateMedical } from "./TemplateMedical";
import { TemplateEngineering } from "./TemplateEngineering";
import { TemplateGeneral } from "./TemplateGeneral";

export const TEMPLATE_COMPONENTS: Record<TemplateId, React.ComponentType<any>> = {
  govt: TemplateGovt,
  banking: TemplateBanking,
  it: TemplateIT,
  teaching: TemplateTeaching,
  medical: TemplateMedical,
  engineering: TemplateEngineering,
  general: TemplateGeneral,
};
