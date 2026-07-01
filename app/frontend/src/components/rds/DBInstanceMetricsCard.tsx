interface DBInstanceMetricsCardProps {
  cpu: number;
  memory: number;
  connections: number;
  networkIn: number;
  networkOut: number;
  readIops: number;
  writeIops: number;
  readThroughput: number;
  writeThroughput: number;
  readLatency:      number;
  writeLatency:     number;
  commitThroughput: number;
  selectThroughput: number;
}

export default function DBInstanceMetricsCard({
  cpu,
  memory,
  connections,
  networkIn,
  networkOut,
  readIops,
  writeIops,
  readThroughput,
  writeThroughput,
  readLatency,
  writeLatency,
  commitThroughput,
  selectThroughput,    
}: DBInstanceMetricsCardProps) {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">
        Current Metrics
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
            Connections
          </p>
          <p className="text-2xl font-bold">
            {connections} Conn
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Network In
          </p>
          <p className="text-2xl font-bold">
            {networkIn.toFixed(2)} MB/s
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Network Out
          </p>
          <p className="text-2xl font-bold">
            {networkOut.toFixed(2)} MB/s
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Read IOPS
          </p>
          <p className="text-2xl font-bold">
            {readIops.toFixed(2)} iop/s
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Write IOPS
          </p>
          <p className="text-2xl font-bold">
            {writeIops.toFixed(2)} iop/s
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Read Throughput
          </p>
          <p className="text-2xl font-bold">
            {readThroughput.toFixed(2)} MB/s
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Write Throughput
          </p>
          <p className="text-2xl font-bold">
            {writeThroughput.toFixed(2)} MB/s
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Read Latency
          </p>
          <p className="text-2xl font-bold">
            {readLatency.toFixed(2)} 
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Write Latency
          </p>
          <p className="text-2xl font-bold">
            {writeLatency.toFixed(2)} 
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Commit Throughput
          </p>
          <p className="text-2xl font-bold">
            {commitThroughput.toFixed(2)} 
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Select Throughput
          </p>
          <p className="text-2xl font-bold">
            {selectThroughput.toFixed(2)} 
          </p>
        </div>

      </div>
    </div>
  );
}