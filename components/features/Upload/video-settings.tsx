import { SubtitleColorPicker } from "@/components/shared/misc/subtitle-color-picker";
import { SubtitleSizeInput } from "@/components/shared/misc/subtitle-size-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { BrainCircuit, FormInputIcon, LanguagesIcon, PaletteIcon, Text, VideoIcon, WandSparkles } from "lucide-react";

interface VideoSettingsProps {
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

export const VideoSettings = ({
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
}: VideoSettingsProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-[500px] overflow-hidden px-0 flex flex-col">
        <SheetHeader className="px-4 pt-6 pb-4 border-b">
          <SheetTitle>Video Settings</SheetTitle>
          <SheetDescription>Configure the video settings</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-2 px-4 overflow-y-auto flex-1">
          <div className="w-full space-y-4">
            <Card className="dark:bg-transparent border-none">
              <CardContent className="">
                <FieldSet>
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <FormInputIcon className="size-4" />
                      Font and Size
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <FieldGroup>
                      <FieldSet>
                        <RadioGroup defaultValue={subtitleFont} onValueChange={(value) => setSubtitleFont(value)} disabled={readOnly}>
                          <FieldLabel htmlFor="arial">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>Arial</FieldTitle>
                                <FieldDescription>Arial is a sans-serif font that is commonly used for web design and typography.</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="Arial" id="arial" disabled={readOnly} />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="timesNewRoman">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>Times New Roman</FieldTitle>
                                <FieldDescription>
                                  Times New Roman is a serif font that is commonly used for web design and typography.
                                </FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="Times New Roman" id="timesNewRoman" disabled={readOnly} />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="courierNew">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>Courier New</FieldTitle>
                                <FieldDescription>
                                  Courier New is a monospace font that is commonly used for web design and typography.
                                </FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="Courier New" id="courierNew" disabled={readOnly} />
                            </Field>
                          </FieldLabel>
                        </RadioGroup>
                      </FieldSet>
                      <Field>
                        <SubtitleSizeInput
                          value={subtitleSize}
                          onChange={setSubtitleSize}
                          min={0}
                          max={100}
                          step={1}
                          description="The size of the subtitle"
                          label="Size"
                          unit="px"
                          disabled={readOnly}
                        />
                      </Field>
                    </FieldGroup>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            <Card className="dark:bg-transparent border-none">
              <CardContent className="">
                <FieldSet>
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <PaletteIcon className="size-4" />
                      Colors
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <Field>
                      <FieldTitle>Color</FieldTitle>
                      <SubtitleColorPicker background={subtitleColor} setBackground={setSubtitleColor} disabled={readOnly} />
                    </Field>
                    <Field>
                      <FieldTitle>Outline Color</FieldTitle>
                      <SubtitleColorPicker background={subtitleOutlineColor} setBackground={setSubtitleOutlineColor} disabled={readOnly} />
                    </Field>
                    <Field>
                      <FieldTitle>Shadow Color</FieldTitle>
                      <SubtitleColorPicker background={subtitleShadowColor} setBackground={setSubtitleShadowColor} disabled={readOnly} />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            <Card className="dark:bg-transparent border-none">
              <CardContent className="">
                <FieldSet>
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <Text className="size-4" />
                      Text Style
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="bold">Bold</FieldLabel>
                        <FieldDescription>Make the text bold</FieldDescription>
                      </FieldContent>
                      <Switch id="bold" checked={subtitleBold} onCheckedChange={setSubtitleBold} disabled={readOnly} className="cursor-pointer" />
                    </Field>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="italic">Italic</FieldLabel>
                        <FieldDescription>Make the text italic</FieldDescription>
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
                        <FieldLabel htmlFor="underline">Underline</FieldLabel>
                        <FieldDescription>Underline the text</FieldDescription>
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
            <Card className="dark:bg-transparent border-none">
              <CardContent className="">
                <FieldSet>
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <WandSparkles className="size-4" />
                      Effects
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <Field>
                      <SubtitleSizeInput
                        value={subtitleOutlineThickness}
                        onChange={setSubtitleOutlineThickness}
                        min={0}
                        max={4}
                        step={1}
                        label="Outline Thickness"
                        description="The thickness of the outline"
                        unit="px"
                        disabled={readOnly}
                      />
                    </Field>
                    <Field>
                      <SubtitleSizeInput
                        value={subtitleShadow}
                        onChange={setSubtitleShadow}
                        max={4}
                        min={0}
                        step={1}
                        description="The shadow of the text"
                        label="Shadow"
                        unit="px"
                        disabled={readOnly}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
            <Card className="dark:bg-transparent border-none">
              <CardContent className="">
                <FieldSet>
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <VideoIcon className="size-4" />
                      Video Settings
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <FieldGroup>
                      <FieldSet>
                        <RadioGroup defaultValue={format} onValueChange={(value) => setFormat(value)} disabled={readOnly}>
                          <FieldLabel htmlFor="original">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>Original</FieldTitle>
                                <FieldDescription>The original video format</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="original" id="original" disabled={readOnly} />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="zoomed_916">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>Zoomed 9:16</FieldTitle>
                                <FieldDescription>Zoom the video to 9:16</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="zoomed_916" id="zoomed_916" disabled={readOnly} />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="normal_916_with_borders">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>Normal 9:16 with Borders</FieldTitle>
                                <FieldDescription>Normal 9:16 with borders</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="normal_916_with_borders" id="normal_916_with_borders" disabled={readOnly} />
                            </Field>
                          </FieldLabel>
                        </RadioGroup>
                      </FieldSet>
                    </FieldGroup>
                    <Field>
                      <SubtitleSizeInput
                        value={chunkNumber}
                        onChange={setChunkNumber}
                        max={100}
                        min={0}
                        step={1}
                        description="The number of chunks to split the video into"
                        label="Chunk Number"
                        unit="  parts"
                        disabled={readOnly}
                      />
                    </Field>
                    <Field>
                      <SubtitleSizeInput
                        value={yAxisAlignment}
                        onChange={setYAxisAlignment}
                        max={200}
                        min={0}
                        step={1}
                        description="The vertical alignment of the subtitle"
                        label="Y Axis Alignment"
                        unit="px"
                        disabled={readOnly}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
            <Card className="dark:bg-transparent border-none">
              <CardContent className="">
                <FieldSet>
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <BrainCircuit className="size-4" />
                      AI Settings
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <FieldGroup>
                      <FieldSet>
                        <FieldGroup>
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldLabel htmlFor="isResume">Resume</FieldLabel>
                              <FieldDescription>Resume the video from the beginning</FieldDescription>
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
            <Card className="dark:bg-transparent border-none">
              <CardContent className="">
                <FieldSet>
                  <FieldLegend>
                    <span className="flex items-center gap-2">
                      <LanguagesIcon className="size-4" />
                      Language
                    </span>
                  </FieldLegend>
                  <FieldGroup>
                    <FieldGroup>
                      <FieldSet>
                        <RadioGroup defaultValue={language} onValueChange={(value) => setLanguage(value)} disabled={readOnly}>
                          <FieldLabel htmlFor="auto">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>Auto</FieldTitle>
                                <FieldDescription>Automatically detect the language of the video</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="auto" id="auto" disabled={readOnly} />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="english">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>English</FieldTitle>
                                <FieldDescription>English is the default language</FieldDescription>
                              </FieldContent>
                              <RadioGroupItem value="english" id="english" disabled={true} />
                            </Field>
                          </FieldLabel>
                          <FieldLabel htmlFor="french">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>French</FieldTitle>
                                <FieldDescription>French is the default language</FieldDescription>
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
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default VideoSettings;
