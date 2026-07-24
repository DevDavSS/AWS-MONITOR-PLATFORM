import express from "express";
import { startAlertScheduler } from "./schedulers/alertScheduler";
import alertRoutes from "./routes/alertRoutes";
import rulesRoutes from "./routes/ruleRoute";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// GET alerts
app.use(
    "/api/alerts",
    alertRoutes
);

// GET/POST/PATCH rules
app.use(
    "/api/rules",
    rulesRoutes
);

const PORT = 3001;

app.listen(PORT, async () => {

    console.log(`Alert Service running on port ${PORT}`);

    await startAlertScheduler();

});