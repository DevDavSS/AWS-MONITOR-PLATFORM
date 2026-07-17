import express from "express";
import cors from "cors";
import organiazationRoute from "./routes/organizationsRoutes"
import ec2Routes from "./routes/ec2Routes";
import rdsRoutes from "./routes/rdsRoutes"
import eksRoutes from "./routes/eksRoutes"
import resourceSnapshotRoutes from "./routes/resourceSnapshotRoutes";

import { startResourceScheduler } from "./scheduler/resourceScheduler";

const app = express();

app.use(cors());
app.use(express.json());

/* Rutas para EC2 */
app.use("/api/ec2", ec2Routes);

app.get("/", (_, res) => {
  res.json({
    message: "Backend running",
  });
});

/* Rutas para RDS */
app.use("/api/rds", rdsRoutes);

app.get("/", (_, res) => {
  res.json({
    message: "Backend running",
  });
});


/* Rutas para EKS */
app.use("/api/eks", eksRoutes);

app.get("/", (_, res) => {
  res.json({
    message: "Backend running",
  });
});


/* Rutas para consultar organizaciones */
app.use("/api/organizations", organiazationRoute);

app.get("/", (_, res) => {
  res.json({
    message: "Backend running",
  });
});

/* Rutas para la generacion y consulta de los Resource Snaphots */
app.use(
    "/api/resources/snapshots",
    resourceSnapshotRoutes
);


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startResourceScheduler();
});


