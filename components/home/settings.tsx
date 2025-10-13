import { useTranslations } from "@/lib/use-translations";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
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
      <SheetContent side="right" className="w-[400px] sm:w-[480px] overflow-hidden px-0 flex flex-col">
        <SheetHeader className="px-4 pt-6 pb-4 border-b">
          <SheetTitle>{t.home.upload.settings.title}</SheetTitle>
          <SheetDescription>{t.home.upload.settings.description}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4 px-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="font">Font</Label>
              <Input id="font" value={subtitleFont} onChange={(e) => setSubtitleFont(e.target.value)} placeholder="Arial" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size: {subtitleSize}px</Label>
              <Slider id="size" min={12} max={48} step={1} value={[subtitleSize]} onValueChange={(value) => setSubtitleSize(value[0])} />
            </div>
          </div>

          <Separator />

          {/* Color Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="color">Text color</Label>
              <div className="flex gap-2">
                <Input id="color" type="color" value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} className="w-20 h-10" />
                <Input value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} placeholder="#FFFFFF" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="outlineColor">Outline color</Label>
              <div className="flex gap-2">
                <Input
                  id="outlineColor"
                  type="color"
                  value={subtitleOutlineColor}
                  onChange={(e) => setSubtitleOutlineColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input value={subtitleOutlineColor} onChange={(e) => setSubtitleOutlineColor(e.target.value)} placeholder="#000000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shadowColor">Shadow color</Label>
              <div className="flex gap-2">
                <Input
                  id="shadowColor"
                  type="color"
                  value={subtitleShadowColor}
                  onChange={(e) => setSubtitleShadowColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input value={subtitleShadowColor} onChange={(e) => setSubtitleShadowColor(e.target.value)} placeholder="#333333" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Text Style */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="bold">Bold</Label>
              <Switch id="bold" checked={subtitleBold} onCheckedChange={setSubtitleBold} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="italic">Italic</Label>
              <Switch id="italic" checked={subtitleItalic} onCheckedChange={setSubtitleItalic} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="underline">Underline</Label>
              <Switch id="underline" checked={subtitleUnderline} onCheckedChange={setSubtitleUnderline} />
            </div>
          </div>

          <Separator />

          {/* Effects */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="outlineThickness">Outline thickness: {subtitleOutlineThickness}px</Label>
              <Slider
                id="outlineThickness"
                min={0}
                max={10}
                step={1}
                value={[subtitleOutlineThickness]}
                onValueChange={(value) => setSubtitleOutlineThickness(value[0])}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shadow">Shadow: {subtitleShadow}px</Label>
              <Slider id="shadow" min={0} max={5} step={1} value={[subtitleShadow]} onValueChange={(value) => setSubtitleShadow(value[0])} />
            </div>
          </div>

          <Separator />

          {/* Position & Format */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="yAxis">Vertical position: {(yAxisAlignment * 100).toFixed(0)}%</Label>
              <Slider id="yAxis" min={0} max={1} step={0.01} value={[yAxisAlignment]} onValueChange={(value) => setYAxisAlignment(value[0])} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Format:</Label>
              <Input id="format" value={format} onChange={(e) => setFormat(e.target.value)} placeholder="original" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chunks">Number of segments: {chunkNumber}</Label>
              <Slider id="chunks" min={1} max={20} step={1} value={[chunkNumber]} onValueChange={(value) => setChunkNumber(value[0])} />
            </div>
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
