"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const SubscribeSuccessPage = () => {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  return (
    <div className="flex items-center justify-center py-16">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full p-3">
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">Payment Successful!</CardTitle>
          <CardDescription className="text-base mt-2">Your transaction has been completed successfully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">A confirmation email has been sent to your registered email address.</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" className="w-full" size="lg" onClick={() => router.push(`/${lang}`)}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscribeSuccessPage;
