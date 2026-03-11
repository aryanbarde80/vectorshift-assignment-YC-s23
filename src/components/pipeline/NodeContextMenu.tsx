import { useCallback, useState } from 'react';
import { Node } from 'reactflow';
import { usePipelineStore } from '@/store/pipelineStore';
import { Copy, Trash2, ClipboardCopy, Info } from 'lucide-react';
import { toast } from 'sonner';

type ContextMenuState = {
  visible: boolean;
  x: number;
  y: number;
  nodeId: string | null;
};

export const useNodeContextMenu = () => {
  const [menu, setMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    nodeId: null,
  });

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setMenu({ visible: true, x: event.clientX, y: event.clientY, nodeId: node.id });
  }, []);

  const closeMenu = useCallback(() => {
    setMenu((m) => ({ ...m, visible: false }));
  }, []);

  return { menu, onNodeContextMenu, closeMenu };
};

type NodeContextMenuProps = {
  x: number;
  y: number;
  nodeId: string;
  onClose: () => void;
};

export const NodeContextMenu = ({ x, y, nodeId, onClose }: NodeContextMenuProps) => {
  const { duplicateNode, pushUndo } = usePipelineStore();

  const node = usePipelineStore.getState().nodes.find((n) => n.id === nodeId);
  const connectedEdges = usePipelineStore.getState().edges.filter(
    (e) => e.source === nodeId || e.target === nodeId
  ).length;

  const handleDuplicate = () => {
    duplicateNode(nodeId);
    toast.success('Node duplicated');
    onClose();
  };

  const handleDelete = () => {
    pushUndo();
    const store = usePipelineStore.getState();
    usePipelineStore.setState({
      nodes: store.nodes.filter((n) => n.id !== nodeId),
      edges: store.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    });
    toast.success('Node deleted');
    onClose();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(nodeId);
    toast.success('ID copied to clipboard');
    onClose();
  };

  // Position menu within viewport
  const menuStyle = {
    left: Math.min(x, window.innerWidth - 200),
    top: Math.min(y, window.innerHeight - 220),
  };

  return (
    <>
      <div className="fixed inset-0 z-[100]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div
        className="fixed z-[101] min-w-[180px] rounded-xl border border-border bg-card shadow-2xl animate-slide-up-fade overflow-hidden"
        style={menuStyle}
      >
        {/* Node info header */}
        {node && (
          <div className="px-3 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Info size={11} className="text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {node.type} · {connectedEdges} connection{connectedEdges !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleDuplicate}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-xs text-foreground hover:bg-muted transition-colors"
        >
          <Copy size={13} className="text-muted-foreground" />
          Duplicate
        </button>
        <button
          onClick={handleCopyId}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-xs text-foreground hover:bg-muted transition-colors"
        >
          <ClipboardCopy size={13} className="text-muted-foreground" />
          Copy ID
        </button>
        <div className="h-px bg-border mx-2" />
        <button
          onClick={handleDelete}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 size={13} />
          Delete Node
        </button>
      </div>
    </>
  );
};
