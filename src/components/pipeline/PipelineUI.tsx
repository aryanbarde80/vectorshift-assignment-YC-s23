import { useCallback, useRef, useEffect, DragEvent, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  ReactFlowInstance,
  useViewport,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { usePipelineStore } from '@/store/pipelineStore';
import { nodeTypes } from '@/components/nodes';
import { Toolbar } from './Toolbar';
import { SubmitButton } from './SubmitButton';
import { SaveLoadPanel } from './SaveLoadPanel';
import { NodeContextMenu, useNodeContextMenu } from './NodeContextMenu';
import { KeyboardShortcutsPanel } from './KeyboardShortcutsPanel';
import { EmptyState } from './EmptyState';
import { Moon, Sun, Undo2, Trash2, RotateCcw, Maximize, LayoutGrid } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

// Simple auto-layout: arranges nodes in a grid
const autoLayout = (nodes: any[]) => {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const gapX = 300;
  const gapY = 220;
  return nodes.map((n, i) => ({
    ...n,
    position: {
      x: (i % cols) * gapX + 50,
      y: Math.floor(i / cols) * gapY + 50,
    },
  }));
};

const ZoomDisplay = () => {
  const { zoom } = useViewport();
  return (
    <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
      {Math.round(zoom * 100)}%
    </span>
  );
};

const PipelineFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const isMobile = useIsMobile();
  const copiedNodeRef = useRef<any>(null);

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, getNodeID, deleteSelected, clearPipeline, undo, pushUndo, duplicateNode } =
    usePipelineStore();

  const { menu, onNodeContextMenu, closeMenu } = useNodeContextMenu();

  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = useCallback(() => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
        deleteSelected();
      }
      // Copy
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !isInput) {
        const selected = usePipelineStore.getState().nodes.find((n) => n.selected);
        if (selected) {
          copiedNodeRef.current = selected;
          toast.success('Node copied');
        }
      }
      // Paste
      if ((e.metaKey || e.ctrlKey) && e.key === 'v' && !isInput) {
        const copied = copiedNodeRef.current;
        if (copied) {
          const id = getNodeID(copied.type || 'unknown');
          addNode({
            ...copied,
            id,
            position: { x: copied.position.x + 60, y: copied.position.y + 60 },
            selected: false,
            data: { ...copied.data, id },
          });
          toast.success('Node pasted');
        }
      }
      // Escape to deselect
      if (e.key === 'Escape') {
        const store = usePipelineStore.getState();
        usePipelineStore.setState({
          nodes: store.nodes.map((n) => ({ ...n, selected: false })),
          edges: store.edges.map((e) => ({ ...e, selected: false })),
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, deleteSelected, addNode, getNodeID]);

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance.current || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.current.project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      const id = getNodeID(type);
      addNode({ id, type, position, data: { id } });
    },
    [addNode, getNodeID]
  );

  const handleFitView = useCallback(() => {
    reactFlowInstance.current?.fitView({ padding: 0.2, duration: 300 });
  }, []);

  const handleAutoLayout = useCallback(() => {
    if (nodes.length === 0) return;
    pushUndo();
    usePipelineStore.setState({ nodes: autoLayout(nodes) });
    setTimeout(() => reactFlowInstance.current?.fitView({ padding: 0.2, duration: 300 }), 50);
    toast.success('Nodes auto-arranged');
  }, [nodes, pushUndo]);

  const hasSelection = nodes.some((n) => n.selected) || edges.some((e) => e.selected);
  const selectedCount = nodes.filter((n) => n.selected).length + edges.filter((e) => e.selected).length;

  return (
    <div className="flex h-screen w-screen flex-col bg-canvas overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-3 sm:px-5 py-2.5 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-md">
            <span className="text-sm font-bold text-primary-foreground">V</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-foreground tracking-tight leading-tight">Pipeline Builder</h1>
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} edge{edges.length !== 1 ? 's' : ''}
              {selectedCount > 0 && ` · ${selectedCount} selected`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <SaveLoadPanel />

          <button
            onClick={undo}
            title="Undo (Ctrl+Z)"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Undo2 size={14} />
          </button>

          <button
            onClick={handleFitView}
            title="Fit to view"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Maximize size={14} />
          </button>

          {nodes.length > 1 && (
            <button
              onClick={handleAutoLayout}
              title="Auto-layout"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LayoutGrid size={14} />
            </button>
          )}

          {hasSelection && (
            <button
              onClick={deleteSelected}
              title="Delete selected"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
            >
              <Trash2 size={14} />
            </button>
          )}

          {nodes.length > 0 && (
            <button
              onClick={clearPipeline}
              title="Clear pipeline"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw size={14} />
            </button>
          )}

          <KeyboardShortcutsPanel />

          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <div className="w-px h-6 bg-border mx-0.5 hidden sm:block" />

          {/* Zoom display */}
          <div className="hidden sm:flex h-8 items-center justify-center rounded-lg border border-border bg-card px-2.5">
            <ZoomDisplay />
          </div>

          <SubmitButton />
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-3 sm:px-5 py-2.5 shrink-0">
        <Toolbar />
      </div>

      {/* Canvas */}
      <div ref={reactFlowWrapper} className="flex-1 min-h-0 relative">
        {nodes.length === 0 && <EmptyState />}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={closeMenu}
          onInit={(instance) => {
            reactFlowInstance.current = instance;
          }}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={null}
          snapToGrid
          snapGrid={[15, 15]}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls position="bottom-left" />
          {!isMobile && (
            <MiniMap
              nodeStrokeWidth={2}
              pannable
              zoomable
              style={{ width: 140, height: 90 }}
            />
          )}
        </ReactFlow>
      </div>

      {menu.visible && menu.nodeId && (
        <NodeContextMenu x={menu.x} y={menu.y} nodeId={menu.nodeId} onClose={closeMenu} />
      )}
    </div>
  );
};

export const PipelineUI = () => (
  <ReactFlowProvider>
    <PipelineFlow />
  </ReactFlowProvider>
);
