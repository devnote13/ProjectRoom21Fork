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
// TYPES
// =============================
type JwtUser = {
    id: string;
    username: string;
    role: string;
};

// =============================
// AUTH
// =============================
function authenticateToken(req: any, res: any, next: any) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ success: false, message: "No token" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);

        if (!decoded?.id) {
            return res.status(403).json({ success: false, message: "Invalid token payload" });
        }

        req.user = {
            id: decoded.id,
            username: decoded.username || null,
        };

        next();

    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
}

// =============================
// ADMIN CHECK (DB SAFE)
// =============================
function requireAdmin(req: any, res: any, next: any) {

    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ success: false, message: "No token" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admins only" });
        }

        req.user = decoded;
        next();

    } catch {
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
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
            role: "user",
            banned: false,
            avatar: null
        }
    ]);

    if (error) return res.json({ success: false, message: error.message });

    res.json({ success: true });
});

// =============================
// SIGN IN (BAN CHECK FIXED)
// =============================
app.post("/signin", async (req, res) => {

    const { username, password } = req.body;

    const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

    if (!user) return res.json({ success: false });

    if (user.banned === true) {
        return res.status(403).json({
            success: false,
            message: "BANNED"
        });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json({ success: false });

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({
        success: true,
        token,
        username: user.username,
        chips: user.chips,
        avatar: user.avatar
    });
});

app.post("/admin-login", async (req, res) => {

    const { username, password } = req.body;

    const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }

    // must be admin
    if (user.role !== "admin") {
        return res.json({ success: false, message: "Not admin" });
    }

    // check password
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
        return res.json({ success: false, message: "Wrong password" });
    }

    // issue ADMIN SESSION TOKEN
    const token = jwt.sign(
        {
            id: user.id,
            role: "admin"
        },
        JWT_SECRET,
        { expiresIn: "2h" }
    );

    res.json({
        success: true,
        token
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
// UPDATE PROFILE (REAL GLOBAL FIX)
// =============================
app.post("/update-profile", authenticateToken, async (req: any, res) => {

    const userId = req.user.id;
    const { username, email, password, avatar } = req.body;

    const updates: any = {};

    if (username) updates.username = username;
    if (email) updates.email = email;
    if (avatar) updates.avatar = avatar;

    if (password) {
        updates.password = await bcrypt.hash(password, 10);
    }

    const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId);

    if (error) return res.json({ success: false, message: error.message });

    res.json({ success: true });
});

// =============================
// ADMIN: USERS (SEARCH + FILTER FIX)
// =============================
app.get("/admin", authenticateToken, requireAdmin, async (req: any, res) => {

    const search = req.query.search?.toString() || "";

    let query = supabase
        .from("users")
        .select("id, username, email, chips, role, banned");

    if (search) {
        query = query.ilike("username", `%${search}%`);
    }

    const { data } = await query;

    res.json({ success: true, users: data });
});

app.get("/admin-panel", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../public/admin/admin.html")
    );
});

// =============================
// WITHDRAW REQUESTS
// =============================
app.get("/admin/withdraws", authenticateToken, requireAdmin, async (req, res) => {

    const { data } = await supabase
        .from("withdraw_requests")
        .select("*")
        .order("created_at", { ascending: false });

    res.json({ success: true, requests: data });
});

// =============================
// APPROVE WITHDRAW
// =============================
app.post("/admin/withdraw/approve-user", authenticateToken, requireAdmin, async (req, res) => {

    const { username } = req.body;

    const { data: requests } = await supabase
        .from("withdraw_requests")
        .select("*")
        .eq("username", username)
        .eq("status", "pending");

    if (!requests?.length) {
        return res.json({ success: false, message: "No requests" });
    }

    const total = requests.reduce((a, r) => a + r.amount, 0);

    const { data: user } = await supabase
        .from("users")
        .select("chips")
        .eq("username", username)
        .single();

    if (!user) return res.json({ success: false });

    if (user.chips < total) {
        return res.json({ success: false, message: "Insufficient balance" });
    }

    await supabase
        .from("users")
        .update({ chips: user.chips - total })
        .eq("username", username);

    await supabase
        .from("withdraw_requests")
        .update({ status: "approved" })
        .eq("username", username)
        .eq("status", "pending");

    res.json({ success: true });
});

// =============================
// REJECT WITHDRAW
// =============================
app.post("/admin/withdraw/reject-user", authenticateToken, requireAdmin, async (req, res) => {

    const { username } = req.body;

    await supabase
        .from("withdraw_requests")
        .update({ status: "rejected" })
        .eq("username", username)
        .eq("status", "pending");

    res.json({ success: true });
});

// =============================
// BAN SYSTEM
// =============================
app.post("/admin/ban-user", authenticateToken, requireAdmin, async (req, res) => {

    const { userId } = req.body;

    await supabase
        .from("users")
        .update({ banned: true })
        .eq("id", userId);

    res.json({ success: true });
});

app.post("/admin/unban-user", authenticateToken, requireAdmin, async (req, res) => {

    const { userId } = req.body;

    await supabase
        .from("users")
        .update({ banned: false })
        .eq("id", userId);

    res.json({ success: true });
});

app.get("/admin/stats", authenticateToken, requireAdmin, async (req, res) => {

    const { data: users } = await supabase
        .from("users")
        .select("chips");

    const { data: withdraws } = await supabase
        .from("withdraw_requests")
        .select("amount, status")
        .eq("status", "approved");

    const totalChips = (users || []).reduce((s, u) => s + u.chips, 0);

    const totalWithdrawn = (withdraws || []).reduce((s, w) => s + w.amount, 0);

    const profit = totalChips - totalWithdrawn;

    res.json({
        success: true,
        stats: {
            totalUsers: users?.length || 0,
            totalChips,
            totalWithdrawn,
            profit
        }
    });
});

app.post("/last-played", authenticateToken, async (req, res) => {

    const { gameId } = req.body;

    if (!gameId) return res.json({ success: false });

    const { error } = await supabase
        .from("game_history")
        .insert({
            user_id: (req as any).user.id,
            game_id: gameId,
            played_at: new Date().toISOString()
        });

    if (error) {
        return res.json({ success: false, message: error.message });
    }

    res.json({ success: true });
});

app.get("/last-played", authenticateToken, async (req, res) => {

    const { data, error } = await supabase
        .from("game_history")
        .select("*")
        .eq("user_id", (req as any).user.id)
        .order("played_at", { ascending: false })
        .limit(5);

    if (error) {
        return res.json({ success: false });
    }

    const gameIds = data.map(g => g.game_id);

    const { data: games } = await supabase
        .from("games")
        .select("*")
        .in("id", gameIds);

    res.json({
        success: true,
        games
    });
});

app.get("/my-bets", authenticateToken, async (req, res) => {

    const { data, error } = await supabase
        .from("bets")
        .select("*")
        .eq("user_id", (req as any).user.id)
        .order("created_at", { ascending: false })
        .limit(20);

    if (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }

    res.json({
        success: true,
        bets: data
    });
});

// =============================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});