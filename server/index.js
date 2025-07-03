import path from "path";
import express from "express";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import visitRoutes from './routes/visitRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
//import productRoutes from './routes/productRoutes.js'
//import categoryRoutes from './routes/categoryRoutes.js'
import connectDB from "./config/db.js";
import nodemailer from "nodemailer"
import cors from "cors";
//import uploadRoutes from "./routes/uploadRoutes.js"
 dotenv.config();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Changed from 5173 to 5174
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Création du serveur HTTP
const server = http.createServer(app);

// Création de l'instance Socket.io


// Stockage de l'instance io pour l'utiliser dans les contrôleurs


app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);
//app.use("/api/category",categoryRoutes)
//app.use("/api/products", productRoutes)
//app.use("/api/upload", uploadRoutes)

// Nodemailer setup with Ethereal
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'abigale63@ethereal.email',
        pass: '5bCWZ2GK9anZBmpGz2'
    }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// Endpoint to send email
app.post("/api/send-email", async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    const info = await transporter.sendMail({
      from: '"Visitor Management" <abigale63@ethereal.email>',
      to: to || "ajimiomar.oa@gmail.com", // Default to your email for testing
      subject: subject || "Test Email",
      text: text || "Hello world?",
      html: html || "<b>Hello world?</b>",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.status(200).json({ message: "Email sent", messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    console.error("Error while sending mail:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const __dirname = path.resolve()
//app.use('/uploads', express.static(path.join(__dirname +'/Uploads')))
server.listen(port, () => console.log(`server running on port: ${port}`));

// Exportez une fonction utilitaire pour notifier les agents
export const notifyAccessUpdate = () => {
  io.emit("access-update");
};