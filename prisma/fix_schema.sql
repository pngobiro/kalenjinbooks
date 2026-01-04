-- Safely add missing columns to Author table
-- We use a script that tries to add them individually

-- status should be fine with constant default
ALTER TABLE Author ADD COLUMN status TEXT DEFAULT 'PENDING';
ALTER TABLE Author ADD COLUMN rejectionReason TEXT;
-- Avoid CURRENT_TIMESTAMP as default in ALTER TABLE
ALTER TABLE Author ADD COLUMN appliedAt DATETIME;
ALTER TABLE Author ADD COLUMN approvedAt DATETIME;

-- Also ensure User has the OAuth fields just in case
ALTER TABLE User ADD COLUMN image TEXT;
ALTER TABLE User ADD COLUMN googleId TEXT;

-- Create index for googleId
CREATE INDEX IF NOT EXISTS idx_user_googleId ON User(googleId);
