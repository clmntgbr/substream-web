"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Mail } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const SubscribeSuccessPage = () => {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-success-light via-background to-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-success/20 animate-fade-in">
        <CardHeader className="text-center pb-6 space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-success-light p-4 animate-check-bounce">
              <CheckCircle2 className="h-20 w-20 text-success" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-success">Payment Successful!</CardTitle>
          <CardDescription className="text-base">Your transaction has been completed successfully</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-success-light/50 border border-success/20">
              <Mail className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Confirmation Email</p>
                <p className="text-sm text-muted-foreground">A confirmation email will be sent to your registered email address shortly.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-success-light/50 border border-success/20">
              <Clock className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Subscription Activation</p>
                <p className="text-sm text-muted-foreground">Your subscription will be validated and activated within the next few minutes.</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button className="w-full" size="lg" onClick={() => router.push(`/${lang}`)}>
            Return to Home
          </Button>
          <p className="text-xs text-center text-muted-foreground">Thank you for your trust!</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscribeSuccessPage;
