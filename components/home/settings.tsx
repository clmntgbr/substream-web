import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "@/lib/use-translations";
import { ColorPicker } from "../misc/ColorPicker";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

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
      <SheetContent side="right" className="sm:max-w-[500px] overflow-hidden px-0 flex flex-col">
        <SheetHeader className="px-4 pt-6 pb-4 border-b">
          <SheetTitle>{t.home.preview.settings.title}</SheetTitle>
          <SheetDescription>{t.home.preview.settings.description}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-2 px-4 overflow-y-auto flex-1">
          <div className="w-full max-w-md space-y-4">
            <Card className="shadow-none">
              <CardContent className="shadow-none">
                <FieldSet>
                  <FieldLegend>{t.home.preview.settings.fontAndSize}</FieldLegend>
                  <FieldGroup>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.font}</FieldTitle>
                      <Select value={subtitleFont} onValueChange={(value) => setSubtitleFont(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t.home.preview.settings.font} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">{t.home.preview.settings.arial}</SelectItem>
                          <SelectItem value="Times New Roman">{t.home.preview.settings.timesNewRoman}</SelectItem>
                          <SelectItem value="Courier New">{t.home.preview.settings.courierNew}</SelectItem>
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
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardContent className="shadow-none">
                <FieldSet>
                  <FieldLegend>{t.home.preview.settings.colors}</FieldLegend>
                  <FieldGroup>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.color}</FieldTitle>
                      <ColorPicker background={subtitleColor} setBackground={setSubtitleColor} />
                    </Field>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.outlineColor}</FieldTitle>
                      <ColorPicker background={subtitleOutlineColor} setBackground={setSubtitleOutlineColor} />
                    </Field>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.shadowColor}</FieldTitle>
                      <ColorPicker background={subtitleShadowColor} setBackground={setSubtitleShadowColor} />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardContent className="shadow-none">
                <FieldSet>
                  <FieldLegend>{t.home.preview.settings.textStyle}</FieldLegend>
                  <FieldGroup>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="bold">{t.home.preview.settings.bold}</FieldLabel>
                        <FieldDescription>{t.home.preview.settings.boldDescription}</FieldDescription>
                      </FieldContent>
                      <Switch id="bold" checked={subtitleBold} onCheckedChange={setSubtitleBold} />
                    </Field>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="italic">{t.home.preview.settings.italic}</FieldLabel>
                        <FieldDescription>{t.home.preview.settings.italicDescription}</FieldDescription>
                      </FieldContent>
                      <Switch id="italic" checked={subtitleItalic} onCheckedChange={setSubtitleItalic} />
                    </Field>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="underline">{t.home.preview.settings.underline}</FieldLabel>
                        <FieldDescription>{t.home.preview.settings.underlineDescription}</FieldDescription>
                      </FieldContent>
                      <Switch id="underline" checked={subtitleUnderline} onCheckedChange={setSubtitleUnderline} />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardContent className="shadow-none">
                <FieldSet>
                  <FieldLegend>{t.home.preview.settings.effects}</FieldLegend>
                  <FieldGroup>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.outlineThickness}</FieldTitle>
                      <FieldDescription>
                        <span className="font-medium tabular-nums">{subtitleOutlineThickness}px</span>
                      </FieldDescription>
                      <Slider
                        value={[subtitleOutlineThickness]}
                        onValueChange={(value) => setSubtitleOutlineThickness(value[0])}
                        max={4}
                        min={0}
                        step={1}
                        className="mt-2 w-full"
                      />
                    </Field>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.shadow}</FieldTitle>
                      <FieldDescription>
                        <span className="font-medium tabular-nums">{subtitleShadow}px</span>
                      </FieldDescription>
                      <Slider
                        value={[subtitleShadow]}
                        onValueChange={(value) => setSubtitleShadow(value[0])}
                        max={4}
                        min={0}
                        step={1}
                        className="mt-2 w-full"
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardContent className="shadow-none">
                <FieldSet>
                  <FieldLegend>{t.home.preview.settings.videoSettings}</FieldLegend>
                  <FieldGroup>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.format}</FieldTitle>
                      <Select value={format} onValueChange={(value) => setFormat(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t.home.preview.settings.format} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zoomed_916">{t.home.preview.settings.zoomed_916}</SelectItem>
                          <SelectItem value="normal_916_with_borders">{t.home.preview.settings.normal_916_with_borders}</SelectItem>
                          <SelectItem value="original">{t.home.preview.settings.original}</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.chunkNumber}</FieldTitle>
                      <FieldDescription>
                        <span className="font-medium tabular-nums">
                          {chunkNumber} {t.home.preview.settings.chunkNumberDescription}
                        </span>
                      </FieldDescription>
                      <Slider
                        value={[chunkNumber]}
                        onValueChange={(value) => setChunkNumber(value[0])}
                        max={100}
                        min={1}
                        step={1}
                        className="mt-2 w-full"
                      />
                    </Field>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.yAxisAlignment}</FieldTitle>
                      <FieldDescription>
                        <span className="font-medium tabular-nums">{yAxisAlignment}px</span>
                      </FieldDescription>
                      <Slider
                        value={[yAxisAlignment]}
                        onValueChange={(value) => setYAxisAlignment(value[0])}
                        max={200}
                        min={0}
                        step={5}
                        className="mt-2 w-full"
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
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
