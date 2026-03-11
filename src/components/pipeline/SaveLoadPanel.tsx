import { useState, useRef } from 'react';
import { usePipelineStore } from '@/store/pipelineStore';
import { Save, FolderOpen, Download, Upload, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export const SaveLoadPanel = () => {
  const { savePipeline, loadPipeline, getSavedPipelines, deleteSavedPipeline, exportPipeline, importPipeline, nodes } =
    usePipelineStore();
  const [open, setOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const savedPipelines = getSavedPipelines();

  const handleSave = () => {
    if (!saveName.trim()) {
      toast.error('Enter a name for the pipeline');
      return;
    }
    savePipeline(saveName.trim());
    toast.success(`Pipeline "${saveName.trim()}" saved`);
    setSaveName('');
  };

  const handleLoad = (name: string) => {
    if (loadPipeline(name)) {
      toast.success(`Pipeline "${name}" loaded`);
      setOpen(false);
    } else {
      toast.error('Failed to load pipeline');
    }
  };

  const handleDelete = (name: string) => {
    deleteSavedPipeline(name);
    toast.success(`Pipeline "${name}" deleted`);
  };

  const handleExport = () => {
    const json = exportPipeline();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Pipeline exported');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (importPipeline(text)) {
        toast.success('Pipeline imported');
        setOpen(false);
      } else {
        toast.error('Invalid pipeline file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="Save / Load"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <FolderOpen size={14} />
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-foreground/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed left-1/2 top-1/2 z-[91] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-5 shadow-2xl animate-slide-up-fade">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Save / Load Pipeline</h2>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Save */}
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring"
            placeholder="Pipeline name..."
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Save size={12} />
            Save
          </button>
        </div>

        {/* Saved list */}
        {savedPipelines.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Saved Pipelines</span>
            <div className="mt-1.5 max-h-32 overflow-y-auto space-y-1">
              {savedPipelines.map((name) => (
                <div key={name} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                  <button
                    onClick={() => handleLoad(name)}
                    className="text-xs text-foreground hover:text-primary transition-colors truncate mr-2 text-left flex-1"
                  >
                    {name}
                  </button>
                  <button
                    onClick={() => handleDelete(name)}
                    className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Import / Export */}
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={nodes.length === 0}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-40"
          >
            <Download size={12} />
            Export JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Upload size={12} />
            Import JSON
          </button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </div>
    </>
  );
};
