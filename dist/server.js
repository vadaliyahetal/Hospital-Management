"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const patient_routes_js_1 = __importDefault(require("./routes/patient.routes.js"));
const doctor_routes_js_1 = __importDefault(require("./routes/doctor.routes.js"));
const appointment_routes_js_1 = __importDefault(require("./routes/appointment.routes.js"));
const pharmacy_routes_js_1 = __importDefault(require("./routes/pharmacy.routes.js"));
const laboratory_routes_js_1 = __importDefault(require("./routes/laboratory.routes.js"));
const bed_routes_js_1 = __importDefault(require("./routes/bed.routes.js"));
const billing_routes_js_1 = __importDefault(require("./routes/billing.routes.js"));
const dashboard_routes_js_1 = __importDefault(require("./routes/dashboard.routes.js"));
const db_js_1 = require("./config/db.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Request logger
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
});
// Health & System Info
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        service: 'MediCare Hospital Management System API',
        version: '1.0.0',
        database: (0, db_js_1.isDbConnected)() ? 'MySQL Connected' : 'In-Memory Mock Store Active (Self-contained)'
    });
});
// Register API Routes
app.use('/api/auth', auth_routes_js_1.default);
app.use('/api/patients', patient_routes_js_1.default);
app.use('/api/doctors', doctor_routes_js_1.default);
app.use('/api/appointments', appointment_routes_js_1.default);
app.use('/api/pharmacy', pharmacy_routes_js_1.default);
app.use('/api/laboratory', laboratory_routes_js_1.default);
app.use('/api/beds', bed_routes_js_1.default);
app.use('/api/billing', billing_routes_js_1.default);
app.use('/api/dashboard', dashboard_routes_js_1.default);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `API route '${req.method} ${req.originalUrl}' not found.`
    });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});
app.listen(PORT, () => {
    console.log(`🏥 [MediCare Server] Hospital Management API running at http://localhost:${PORT}`);
    console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`🚀 Ready for Frontend client connections.`);
});
