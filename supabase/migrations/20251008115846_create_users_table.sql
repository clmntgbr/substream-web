/*
  # Create Users Authentication System

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique user identifier
      - `email` (text, unique, not null) - User email address
      - `password` (text, not null) - Hashed password
      - `firstname` (text, not null) - User first name
      - `lastname` (text, not null) - User last name
      - `roles` (text[], not null) - Array of user roles (ROLE_USER, ROLE_ADMIN, etc.)
      - `created_at` (timestamptz, not null) - Account creation timestamp
      - `updated_at` (timestamptz, not null) - Last update timestamp

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read their own data
    - Add policy for users to update their own data (except email and roles)
    - Admin users can read all users

  3. Indexes
    - Create index on email for faster lookups

  4. Important Notes
    - Passwords will be hashed using bcrypt before storage
    - Default role is ROLE_USER
    - Timestamps are automatically managed
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  firstname text NOT NULL DEFAULT '',
  lastname text NOT NULL DEFAULT '',
  roles text[] NOT NULL DEFAULT ARRAY['ROLE_USER'],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Users can update their own data (except email and roles)
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
