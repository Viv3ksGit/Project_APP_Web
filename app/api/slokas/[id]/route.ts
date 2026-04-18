import { getSlokaById } from "@/lib/domain/slokas";
import { notFound, ok } from "@/lib/server/http";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const sloka = getSlokaById(id);

  if (!sloka) {
    return notFound("Sloka was not found.");
  }

  return ok({ sloka });
}

