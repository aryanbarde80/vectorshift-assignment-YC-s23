import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { GitBranch } from 'lucide-react';

export const ConditionNode = ({ id, selected }: any) => {
  const [expression, setExpression] = useState('');

  return (
    <BaseNode
      id={id}
      label="Condition"
      icon={<GitBranch size={13} />}
      colorClass="bg-node-condition"
      selected={selected}
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-input` },
        { type: 'source', position: Position.Right, id: `${id}-true`, style: { top: '35%' } },
        { type: 'source', position: Position.Right, id: `${id}-false`, style: { top: '65%' } },
      ]}
    >
      <label className="text-xs text-muted-foreground">Expression</label>
      <input
        className="w-full rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring font-mono"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="value > 10"
      />
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-node-input" />
          True
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
          False
        </span>
      </div>
    </BaseNode>
  );
};
