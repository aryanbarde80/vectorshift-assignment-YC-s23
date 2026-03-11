import { create } from 'zustand';
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
} from 'reactflow';

type PipelineStore = {
  nodes: Node[];
  edges: Edge[];
  getNodeID: (type: string) => string;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  clearPipeline: () => void;
  deleteSelected: () => void;
  undoStack: { nodes: Node[]; edges: Edge[] }[];
  pushUndo: () => void;
  undo: () => void;
  duplicateNode: (nodeId: string) => void;
  savePipeline: (name: string) => void;
  loadPipeline: (name: string) => boolean;
  getSavedPipelines: () => string[];
  deleteSavedPipeline: (name: string) => void;
  exportPipeline: () => string;
  importPipeline: (json: string) => boolean;
};

const nodeCounters: Record<string, number> = {};

const STORAGE_PREFIX = 'pipeline_';

export const usePipelineStore = create<PipelineStore>((set, get) => ({
  nodes: [],
  edges: [],
  undoStack: [],

  getNodeID: (type: string) => {
    nodeCounters[type] = (nodeCounters[type] || 0) + 1;
    return `${type}-${nodeCounters[type]}`;
  },

  pushUndo: () => {
    const { nodes, edges, undoStack } = get();
    set({ undoStack: [...undoStack.slice(-19), { nodes: [...nodes], edges: [...edges] }] });
  },

  undo: () => {
    const { undoStack } = get();
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    set({ nodes: prev.nodes, edges: prev.edges, undoStack: undoStack.slice(0, -1) });
  },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    get().pushUndo();
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
        },
        get().edges
      ),
    });
  },

  addNode: (node) => {
    get().pushUndo();
    set({ nodes: [...get().nodes, node] });
  },

  clearPipeline: () => {
    get().pushUndo();
    set({ nodes: [], edges: [] });
  },

  deleteSelected: () => {
    get().pushUndo();
    const { nodes, edges } = get();
    const selectedNodeIds = nodes.filter((n) => n.selected).map((n) => n.id);
    const selectedEdgeIds = edges.filter((e) => e.selected).map((e) => e.id);
    set({
      nodes: nodes.filter((n) => !n.selected),
      edges: edges.filter(
        (e) =>
          !selectedEdgeIds.includes(e.id) &&
          !selectedNodeIds.includes(e.source) &&
          !selectedNodeIds.includes(e.target)
      ),
    });
  },

  duplicateNode: (nodeId: string) => {
    const { nodes, getNodeID, pushUndo } = get();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    pushUndo();
    const newId = getNodeID(node.type || 'unknown');
    const newNode: Node = {
      ...node,
      id: newId,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      selected: false,
      data: { ...node.data, id: newId },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  savePipeline: (name: string) => {
    const { nodes, edges } = get();
    localStorage.setItem(STORAGE_PREFIX + name, JSON.stringify({ nodes, edges }));
  },

  loadPipeline: (name: string) => {
    const raw = localStorage.getItem(STORAGE_PREFIX + name);
    if (!raw) return false;
    try {
      const { nodes, edges } = JSON.parse(raw);
      get().pushUndo();
      set({ nodes, edges });
      return true;
    } catch {
      return false;
    }
  },

  getSavedPipelines: () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keys.push(key.replace(STORAGE_PREFIX, ''));
      }
    }
    return keys.sort();
  },

  deleteSavedPipeline: (name: string) => {
    localStorage.removeItem(STORAGE_PREFIX + name);
  },

  exportPipeline: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  importPipeline: (json: string) => {
    try {
      const { nodes, edges } = JSON.parse(json);
      if (!Array.isArray(nodes) || !Array.isArray(edges)) return false;
      get().pushUndo();
      set({ nodes, edges });
      return true;
    } catch {
      return false;
    }
  },
}));
