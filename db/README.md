# Database Documentation

This directory contains MySQL database dumps for the **offser** application. The dumps include table definitions and stored procedures necessary for managing password records.

## Database Information

- **Database Name**: `offser`
- **MySQL Version**: 8.0.45
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_0900_ai_ci
- **Server**: 127.0.0.1 (localhost)

## Files

### offser_passwords.sql

This file contains the database schema for the `passwords` table.

#### Table: `passwords`

Stores password records with associated email addresses.

**Schema:**

| Column      | Type         | Constraints                | Description                          |
|-------------|--------------|----------------------------|--------------------------------------|
| `ENTRY_ID`  | INT          | PRIMARY KEY, AUTO_INCREMENT, UNIQUE | Unique identifier for each password entry |
| `MAIL`      | VARCHAR(255) | NOT NULL                   | Email address associated with the password |
| `PASSWORD`  | VARCHAR(255) | NOT NULL                   | Password value                       |

**Engine**: InnoDB  
**Character Set**: utf8mb3

### offser_routines.sql

This file contains stored procedures for CRUD operations on the `passwords` table.

#### Stored Procedures

##### 1. `INSERT_PASSWORD`

Inserts a new password record into the database.

**Parameters:**
- `P_MAIL` (VARCHAR(255), IN): Email address
- `P_PASSWORD` (VARCHAR(255), IN): Password value

**Usage Example:**
```sql
CALL INSERT_PASSWORD('user@example.com', 'securePassword123');
```

##### 2. `READ_PASSWORDS`

Retrieves password records within a specified range of entry IDs.

**Parameters:**
- `UPPER_LIMIT` (INT, IN): Maximum entry ID to retrieve
- `LOWER_LIMIT` (INT, IN): Minimum entry ID to retrieve (optional)

**Behavior:**
- If `LOWER_LIMIT` is `NULL`: Returns all records where `ENTRY_ID <= UPPER_LIMIT`
- If both limits are provided: Returns records where `ENTRY_ID >= LOWER_LIMIT AND ENTRY_ID <= UPPER_LIMIT`

**Returns:**
- `ID`: Entry ID
- `MAIL`: Email address
- `PASSWORD`: Password value

**Usage Examples:**
```sql
-- Get all passwords with ID <= 10
CALL READ_PASSWORDS(10, NULL);

-- Get passwords with ID between 5 and 15
CALL READ_PASSWORDS(15, 5);
```

##### 3. `DELETE_ENTRY`

Deletes password record(s) from the database.

**Parameters:**
- `P_LOWER_LIMIT` (INT, IN): Entry ID or minimum range value
- `P_UPPER_LIMIT` (INT, IN): Maximum range value (optional)

**Behavior:**
- If `P_UPPER_LIMIT` is `NULL`: Deletes the single record where `ENTRY_ID = P_LOWER_LIMIT`
- If both limits are provided: Deletes all records where `ENTRY_ID >= P_LOWER_LIMIT AND ENTRY_ID <= P_UPPER_LIMIT`

**Usage Examples:**
```sql
-- Delete a single entry with ID 5
CALL DELETE_ENTRY(5, NULL);

-- Delete entries with ID between 10 and 20
CALL DELETE_ENTRY(10, 20);
```

## Importing the Database

To set up the database, import both SQL files in the following order:

### Step 1: Import Table Structure
```bash
mysql -u root -p offser < offser_passwords.sql
```

### Step 2: Import Stored Procedures
```bash
mysql -u root -p offser < offser_routines.sql
```

### Alternative: Import Both Files at Once
```bash
cat offser_passwords.sql offser_routines.sql | mysql -u root -p offser
```

## Notes

- The database dump was created on **March 5, 2026** at **13:27:41**
- Ensure you have the `offser` database created before importing:
  ```sql
  CREATE DATABASE IF NOT EXISTS offser;
  ```
- The stored procedures are defined with `DEFINER='root'@'localhost'`. Adjust privileges as needed for your environment.
- The `passwords` table uses `InnoDB` engine for transaction support and data integrity.
- AUTO_INCREMENT is set to start at 7 in the current dump, indicating previous test data.