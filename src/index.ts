import express, { Request, Response } from "express";
import path from "path";

const app = express();
const PORT = 3000;

// middle ware
app.use(express.json());

// Serve everything in the "public" folder
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {

});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});