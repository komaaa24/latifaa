import { v4 as uuidv4 } from "uuid";
import querystring from "querystring";

export function generateClickLink(amount: number, extraParams?: Record<string,string>) {
  const tx = uuidv4().replace(/-/g, "");
  const params: Record<string,string> = {
    service_id: process.env.CLICK_SERVICE_ID || "",
    merchant_id: process.env.CLICK_MERCHANT_ID || "",
    amount: String(amount),
    transaction_param: tx,
    additional_param3: extraParams?.additional_param3 || uuidv4().replace(/-/g,""),
    additional_param4: extraParams?.additional_param4 || "basic",
    return_url: encodeURIComponent(process.env.CLICK_RETURN_URL || "")
  };

  // Click expects URL like in your example:
  // https://my.click.uz/services/pay?service_id=...&merchant_id=...&amount=...&transaction_param=...&additional_param3=...&additional_param4=...&return_url=...
  // Note: depending on Click merchant config you may need signatures/hashes. Here we build basic link.
  const qs = querystring.stringify(params);
  const link = `https://my.click.uz/services/pay?${qs}`;
  return { link, tx };
}
