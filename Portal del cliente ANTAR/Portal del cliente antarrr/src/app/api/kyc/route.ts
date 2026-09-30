import { handleKycSubmission } from "@/features/kyc/submit";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  return handleKycSubmission(request);
}
