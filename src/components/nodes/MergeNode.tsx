import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Merge } from 'lucide-react';

export const MergeNode = ({ id, selected }: any) => {
  const [strategy, setStrategy] = useState('concat');

  return (
    <BaseNode
      id={id}
      label="Merge"
      icon={<Merge size={13} />}
      colorClass="bg-node-merge"
      selected={selected}
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-input-a`, style: { top: '40%' } },
        { type: 'target', position: Position.Left, id: `${id}-input-b`, style: { top: '70%' } },
        { type: 'source', position: Position.Right, id: `${id}-output` },
      ]}
    >
      <label className="text-xs text-muted-foreground">Strategy</label>
      <select
        className="w-full rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
        value={strategy}
        onChange={(e) => setStrategy(e.target.value)}
      >
        <option value="concat">Concatenate</option>
        <option value="join">Join with Separator</option>
        <option value="alternate">Alternate</option>
      </select>
    </BaseNode>
  );
};
