import JsonLd from "./JsonLd";
import { buildOrganizationSchema, buildWebSiteSchema } from "../../lib/seo/json-ld";

export default function GlobalStructuredData() {
  return (
    <JsonLd data={[buildOrganizationSchema(), buildWebSiteSchema()]} />
  );
}
