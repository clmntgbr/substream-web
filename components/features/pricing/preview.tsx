import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { GetSubscriptionUpdatePreviewResponse } from "@/lib/subscription/types";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";

interface PricingPreviewProps {
  subscriptionPreview: GetSubscriptionUpdatePreviewResponse;
  onUpdateSubscription: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PricingPreview({ subscriptionPreview, onUpdateSubscription, open, onOpenChange }: PricingPreviewProps) {
  const [loading, setLoading] = useState(false);

  const handleUpdateSubscription = async () => {
    setLoading(true);
    await onUpdateSubscription();
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Subscription Update Preview</DialogTitle>
          <DialogDescription>This is a preview of the subscription update.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Amount Due</p>
            <p className="text-sm">{subscriptionPreview.amountDue}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Credit</p>
          <p className="text-sm">{subscriptionPreview.credit}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Debit</p>
          <p className="text-sm">{subscriptionPreview.debit}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Currency</p>
          <p className="text-sm">{subscriptionPreview.currency}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Next Billing Date</p>
          <p className="text-sm">{subscriptionPreview.nextBillingDate}</p>
        </div>

        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="flex-1" disabled={loading}>
            Close
          </Button>
          <Button size="sm" className="flex-1" onClick={handleUpdateSubscription} disabled={loading}>
            Update Subscription
            {loading ? <Spinner className="size-4" /> : <ArrowRightIcon className="size-4 ml-2" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
