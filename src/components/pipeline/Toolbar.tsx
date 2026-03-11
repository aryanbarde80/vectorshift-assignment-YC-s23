import { useState } from 'react';
import { DraggableNode } from './DraggableNode';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Type,
  Shuffle,
  Filter,
  Merge,
  Globe,
  GitBranch,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const nodeItems = [
  { type: 'input', label: 'Input', icon: <ArrowRight size={11} />, colorClass: 'bg-node-input' },
  { type: 'output', label: 'Output', icon: <ArrowLeft size={11} />, colorClass: 'bg-node-output' },
  { type: 'llm', label: 'LLM', icon: <Sparkles size={11} />, colorClass: 'bg-node-llm' },
  { type: 'text', label: 'Text', icon: <Type size={11} />, colorClass: 'bg-node-text' },
  { type: 'transform', label: 'Transform', icon: <Shuffle size={11} />, colorClass: 'bg-node-transform' },
  { type: 'filter', label: 'Filter', icon: <Filter size={11} />, colorClass: 'bg-node-filter' },
  { type: 'merge', label: 'Merge', icon: <Merge size={11} />, colorClass: 'bg-node-merge' },
  { type: 'api', label: 'API Call', icon: <Globe size={11} />, colorClass: 'bg-node-api' },
  { type: 'condition', label: 'Condition', icon: <GitBranch size={11} />, colorClass: 'bg-node-condition' },
];

export const Toolbar = () => {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(!isMobile);
  const [search, setSearch] = useState('');

  const filtered = search
    ? nodeItems.filter((n) => n.label.toLowerCase().includes(search.toLowerCase()))
    : nodeItems;

  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-md shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2.5 cursor-pointer select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Nodes
          </span>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
            {nodeItems.length}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      {expanded && (
        <div className="px-4 pb-3 animate-slide-up-fade">
          {/* Search */}
          <div className="relative mb-2.5">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full rounded-lg border border-border bg-muted/50 py-1.5 pl-7 pr-3 text-xs outline-none placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-ring"
              placeholder="Search nodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 toolbar-nodes">
            {filtered.map((item) => (
              <DraggableNode key={item.type} {...item} />
            ))}
            {filtered.length === 0 && (
              <span className="text-xs text-muted-foreground italic">No nodes found</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
