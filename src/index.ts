import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import { supabase } from "./supabase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET as string;

// =============================
// JWT TYPE
// =============================
type JwtUser = {
    id: string;
    username: string;
    role: string;
};

// =============================
// AUTH MIDDLEWARE
// =============================
function authenticateToken(
    req: Request & { user?: JwtUser },
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "No token" });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET) as JwtUser;
        next();
    } catch {
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
}

// =============================
// ADMIN CHECK (FIXED SAFE)
// =============================
async function requireAdmin(
    req: Request & { user?: JwtUser },
    res: Response,
    next: NextFunction
) {
    if (!req.user) {
        return res.status(401).json({ success: false });
    }

    // 🔥 ALWAYS verify from DB (not JWT only)
    const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", req.user.id)
        .single();

    if (!data || data.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin only" });
    }

    next();
}

// =============================
// SIGN UP
// =============================
app.post("/signup", async (req, res) => {

    const { username, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const { error } = await supabase.from("users").insert([
        {
            username,
            email,
            password: hash,
            chips: 0,
            role: "user"
        }
    ]);

    if (error) return res.json({ success: false, message: error.message });

    res.json({ success: true });
});

// =============================
// SIGN IN
// =============================
app.post("/signin", async (req, res) => {

    const { username, password } = req.body;

    const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

    if (!user) return res.json({ success: false });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json({ success: false });

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({
        success: true,
        token,
        username: user.username,
        chips: user.chips
    });
});

// =============================
// ME
// =============================
app.get("/me", authenticateToken, async (req: any, res) => {

    const { data } = await supabase
        .from("users")
        .select("id, username, email, chips, role, avatar")
        .eq("id", req.user.id)
        .single();

    res.json({ success: true, user: data });
});

// =============================
// UPDATE PROFILE
// =============================
app.post("/update-profile", authenticateToken, async (req: any, res) => {

    const userId = req.user.id;
    const { username, email, password, avatar } = req.body;

    const updates: any = {};

    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (avatar) updates.avatar = avatar;

    const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId);

    if (error) {
        return res.json({ success: false, message: error.message });
    }

    res.json({ success: true });
});

// =============================
// ADMIN PANEL API
// =============================
app.get("/admin", authenticateToken, requireAdmin, async (req, res) => {

    const { data } = await supabase
        .from("users")
        .select("id, username, email, chips, role");

    res.json({ success: true, users: data });
});

// =============================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});