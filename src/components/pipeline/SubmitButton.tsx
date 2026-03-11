import { usePipelineStore } from '@/store/pipelineStore';
import { Play, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type PipelineResult = {
  num_nodes: number;
  num_edges: number;
  is_dag: boolean;
};

function validatePipeline(nodes: any[], edges: any[]): PipelineResult {
  const numNodes = nodes.length;
  const numEdges = edges.length;

  const inDegree: Record<string, number> = {};
  nodes.forEach((n) => (inDegree[n.id] = 0));
  edges.forEach((e) => {
    inDegree[e.target] = (inDegree[e.target] || 0) + 1;
  });

  const queue: string[] = [];
  Object.entries(inDegree).forEach(([id, deg]) => {
    if (deg === 0) queue.push(id);
  });

  let processed = 0;
  while (queue.length > 0) {
    const current = queue.shift()!;
    processed++;
    edges.forEach((e) => {
      if (e.source === current) {
        inDegree[e.target]--;
        if (inDegree[e.target] === 0) {
          queue.push(e.target);
        }
      }
    });
  }

  return {
    num_nodes: numNodes,
    num_edges: numEdges,
    is_dag: processed === numNodes,
  };
}

export const SubmitButton = () => {
  const { nodes, edges } = usePipelineStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      toast.error('Pipeline is empty. Add some nodes first!');
      return;
    }

    setLoading(true);
    let data: PipelineResult;
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      data = await res.json();
    } catch {
      data = validatePipeline(nodes, edges);
    }
    setResult(data);
    setLoading(false);
    setShowResult(true);

    if (data.is_dag) {
      toast.success(`Valid DAG! ${data.num_nodes} nodes, ${data.num_edges} edges`);
    } else {
      toast.error('Pipeline contains cycles — not a valid DAG');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.97] disabled:opacity-60"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
        <span className="hidden sm:inline">Submit Pipeline</span>
        <span className="sm:hidden">Run</span>
      </button>

      {showResult && result && (
        <div className="absolute bottom-full right-0 sm:left-1/2 z-50 mb-3 sm:-translate-x-1/2 animate-slide-up-fade">
          <div className="w-64 sm:w-72 rounded-xl border border-border bg-card p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Pipeline Analysis</h3>
              <button
                onClick={() => setShowResult(false)}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-xs text-muted-foreground">Nodes</span>
                <span className="text-sm font-semibold text-foreground">{result.num_nodes}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-xs text-muted-foreground">Edges</span>
                <span className="text-sm font-semibold text-foreground">{result.num_edges}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-xs text-muted-foreground">Is DAG</span>
                <span className="flex items-center gap-1.5">
                  {result.is_dag ? (
                    <>
                      <CheckCircle size={14} className="text-node-input" />
                      <span className="text-sm font-semibold text-node-input">Yes</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={14} className="text-destructive" />
                      <span className="text-sm font-semibold text-destructive">No</span>
                    </>
                  )}
                </span>
              </div>
            </div>
            {!result.is_dag && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-2.5">
                <AlertTriangle size={13} className="mt-0.5 text-destructive flex-shrink-0" />
                <p className="text-[11px] text-destructive leading-relaxed">
                  Pipeline contains cycles. Remove circular connections to create a valid DAG.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
