import { redirect } from "next/navigation";

export default function ProjectRootPage({
  params,
}: {
  params: { projectId: string };
}) {
  redirect(`/projects/${params.projectId}/overview`);
}
