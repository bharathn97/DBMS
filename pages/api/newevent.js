import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    EventName,
    EventHost,
    Description,
    EventDate,
    EventType,
    MaximumAttendance,
    CurrentRevenue,
    Location,
  } = req.body;

  // Validate input
  if (!EventName || !EventHost || !Description || !EventDate || !Location) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Insert the new event into the database
    await connection
      .promise()
      .query(
        "INSERT INTO events (EventName, EventHost, Description, EventDate, EventType, MaximumAttendance, CurrentRevenue, Location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          EventName,
          EventHost,
          Description,
          EventDate,
          EventType,
          MaximumAttendance,
          CurrentRevenue,
          Location,
        ]
      );

    res.status(201).json({
      success: true,
      message: "Event created successfully",
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
