-- Add OAuth fields to User table
ALTER TABLE User ADD COLUMN image TEXT;
ALTER TABLE User ADD COLUMN googleId TEXT;

-- Add approval fields to Author table
ALTER TABLE Author ADD COLUMN status TEXT DEFAULT 'PENDING';
ALTER TABLE Author ADD COLUMN rejectionReason TEXT;
ALTER TABLE Author ADD COLUMN appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Author ADD COLUMN approvedAt DATETIME;

-- Create index for googleId (unique constraint handled at app level)
CREATE INDEX IF NOT EXISTS idx_user_googleId ON User(googleId);
