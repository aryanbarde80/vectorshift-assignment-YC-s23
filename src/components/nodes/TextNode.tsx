import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Position, Handle } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Type } from 'lucide-react';

// Extract valid JS variable names from {{ varName }} patterns
const extractVariables = (text: string): string[] => {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const vars: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (!vars.includes(match[1])) {
      vars.push(match[1]);
    }
  }
  return vars;
};

export const TextNode = ({ id, data, selected }: any) => {
  const [text, setText] = useState(data?.text || '{{input}} is a sample text');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const variables = useMemo(() => extractVariables(text), [text]);

  // Auto-resize textarea
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.max(60, ta.scrollHeight) + 'px';
    }
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [text, resizeTextarea]);

  // Build handles: variable handles on left + output on right
  const baseHandles = [
    { type: 'source' as const, position: Position.Right, id: `${id}-output` },
  ];

  return (
    <div
      className={`pipeline-node ${selected ? 'selected' : ''}`}
      style={{ minWidth: 260 }}
    >
      {/* Base handles */}
      {baseHandles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={h.position}
          id={h.id}
          style={{ background: 'hsl(200, 75%, 50%)' }}
        />
      ))}

      {/* Dynamic variable handles on the left */}
      {variables.map((v, i) => (
        <Handle
          key={`var-${v}`}
          type="target"
          position={Position.Left}
          id={`${id}-${v}`}
          style={{
            top: `${((i + 1) / (variables.length + 1)) * 100}%`,
            background: 'hsl(200, 75%, 50%)',
          }}
        />
      ))}

      <div className="node-header">
        <div className="node-header-icon bg-node-text text-primary-foreground">
          <Type size={13} />
        </div>
        <span>Text</span>
      </div>

      <div className="node-body">
        <label className="text-xs text-muted-foreground">Text</label>
        <textarea
          ref={textareaRef}
          className="w-full resize-none rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring font-mono leading-relaxed"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ minHeight: 60 }}
        />
        {variables.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {variables.map((v) => (
              <span
                key={v}
                className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
