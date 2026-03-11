import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Filter } from 'lucide-react';

export const FilterNode = ({ id, selected }: any) => {
  const [condition, setCondition] = useState('contains');
  const [value, setValue] = useState('');

  return (
    <BaseNode
      id={id}
      label="Filter"
      icon={<Filter size={13} />}
      colorClass="bg-node-filter"
      selected={selected}
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-input` },
        { type: 'source', position: Position.Right, id: `${id}-true`, style: { top: '40%' } },
        { type: 'source', position: Position.Right, id: `${id}-false`, style: { top: '70%' } },
      ]}
    >
      <label className="text-xs text-muted-foreground">Condition</label>
      <select
        className="w-full rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      >
        <option value="contains">Contains</option>
        <option value="equals">Equals</option>
        <option value="startsWith">Starts With</option>
        <option value="regex">Regex Match</option>
      </select>
      <label className="text-xs text-muted-foreground">Value</label>
      <input
        className="w-full rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value..."
      />
    </BaseNode>
  );
};
