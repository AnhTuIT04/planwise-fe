import { cn } from "@/lib/utils";
import { useProjectMutations } from "@/hooks/use-project";
import { useProjectModalStore } from "@/stores/project-modal.store";
import TitleEditor from "@/components/task/modals/modal-content/title-editor";

export default function ProjectEditor() {
  const mode = useProjectModalStore((s) => s.mode);
  const projectId = useProjectModalStore((s) => s.project?.id);
  const name = useProjectModalStore((s) => s.project?.name);
  const setField = useProjectModalStore((s) => s.setField);

  const { updateProjectMutation } = useProjectMutations();

  const handleChangeName = async (newName: string) => {
    // TitleEditor uses TipTap which might return HTML <p>...</p>. 
    // We should probably strip it or extract the text, but keeping it same as task.
    let plainName = newName.replace(/<[^>]*>?/gm, '').trim();
    if (!plainName) plainName = "Untitled Project";

    if (mode === "update" && plainName !== name && projectId) {
      try {
        await updateProjectMutation.mutateAsync({
          projectId,
          name: plainName,
        });
      } catch (error) {
        console.log("Failed to change project name:", error);
      }
    }

    setField("name", plainName);
  };

  return (
    <div className="mt-13 flex w-[calc(100%+4rem)] items-start pr-2 pl-8">
      <TitleEditor
        title={name || ""}
        setTitle={handleChangeName}
        placeholder="Project name..."
        className="w-full max-w-108 min-w-0 pt-1.75 pr-0 pl-0.5 text-[24px] leading-7 font-semibold text-[#413f39]"
      />
    </div>
  );
}
