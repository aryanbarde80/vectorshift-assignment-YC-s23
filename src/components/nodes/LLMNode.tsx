import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Sparkles } from 'lucide-react';

export const LLMNode = ({ id, selected }: any) => {
  return (
    <BaseNode
      id={id}
      label="LLM"
      icon={<Sparkles size={13} />}
      colorClass="bg-node-llm"
      selected={selected}
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-system`, style: { top: '33%' } },
        { type: 'target', position: Position.Left, id: `${id}-prompt`, style: { top: '66%' } },
        { type: 'source', position: Position.Right, id: `${id}-response` },
      ]}
    >
      <p className="text-xs text-muted-foreground leading-relaxed">
        This is a LLM node. It takes a system prompt and a user prompt and returns a response.
      </p>
      <div className="flex gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-node-llm" />
          System
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-node-llm" />
          Prompt
        </div>
      </div>
    </BaseNode>
  );
};
