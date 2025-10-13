import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "@/lib/use-translations";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtitleFont: string;
  setSubtitleFont: (font: string) => void;
  subtitleSize: number;
  setSubtitleSize: (size: number) => void;
  subtitleColor: string;
  setSubtitleColor: (color: string) => void;
  subtitleBold: boolean;
  setSubtitleBold: (bold: boolean) => void;
  subtitleItalic: boolean;
  setSubtitleItalic: (italic: boolean) => void;
  subtitleUnderline: boolean;
  setSubtitleUnderline: (underline: boolean) => void;
  subtitleOutlineColor: string;
  setSubtitleOutlineColor: (color: string) => void;
  subtitleOutlineThickness: number;
  setSubtitleOutlineThickness: (thickness: number) => void;
  subtitleShadow: number;
  setSubtitleShadow: (shadow: number) => void;
  subtitleShadowColor: string;
  setSubtitleShadowColor: (color: string) => void;
  format: string;
  setFormat: (format: string) => void;
  chunkNumber: number;
  setChunkNumber: (chunks: number) => void;
  yAxisAlignment: number;
  setYAxisAlignment: (position: number) => void;
}

export const Settings = ({
  open,
  onOpenChange,
  subtitleFont,
  setSubtitleFont,
  subtitleSize,
  setSubtitleSize,
  subtitleColor,
  setSubtitleColor,
  subtitleBold,
  setSubtitleBold,
  subtitleItalic,
  setSubtitleItalic,
  subtitleUnderline,
  setSubtitleUnderline,
  subtitleOutlineColor,
  setSubtitleOutlineColor,
  subtitleOutlineThickness,
  setSubtitleOutlineThickness,
  subtitleShadow,
  setSubtitleShadow,
  subtitleShadowColor,
  setSubtitleShadowColor,
  format,
  setFormat,
  chunkNumber,
  setChunkNumber,
  yAxisAlignment,
  setYAxisAlignment,
}: SettingsProps) => {
  const t = useTranslations();

  console.log(subtitleFont);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[480px] overflow-hidden px-0 flex flex-col">
        <SheetHeader className="px-4 pt-6 pb-4 border-b">
          <SheetTitle>{t.home.upload.settings.title}</SheetTitle>
          <SheetDescription>{t.home.upload.settings.description}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4 px-4 overflow-y-auto flex-1">
          <div className="w-full max-w-md">
            <form>
              <FieldGroup>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="checkout-7j9-card-name-43j">Font</FieldLabel>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a font" />
                        </SelectTrigger>
                        <SelectContent defaultValue={subtitleFont.toLowerCase()}>
                          <SelectItem value="arial">Arial</SelectItem>
                          <SelectItem value="times-new-roman">Times New Roman</SelectItem>
                          <SelectItem value="courier-new">Courier New</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </form>
          </div>
        </div>

        <SheetFooter className="flex justify-center gap-3 px-4 py-4 border-t">
          <Button variant="default" onClick={() => onOpenChange(false)}>
            {t.home.upload.settings.close}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Settings;
