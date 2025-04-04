import { pool } from "../MySQL/Connection.js"

const userTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(400) NOT NULL,
    password VARCHAR(8) NOT NULL,
    role ENUM('Administrator', 'User', 'Owner') NOT NULL
)`;

const storeTableQuery = `CREATE TABLE IF NOT EXISTS stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Store name,
    email VARCHAR(100) NOT NULL UNIQUE, -- Store owner's email,
    address VARCHAR(400) NOT NULL, -- Address validation: Max 400 characters,
    rating FLOAT DEFAULT 0, -- Average rating (calculated dynamically),
    user_id INT NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);`


const ratingTableQuery = `CREATE TABLE IF NOT EXISTS ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL, 
  store_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5), -- Rating range: 1-5
  UNIQUE (user_id, store_id), -- Ensures user-store pair is unique
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`;


const createTable = async (tableName, query) => {
  try {
    await pool.query(query);
    console.log(`${tableName} table created or already exists`);
  } catch (error) {
    console.log(`Error creating ${tableName}`, error);
  }
};

const createAllTable = async () => {
  try {
    await createTable("Users", userTableQuery);
    await createTable("store", storeTableQuery);
    await createTable("rating", ratingTableQuery);


    // await createTable("Posts", postTableQuery);
    // console.log("All tables created successfully!!");
  } catch (error) {
    console.log("Error creating tables", error);
    throw error;
  }
};

export default createAllTable;