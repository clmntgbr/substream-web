import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "@/lib/use-translations";
import { BrainCircuit, FormInputIcon, LanguagesIcon, PaletteIcon, Text, VideoIcon, WandSparkles } from "lucide-react";
import { ColorPicker } from "../misc/ColorPicker";
import { NumberInput } from "../misc/NumberInput";

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
  isResume: boolean;
  setIsResume: (resume: boolean) => void;
  readOnly?: boolean;
  language: string;
  setLanguage: (language: string) => void;
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
  readOnly = false,
  isResume,
  setIsResume,
  language,
  setLanguage,
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
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <FormInputIcon className="size-4" />
                      {t.home.preview.settings.fontAndSize}
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <FieldGroup>
                      <FieldSet>
                        <RadioGroup defaultValue={subtitleFont} onValueChange={(value) => setSubtitleFont(value)} disabled={readOnly}>
                          <FieldLabel htmlFor="arial">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.arial}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.arialDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="Arial" id="arial" disabled={readOnly} />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="timesNewRoman">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.timesNewRoman}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.timesNewRomanDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="Times New Roman" id="timesNewRoman" disabled={readOnly} />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="courierNew">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.courierNew}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.courierNewDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="Courier New" id="courierNew" disabled={readOnly} />
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
                          disabled={readOnly}
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
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <PaletteIcon className="size-4" />
                      {t.home.preview.settings.colors}
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.color}</FieldTitle>
                      <ColorPicker background={subtitleColor} setBackground={setSubtitleColor} disabled={readOnly} />
                    </Field>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.outlineColor}</FieldTitle>
                      <ColorPicker background={subtitleOutlineColor} setBackground={setSubtitleOutlineColor} disabled={readOnly} />
                    </Field>
                    <Field>
                      <FieldTitle>{t.home.preview.settings.shadowColor}</FieldTitle>
                      <ColorPicker background={subtitleShadowColor} setBackground={setSubtitleShadowColor} disabled={readOnly} />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardContent className="shadow-none">
                <FieldSet>
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <Text className="size-4" />
                      {t.home.preview.settings.textStyle}
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="bold">{t.home.preview.settings.bold}</FieldLabel>
                        <FieldDescription>{t.home.preview.settings.boldDescription}</FieldDescription>
                      </FieldContent>
                      <Switch id="bold" checked={subtitleBold} onCheckedChange={setSubtitleBold} disabled={readOnly} className="cursor-pointer" />
                    </Field>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="italic">{t.home.preview.settings.italic}</FieldLabel>
                        <FieldDescription>{t.home.preview.settings.italicDescription}</FieldDescription>
                      </FieldContent>
                      <Switch
                        id="italic"
                        checked={subtitleItalic}
                        onCheckedChange={setSubtitleItalic}
                        disabled={readOnly}
                        className="cursor-pointer"
                      />
                    </Field>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="underline">{t.home.preview.settings.underline}</FieldLabel>
                        <FieldDescription>{t.home.preview.settings.underlineDescription}</FieldDescription>
                      </FieldContent>
                      <Switch
                        id="underline"
                        checked={subtitleUnderline}
                        onCheckedChange={setSubtitleUnderline}
                        disabled={readOnly}
                        className="cursor-pointer"
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardContent className="shadow-none">
                <FieldSet>
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <WandSparkles className="size-4" />
                      {t.home.preview.settings.effects}
                    </span>
                  </FieldLegend>
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
                        disabled={readOnly}
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
                        disabled={readOnly}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardContent className="shadow-none">
                <FieldSet>
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <VideoIcon className="size-4" />
                      {t.home.preview.settings.videoSettings}
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <FieldGroup>
                      <FieldSet>
                        <RadioGroup defaultValue={format} onValueChange={(value) => setFormat(value)} disabled={readOnly}>
                          <FieldLabel htmlFor="original">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.original}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.originalDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="original" id="original" disabled={readOnly} />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="zoomed_916">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.zoomed_916}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.zoomed_916Description}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="zoomed_916" id="zoomed_916" disabled={readOnly} />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="normal_916_with_borders">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.normal_916_with_borders}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.normal_916_with_bordersDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="normal_916_with_borders" id="normal_916_with_borders" disabled={readOnly} />
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
                        disabled={readOnly}
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
                        disabled={readOnly}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardContent className="shadow-none">
                <FieldSet>
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <BrainCircuit className="size-4" />
                      {t.home.preview.settings.aiSettings}
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <FieldGroup>
                      <FieldSet>
                        <FieldGroup>
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldLabel htmlFor="isResume">{t.home.preview.settings.isResume}</FieldLabel>
                              <FieldDescription>{t.home.preview.settings.isResumeDescription}</FieldDescription>
                            </FieldContent>
                            <Switch id="isResume" checked={isResume} onCheckedChange={setIsResume} disabled={readOnly} className="cursor-pointer" />
                          </Field>
                        </FieldGroup>
                      </FieldSet>
                    </FieldGroup>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardContent className="shadow-none">
                <FieldSet>
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <LanguagesIcon className="size-4" />
                      {t.home.preview.settings.language}
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <FieldGroup>
                      <FieldSet>
                        <RadioGroup defaultValue={language} onValueChange={(value) => setLanguage(value)} disabled={readOnly}>
                          <FieldLabel htmlFor="auto">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.auto}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.autoDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="auto" id="auto" disabled={readOnly} />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="english">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.english}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.englishDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="english" id="english" disabled={true} />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="french">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>{t.home.preview.settings.french}</FieldTitle>
                                <FieldDescription>{t.home.preview.settings.frenchDescription}</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="french" id="french" disabled={true} />
                            </Field>
                          </FieldLabel>
                        </RadioGroup>
                      </FieldSet>
                    </FieldGroup>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
          </div>
        </div>

        <SheetFooter className="flex justify-center gap-3 px-4 py-4 border-t">
          <Button variant="default" onClick={() => onOpenChange(false)} className="cursor-pointer">
            {t.home.preview.settings.close}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Settings;
