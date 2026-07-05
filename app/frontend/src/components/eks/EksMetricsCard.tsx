interface EksMetricsCardProps {
  cpu:    number;
  memory: number;
  disk:   number;
  network:number;
}

export default function EksMetricsCard({
  cpu,
  memory,
  disk,
  network,
  
}: EksMetricsCardProps) {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">
        Average Current Metrics
      </h2>

      <div className="grid grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-muted-foreground">
            CPU
          </p>
          <p className="text-2xl font-bold">
            {cpu.toFixed(2)}%
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Memory
          </p>
          <p className="text-2xl font-bold">
            {memory.toFixed(2)} GB
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Disk
          </p>
          <p className="text-2xl font-bold">
            {disk.toFixed(2)} GB
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Network
          </p>
          <p className="text-2xl font-bold">
            {network.toFixed(2)} MB/s
          </p>
        </div>
      </div>
    </div>
  );
}