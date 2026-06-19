import express from "express";
import cors from "cors";
import debugRoutes from "./routes/debugRoutes";
import ec2Routes from "./routes/ec2Routes";

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

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use("/api/debug", debugRoutes);