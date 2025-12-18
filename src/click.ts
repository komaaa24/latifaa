import { v4 as uuidv4 } from "uuid";

/**
 * Click Error Codes
 */
export const ClickErrorCodes = {
  SUCCESS: 0,
  SIGN_CHECK_FAILED: -1,
  INVALID_AMOUNT: -2,
  ACTION_NOT_FOUND: -3,
  ALREADY_PAID: -4,
  USER_NOT_FOUND: -5,
  TRANSACTION_NOT_FOUND: -6,
  FAILED_TO_UPDATE: -7,
  UNKNOWN_ERROR: -8,
  TRANSACTION_CANCELLED: -9
} as const;

/**
 * Click xatolik kodlari
 */
export function getClickErrorMessage(errorCode: number): string {
  const messages: Record<number, string> = {
    [-1]: "Invalid signature",
    [-2]: "Invalid amount",
    [-3]: "Action not found",
    [-4]: "Already paid",
    [-5]: "User not found",
    [-6]: "Transaction not found",
    [-7]: "Failed to update",
    [-8]: "Unknown error",
    [-9]: "Transaction cancelled",
    [-2046]: "Subscriber not found in Click system"
  };
  return messages[errorCode] || `Unknown error: ${errorCode}`;
}

/**
 * Click to'lov linkini generatsiya qilish
 * Format: https://my.click.uz/services/pay?service_id=...&merchant_id=...
 * 
 * IMPORTANT: URLSearchParams() ishlatmaslik kerak!
 * Chunki u parametrlarni encode qiladi va Click buni yoqtirmaydi
 */
export function generateClickLink(
  amount: number,
  transactionParam?: string,
  userId?: string
): { link: string; tx: string } {
  const tx = transactionParam || uuidv4().replace(/-/g, "");

  const serviceId = process.env.CLICK_SERVICE_ID;
  const merchantId = process.env.CLICK_MERCHANT_ID;
  const returnUrl = process.env.CLICK_RETURN_URL || "https://t.me/latifalar1_bot";

  if (!serviceId || !merchantId) {
    console.error("❌ ERROR: CLICK_SERVICE_ID or CLICK_MERCHANT_ID not found in .env");
    throw new Error("Click configuration incomplete");
  }

  // OCTO proyektidagi format: to'g'ridan-to'g'ri string concatenation
  // URLSearchParams() ishlatmaslik kerak - Click uni encode qilishini yoqtirmaydi!
  const link = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${amount}&transaction_param=${tx}&return_url=${returnUrl}`;

  return { link, tx };
}
