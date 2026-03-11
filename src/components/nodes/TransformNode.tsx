import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Shuffle } from 'lucide-react';

export const TransformNode = ({ id, selected }: any) => {
  const [operation, setOperation] = useState('uppercase');

  return (
    <BaseNode
      id={id}
      label="Transform"
      icon={<Shuffle size={13} />}
      colorClass="bg-node-transform"
      selected={selected}
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-input` },
        { type: 'source', position: Position.Right, id: `${id}-output` },
      ]}
    >
      <label className="text-xs text-muted-foreground">Operation</label>
      <select
        className="w-full rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
      >
        <option value="uppercase">To Uppercase</option>
        <option value="lowercase">To Lowercase</option>
        <option value="trim">Trim Whitespace</option>
        <option value="reverse">Reverse</option>
        <option value="base64">Base64 Encode</option>
      </select>
    </BaseNode>
  );
};
