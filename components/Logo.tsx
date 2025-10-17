import { Brain } from "lucide-react";

export function Logo() {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">sub</span>
        <span className="text-2xl font-medium text-foreground">stream</span>
      </div>
      <div className="flex items-center gap-1 -mt-1">
        <Brain className="w-3 h-3 text-primary" />
        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">AI-powered captions</span>
      </div>
    </div>
  );
}
