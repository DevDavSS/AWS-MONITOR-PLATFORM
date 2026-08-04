import express from "express";
import { startAlertScheduler } from "./schedulers/alertScheduler";
import alertRoutes from "./routes/alertRoutes";
import rulesRoutes from "./routes/ruleRoute";
import cors from "cors"

const app = express();

/* SERVICE HEALTHCHECK */
app.get("/api/alerts/health", (_, res) => {
    res.status(200).json({
        status: "UP"
    });
});



// Middleware
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// GET alerts
app.use(
    "/api/alerts",
    alertRoutes
);

// GET/POST/PATCH rules
app.use(
    "/api/alerts/rules",
    rulesRoutes
);

const PORT = 3001;

app.listen(PORT, async () => {

    console.log(`Alert Service running on port ${PORT}`);

    await startAlertScheduler();

});