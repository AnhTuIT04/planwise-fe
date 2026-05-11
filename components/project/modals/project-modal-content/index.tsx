import ProjectEditor from "./project-editor";
import ProjectDescription from "./project-description";

export default function ProjectModalContent() {
  return (
    <div className="flex w-full flex-col items-center">
      <ProjectEditor />
      <ProjectDescription />
    </div>
  );
}
