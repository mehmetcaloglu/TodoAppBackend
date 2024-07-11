import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads"))); // Yüklenen dosyaları servis et

app.use("/api/auth", (await import("./routes/authRoutes.js")).default);
app.use("/api/todos", (await import("./routes/todoRoutes.js")).default);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
