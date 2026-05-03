import { cn } from "@/lib/utils";
import { useMemberModalStore } from "@/stores/member-modal.store";
import TitleEditor from "@/components/task/modals/modal-content/title-editor";

export default function MemberEditor() {
  const mode = useMemberModalStore((s) => s.mode);
  const email = useMemberModalStore((s) => s.member.email);
  const setField = useMemberModalStore((s) => s.setField);

  const handleChangeEmail = (newEmail: string) => {
    // TitleEditor uses TipTap which might return HTML <p>...</p>.
    // Strip HTML tags to get pure email text.
    let plainEmail = newEmail.replace(/<[^>]*>?/gm, '').trim();

    // Autosave is not practical here for email, typically it's saved on form submission.
    setField("email", plainEmail);
  };

  return (
    <div className="mt-13 flex w-[calc(100%+4rem)] flex-col items-start pr-2 pl-8">
      <TitleEditor
        title={email || ""}
        setTitle={handleChangeEmail}
        placeholder={mode === "add" ? "Member email address..." : "Member name or email"}
        className="w-full max-w-108 min-w-0 pt-1.75 pr-0 pl-0.5 text-[24px] leading-7 font-semibold text-[#413f39]"
      />
    </div>
  );
}
