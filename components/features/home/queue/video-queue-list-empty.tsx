import {
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useTranslations } from "@/lib/use-translations";
import { FolderArchive } from "lucide-react";

export function VideoQueueListEmpty() {
  const translations = useTranslations();
  return (
    <>
      <EmptyContent>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderArchive />
          </EmptyMedia>
          <EmptyTitle>{translations.home.empty.title}</EmptyTitle>
          <EmptyDescription>
            {translations.home.empty.description}
          </EmptyDescription>
        </EmptyHeader>
      </EmptyContent>
    </>
  );
}
