import { notFound, ok } from "@/lib/server/http";
import { getSessionById } from "@/lib/server/session-store";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const session = getSessionById(id);
  if (!session) {
    return notFound("Session not found.");
  }
  return ok({ session });
}

