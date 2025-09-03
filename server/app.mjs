import "dotenv/config";
import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json()); //เพิ่ม middleware เพื่อ parse JSON body

app.post("/assignments", async (req, res) => {
  try {
    const { title, content, category } = req.body; //รับข้อมูลจาก body
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!title || !content || !category) {
      return res.status(400).json({ 
        message: "Server could not create assignment because there are missing data from client" 
      });
    }

    // Insert ข้อมูลลงฐานข้อมูล
    const insertQuery = `INSERT INTO assignments (title, content, category) 
                         VALUES ($1, $2, $3) RETURNING *`;
    const values = [title, content, category];

    const result = await connectionPool.query(insertQuery, values);
    
    return res.status(201).json({ 
      message: "Created assignment successfully" 
    });
    
  } catch (error) {
    console.error("Error creating assignment:", error);
    
    // ตรวจสอบว่าเป็น database connection error หรือไม่
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(500).json({ 
        message: "Server could not create assignment because database connection" 
      });
    }
    
    return res.status(500).json({ 
      message: "Internal Server Error" 
    });
  }
});

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
