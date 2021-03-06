DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS red_flags CASCADE;
DROP TABLE IF EXISTS interventions CASCADE;


CREATE TABLE IF NOT EXISTS users(
  id serial PRIMARY KEY,
  firstname VARCHAR NOT NULL,
  lastname VARCHAR NOT NULL,
  othernames VARCHAR NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  phone_number VARCHAR NOT NULL,
  is_admin BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()

);

CREATE TABLE red_flags(
  id serial PRIMARY KEY,
  user_id INTEGER NOT NULL,
  location VARCHAR NOT NULL,
  comment VARCHAR NOT NULL,
  images TEXT NOT NULL,
  videos TEXT NOT NULL,
  status VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY( user_id ) REFERENCES users( id ) ON DELETE CASCADE
);

CREATE TABLE interventions(
  id serial PRIMARY KEY,
  user_id INTEGER NOT NULL,
  location VARCHAR NOT NULL,
  comment VARCHAR NOT NULL,
  images TEXT NOT NULL,
  videos TEXT NOT NULL,
  status VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY( user_id ) REFERENCES users( id ) ON DELETE CASCADE
);

