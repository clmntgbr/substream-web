import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { useTranslations } from "@/lib/use-translations";
import { ColorPicker } from "../misc/ColorPicker";
import { NumberInput } from "../misc/NumberInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

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
                    <FieldGroup>
                      <FieldSet>
                        <RadioGroup defaultValue={subtitleFont} onValueChange={(value) => setSubtitleFont(value)}>
                          <FieldLabel htmlFor="arial">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.arial}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.arialDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="Arial" id="arial" />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="timesNewRoman">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.timesNewRoman}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.timesNewRomanDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="Times New Roman" id="timesNewRoman" />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="courierNew">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.courierNew}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.courierNewDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="Courier New" id="courierNew" />
                            </Field>
                          </FieldLabel>
                        </RadioGroup>
                      </FieldSet>
                      <Field>
                        <NumberInput
                          value={subtitleSize}
                          onChange={setSubtitleSize}
                          min={0}
                          max={100}
                          step={1}
                          description={t.home.preview.settings.sizeDescription}
                          label={t.home.preview.settings.size}
                          unit="px"
                        />
                      </Field>
                    </FieldGroup>
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
                      <NumberInput
                        value={subtitleOutlineThickness}
                        onChange={setSubtitleOutlineThickness}
                        min={0}
                        max={4}
                        step={1}
                        label={t.home.preview.settings.outlineThickness}
                        description={t.home.preview.settings.outlineThicknessDescription}
                        unit="px"
                      />
                    </Field>
                    <Field>
                      <NumberInput
                        value={subtitleShadow}
                        onChange={setSubtitleShadow}
                        max={4}
                        min={0}
                        step={1}
                        description={t.home.preview.settings.shadowDescription}
                        label={t.home.preview.settings.shadow}
                        unit="px"
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
                    <FieldGroup>
                      <FieldSet>
                        <RadioGroup defaultValue={format} onValueChange={(value) => setFormat(value)}>
                          <FieldLabel htmlFor="original">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.original}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.originalDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="original" id="original" />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="zoomed_916">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.zoomed_916}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.zoomed_916Description}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="zoomed_916" id="zoomed_916" />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="normal_916_with_borders">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.normal_916_with_borders}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.normal_916_with_bordersDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="normal_916_with_borders" id="normal_916_with_borders" />
                            </Field>
                          </FieldLabel>
                        </RadioGroup>
                      </FieldSet>
                    </FieldGroup>
                    <Field>
                      <NumberInput
                        value={chunkNumber}
                        onChange={setChunkNumber}
                        max={100}
                        min={0}
                        step={1}
                        description={t.home.preview.settings.chunkNumberDescription}
                        label={t.home.preview.settings.chunkNumber}
                        unit="  parts"
                      />
                    </Field>
                    <Field>
                      <NumberInput
                        value={yAxisAlignment}
                        onChange={setYAxisAlignment}
                        max={200}
                        min={0}
                        step={1}
                        description={t.home.preview.settings.yAxisAlignmentDescription}
                        label={t.home.preview.settings.yAxisAlignment}
                        unit="px"
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
