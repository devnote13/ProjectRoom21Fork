import express, { Request, Response } from "express";
import path from "path";
import bcrypt from "bcrypt";

const app = express();
const PORT = 3000;

// middle ware
app.use(express.json());

// Serve everything in the "public" folder
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {

});

app.post("/Info", (req: Request, res: Response) => {
    const { USERNAME, EMAIL, PASSWORD } = req.body;

    if (!USERNAME || !EMAIL || !PASSWORD) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields."
        });
    }

    console.log("Username:", USERNAME);
    console.log("Email:", EMAIL);
    console.log("Password:", PASSWORD);

    res.json({
        success: true,
        message: "Information received."
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});