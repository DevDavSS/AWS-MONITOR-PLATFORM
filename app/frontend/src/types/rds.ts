/* Metric Point Interface */
export interface MetricPoint {
  time: string;
  value: number;
}

/* RDS Aurora Database Interface */
export interface RdsDatabase {
  id:                 string;
  dbIdentifier:       string;
  clusterIdentifier:  string;

  account:        string;
  accountId:      string;
  organization:   string;
  region:         string;

  size:           string,
  engine:         string;
  role: "Writer" | "Reader";
  status:         string;

  currentMetrics: {
    cpu:              number;
    memory:           number;
    connections:      number;
    networkIn:        number;
    networkOut:       number;
    readIops:         number; /*Operaciones de lectura por segundo */
    writeIops:        number; /*Operaciones de escritura por segundo */
    readThroughput:   number; /*Cantidad de datos leídos por segundo */
    writeThroughput:  number; /*Cantidad de datos escritos por segundo */
    readLatency:      number; /*Tiempo promedio que tarda la base de datos en completar una operación de lectura. */
    writeLatency:     number; /*Tiempo promedio que tarda la base de datos en completar una operación de escritura. */
    commitThroughput: number; /*Número de transacciones (COMMIT) completadas por segundo. cantidad de operaciones confirmadas exitosamente en la base de datos*/
    selectThroughput: number; /*Número de consultas SELECT ejecutadas por segundo. */

  };

  historyMetrics: {
    cpu:              MetricPoint[];
    memory:           MetricPoint[];
    connections:      MetricPoint[];
    networkIn:        MetricPoint[];
    networkOut:       MetricPoint[];
    readIops:         MetricPoint[];
    writeIops:        MetricPoint[];
    readThroughput:   MetricPoint[];
    writeThroughput:  MetricPoint[];
    readLatency:      MetricPoint[];
    writeLatency:     MetricPoint[];
    commitThroughput: MetricPoint[];
    selectThroughput: MetricPoint[]; 
  
  };
}