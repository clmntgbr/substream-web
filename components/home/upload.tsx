import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "@/lib/use-translations";
import { LinkIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import { Spinner } from "../ui/spinner";

export const Upload = () => {
  const t = useTranslations();
  const [isImportingUrl, setIsImportingUrl] = useState(false);

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="file">
        <TabsList className="w-full">
          <TabsTrigger value="file">
            <UploadIcon className="w-4 h-4" />
            {t.home.upload.tab.right}
          </TabsTrigger>
          <TabsTrigger value="url">
            <LinkIcon className="w-4 h-4" />
            {t.home.upload.tab.left}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="file" className="shadow-none">
          <Card className="shadow-none">
            <CardContent className="grid gap-6 shadow-none py-[10vh]">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                  <UploadIcon size={28} className="text-muted-foreground" />
                </div>

                <h3 className="text-xl font-semibold">Drag and drop your files</h3>
                <p className="text-muted-foreground mb-6">or click the button below to browse</p>
                <Button size="lg">Choose Files</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="url" className="shadow-none">
          <Card className="shadow-none">
            <CardContent className="grid gap-6 shadow-none py-[10vh]">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                  <LinkIcon size={28} className="text-muted-foreground" />
                </div>

                <h3 className="text-xl font-semibold">Import from URL</h3>
                <p className="text-muted-foreground mb-6">Paste a link to import content directly</p>
                <InputGroup className="w-[450px] focus:outline-none focus:ring-0 mx-auto h-10">
                  <InputGroupInput placeholder="https://www.youtube.com/watch?v=B2pUrE_Ge1E" className="focus:outline-none focus:ring-0" />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/10 w-[90px]"
                      disabled={isImportingUrl}
                      onClick={() => {
                        setIsImportingUrl(true);
                      }}
                    >
                      {isImportingUrl ? <Spinner className="w-4 h-4" /> : "Import URL"}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* <TabsContent value="url">
          <Card className="shadow-none">
            <CardContent className="grid gap-6 shadow-none">
              <div className="text-center mb-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                    <LinkIcon size={28} className="text-muted-foreground" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">Import from URL</h3>
                  <p className="text-muted-foreground">Paste a link to import content directly</p>

                  {/* <InputGroup className="w-[450px] focus:outline-none focus:ring-0">
                    <InputGroupInput placeholder="https://www.youtube.com/watch?v=B2pUrE_Ge1E" className="focus:outline-none focus:ring-0" />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary/10 w-[90px]"
                        disabled={isImportingUrl}
                        onClick={() => {
                          setIsImportingUrl(true);
                        }}
                      >
                        {isImportingUrl ? <Spinner className="w-4 h-4" /> : "Import URL"}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup> */}
        {/* </div>
              </div>
            </CardContent>
          </Card> */}
        {/* </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Upload;
