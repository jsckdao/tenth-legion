import { PageCondition } from "./DataBase";

function safeParseJSON(str) {
  if (!str) return null;
  try {
    return JSON.parse(str);
  }
  catch(e) {
    return null;
  }
}

export function getPageFromParams(params: any) : PageCondition {
  let page = Object.assign({}, params) as PageCondition;
  page.condition = safeParseJSON(params.condition);
  page.fields = safeParseJSON(params.fields);
  return page;
}
