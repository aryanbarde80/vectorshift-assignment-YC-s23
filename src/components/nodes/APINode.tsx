import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Globe } from 'lucide-react';

export const APINode = ({ id, selected }: any) => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');

  return (
    <BaseNode
      id={id}
      label="API Call"
      icon={<Globe size={13} />}
      colorClass="bg-node-api"
      selected={selected}
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-input` },
        { type: 'source', position: Position.Right, id: `${id}-response` },
      ]}
    >
      <label className="text-xs text-muted-foreground">Method</label>
      <select
        className="w-full rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>
      <label className="text-xs text-muted-foreground">URL</label>
      <input
        className="w-full rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring font-mono"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://api.example.com"
      />
    </BaseNode>
  );
};
