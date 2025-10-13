import { Field, FieldDescription, FieldGroup, FieldSet, FieldTitle } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "@/lib/use-translations";
import { Button } from "../ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { Slider } from "../ui/slider";

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[480px] overflow-hidden px-0 flex flex-col">
        <SheetHeader className="px-4 pt-6 pb-4 border-b">
          <SheetTitle>{t.home.preview.settings.title}</SheetTitle>
          <SheetDescription>{t.home.preview.settings.description}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4 px-4 overflow-y-auto flex-1">
          <div className="w-full max-w-md">
            <form>
              <FieldGroup>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.font}</FieldTitle>
                      <Select value={subtitleFont.toLowerCase()} onValueChange={(value) => setSubtitleFont(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t.home.preview.settings.font} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="arial">{t.home.preview.settings.arial}</SelectItem>
                          <SelectItem value="times-new-roman">{t.home.preview.settings.timesNewRoman}</SelectItem>
                          <SelectItem value="courier-new">{t.home.preview.settings.courierNew}</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.size}</FieldTitle>
                      <FieldDescription>
                        <span className="font-medium tabular-nums">{subtitleSize} px</span>
                      </FieldDescription>
                      <Slider
                        value={[subtitleSize]}
                        onValueChange={(value) => setSubtitleSize(value[0])}
                        max={100}
                        min={1}
                        step={1}
                        className="mt-2 w-full"
                      />
                    </Field>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.color}</FieldTitle>
                      <InputGroup>
                        <InputGroupInput
                          id="color"
                          type="color"
                          className="w-full"
                          value={subtitleColor}
                          onChange={(e) => setSubtitleColor(e.target.value)}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupInput value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} placeholder="#FFFFFF" />
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.outlineColor}</FieldTitle>
                      <InputGroup>
                        <InputGroupInput
                          id="outlineColor"
                          type="color"
                          className="w-full"
                          value={subtitleOutlineColor}
                          onChange={(e) => setSubtitleOutlineColor(e.target.value)}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupInput
                            value={subtitleOutlineColor}
                            onChange={(e) => setSubtitleOutlineColor(e.target.value)}
                            placeholder="#000000"
                          />
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.shadowColor}</FieldTitle>
                      <InputGroup>
                        <InputGroupInput
                          id="shadowColor"
                          type="color"
                          className="w-full"
                          value={subtitleShadowColor}
                          onChange={(e) => setSubtitleShadowColor(e.target.value)}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupInput
                            value={subtitleShadowColor}
                            onChange={(e) => setSubtitleShadowColor(e.target.value)}
                            placeholder="#333333"
                          />
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </form>
          </div>
        </div>

        <SheetFooter className="flex justify-center gap-3 px-4 py-4 border-t">
          <Button variant="default" onClick={() => onOpenChange(false)}>
            {t.home.preview.settings.close}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Settings;
