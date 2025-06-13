const express = require("express");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const cors = require("cors");


const app = express();
app.use(express.json());


app.use(cors({
  origin: "http://localhost:3001", // your frontend URL here
  credentials: true,                // if you use cookies/auth
}));

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

