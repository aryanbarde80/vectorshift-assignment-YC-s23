import { ReactNode } from 'react';

type DraggableNodeProps = {
  type: string;
  label: string;
  icon: ReactNode;
  colorClass: string;
};

export const DraggableNode = ({ type, label, icon, colorClass }: DraggableNodeProps) => {
  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="group flex cursor-grab items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 active:cursor-grabbing active:scale-95"
      draggable
      onDragStart={onDragStart}
    >
      <div className={`flex h-5 w-5 items-center justify-center rounded ${colorClass} text-primary-foreground shadow-sm transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <span className="text-foreground">{label}</span>
    </div>
  );
};
