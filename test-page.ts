import { source } from "./app/lib/source";

const params = await source.generateParams();
if (params.length > 0) {
  const page = source.getPage(params[0].slug, params[0].lang);
  console.log("page.file:", page.file);
  console.log("page.absolutePath:", (page as any).absolutePath);
}
