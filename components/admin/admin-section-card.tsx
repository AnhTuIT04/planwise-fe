import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AdminSectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-[#dcdcdc] bg-white shadow-[0_14px_36px_-30px_rgba(0,0,0,0.55)]", className)}>
      <CardHeader className="border-b border-[#f1eee7] pb-4">
        <CardTitle className="text-base text-[#2d2b27]">{title}</CardTitle>
        <CardDescription className="text-sm text-[#787878]">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}
