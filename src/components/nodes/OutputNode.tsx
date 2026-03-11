import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { ArrowLeft } from 'lucide-react';

export const OutputNode = ({ id, data, selected }: any) => {
  const [name, setName] = useState(data?.name || id.replace('output-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  return (
    <BaseNode
      id={id}
      label="Output"
      icon={<ArrowLeft size={13} />}
      colorClass="bg-node-output"
      selected={selected}
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-input` },
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
        value={outputType}
        onChange={(e) => setOutputType(e.target.value)}
      >
        <option value="Text">Text</option>
        <option value="Image">Image</option>
      </select>
    </BaseNode>
  );
};
