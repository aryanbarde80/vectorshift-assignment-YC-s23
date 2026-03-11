import { InputNode } from './InputNode';
import { OutputNode } from './OutputNode';
import { LLMNode } from './LLMNode';
import { TextNode } from './TextNode';
import { TransformNode } from './TransformNode';
import { FilterNode } from './FilterNode';
import { MergeNode } from './MergeNode';
import { APINode } from './APINode';
import { ConditionNode } from './ConditionNode';

export { InputNode, OutputNode, LLMNode, TextNode, TransformNode, FilterNode, MergeNode, APINode, ConditionNode };

export const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  llm: LLMNode,
  text: TextNode,
  transform: TransformNode,
  filter: FilterNode,
  merge: MergeNode,
  api: APINode,
  condition: ConditionNode,
} as const;
