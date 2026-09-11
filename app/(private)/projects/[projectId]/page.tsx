import { redirect } from "next/navigation";

export default async function ProjectRootPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const pa = await params
  redirect(`/projects/${pa.projectId}/overview`);
}
