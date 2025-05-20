import mysql from "mysql2/promise"
import fs from "fs"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "integra_test",
}

async function seedDatabase() {
  console.log("Starting database seeding...")

  // Create connection
  const connection = await mysql.createConnection(dbConfig)

  try {
    // Read SQL file
    const sql = fs.readFileSync("./database/schema.sql", "utf8")

    // Split SQL file into individual statements
    const statements = sql.split(";").filter((statement) => statement.trim() !== "")

    // Execute each statement
    for (const statement of statements) {
      await connection.execute(statement + ";")
    }

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await connection.end()
  }
}

seedDatabase()
