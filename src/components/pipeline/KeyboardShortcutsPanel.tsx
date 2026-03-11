import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

const shortcuts = [
  { keys: ['Ctrl', 'Z'], description: 'Undo last action', mac: ['⌘', 'Z'] },
  { keys: ['Del'], description: 'Delete selected nodes/edges', mac: ['⌫'] },
  { keys: ['Ctrl', 'C'], description: 'Copy selected node', mac: ['⌘', 'C'] },
  { keys: ['Ctrl', 'V'], description: 'Paste copied node', mac: ['⌘', 'V'] },
  { keys: ['?'], description: 'Toggle shortcuts panel', mac: ['?'] },
  { keys: ['Esc'], description: 'Close panels / Deselect', mac: ['Esc'] },
];

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent);

export const KeyboardShortcutsPanel = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !(e.target as HTMLElement)?.closest('input, textarea, select')) {
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="Keyboard shortcuts (?)"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Keyboard size={14} />
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-foreground/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed left-1/2 top-1/2 z-[91] w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-5 shadow-2xl animate-slide-up-fade">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Keyboard size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Keyboard Shortcuts</h2>
          </div>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-1.5">
          {shortcuts.map((s) => (
            <div key={s.description} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors">
              <span className="text-xs text-foreground">{s.description}</span>
              <div className="flex items-center gap-1">
                {(isMac ? s.mac : s.keys).map((k) => (
                  <kbd
                    key={k}
                    className="inline-flex h-5 min-w-[20px] items-center justify-center rounded border border-border bg-muted px-1.5 text-[10px] font-mono font-medium text-muted-foreground"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
