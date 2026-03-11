import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { ArrowRight } from 'lucide-react';

export const InputNode = ({ id, data, selected }: any) => {
  const [name, setName] = useState(data?.name || id.replace('input-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  return (
    <BaseNode
      id={id}
      label="Input"
      icon={<ArrowRight size={13} />}
      colorClass="bg-node-input"
      selected={selected}
      handles={[
        { type: 'source', position: Position.Right, id: `${id}-output` },
      ]}
    >
      <label className="text-xs text-muted-foreground">Name</label>
      <input
        className="w-full rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label className="text-xs text-muted-foreground">Type</label>
      <select
        className="w-full rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
        value={inputType}
        onChange={(e) => setInputType(e.target.value)}
      >
        <option value="Text">Text</option>
        <option value="File">File</option>
      </select>
    </BaseNode>
  );
};
