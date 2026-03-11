import { Workflow, ArrowRight, MousePointer } from 'lucide-react';

export const EmptyState = () => (
  <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
    <div className="flex flex-col items-center gap-4 text-center animate-slide-up-fade pointer-events-auto">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Workflow size={28} />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Build Your Pipeline</h2>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Drag nodes from the toolbar above and connect them to create your data pipeline.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MousePointer size={12} />
          <span>Drag &amp; drop nodes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ArrowRight size={12} />
          <span>Connect handles to link</span>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-1">
        <kbd className="inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">?</kbd>
        <span className="text-[11px] text-muted-foreground">for shortcuts</span>
      </div>
    </div>
  </div>
);
