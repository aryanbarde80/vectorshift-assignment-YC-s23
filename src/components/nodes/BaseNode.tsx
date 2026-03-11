import { Handle, Position } from 'reactflow';
import { ReactNode } from 'react';

export type HandleConfig = {
  type: 'source' | 'target';
  position: Position;
  id: string;
  style?: React.CSSProperties;
};

export type BaseNodeProps = {
  id: string;
  label: string;
  icon: ReactNode;
  colorClass: string;
  handles: HandleConfig[];
  children?: ReactNode;
  selected?: boolean;
  minWidth?: number;
};

const handleColorMap: Record<string, string> = {
  'bg-node-input': 'hsl(142, 55%, 49%)',
  'bg-node-output': 'hsl(250, 65%, 55%)',
  'bg-node-llm': 'hsl(35, 92%, 55%)',
  'bg-node-text': 'hsl(200, 75%, 50%)',
  'bg-node-transform': 'hsl(328, 70%, 55%)',
  'bg-node-filter': 'hsl(15, 80%, 55%)',
  'bg-node-merge': 'hsl(170, 60%, 45%)',
  'bg-node-api': 'hsl(262, 60%, 55%)',
  'bg-node-condition': 'hsl(45, 90%, 50%)',
};

export const BaseNode = ({
  label,
  icon,
  colorClass,
  handles,
  children,
  selected,
  minWidth,
}: BaseNodeProps) => {
  const handleColor = handleColorMap[colorClass] || 'hsl(250, 65%, 55%)';

  return (
    <div
      className={`pipeline-node ${selected ? 'selected' : ''}`}
      style={{ minWidth: minWidth || 220 }}
    >
      {handles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={h.position}
          id={h.id}
          style={{
            background: handleColor,
            ...h.style,
          }}
        />
      ))}
      <div className="node-header">
        <div className={`node-header-icon ${colorClass} text-primary-foreground`}>
          {icon}
        </div>
        <span className="truncate">{label}</span>
      </div>
      {children && <div className="node-body">{children}</div>}
    </div>
  );
};
