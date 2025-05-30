CREATE TYPE delivery_method_enum AS ENUM ('email', 'sms');
CREATE TYPE membership_status_enum AS ENUM ('active', 'expired');
CREATE TYPE action_type_enum AS ENUM (
  'create',
  'update',
  'delete',
  'login',
  'logout',
  'password_change',
  'membership_signup',
  'privilege_used',
  'otp_generated',
  'otp_verified',
  'workshop_registration',
  'profile_update',
  'payment_made',
  'parking_entry',
  'parking_exit'
);

CREATE TABLE roles (
role_id SERIAL PRIMARY KEY,
role_name VARCHAR(50) NOT NULL
);

CREATE TABLE permissions (
permission_id SERIAL PRIMARY KEY,
description TEXT
);

CREATE TABLE role_permissions (
role_permission_id SERIAL PRIMARY KEY,
role_id INT REFERENCES roles(role_id) NOT NULL,
permission_id INT REFERENCES permissions(permission_id) NOT NULL
);

CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
role_id INT REFERENCES roles(role_id) NOT NULL,
first_name VARCHAR(50) NOT NULL,
last_name  VARCHAR(50) NOT NULL,
email VARCHAR(255) NOT NULL,
phone_number CHAR(8) NOT NULL,
password_hash VARCHAR(255),
date_of_birth DATE
);

CREATE TABLE otp_tokens (
token_id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
otp_code CHAR(6) NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
expires_at TIMESTAMPTZ NOT NULL,
delivery_method delivery_method_enum NOT NULL
);

CREATE TABLE action_log (
log_id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users(user_id),
action_type action_type_enum NOT NULL,
description TEXT, 
timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE password_reset (
reset_id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
reset_token VARCHAR(255) NOT NULL UNIQUE,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
expires_at TIMESTAMPTZ NOT NULL,
is_used BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE membership_types (
membership_type_id SERIAL PRIMARY KEY,
membership_name VARCHAR(50),
price NUMERIC(10, 2) NOT NULL,
description TEXT
);

CREATE TABLE membership (
member_id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
status membership_status_enum NOT NULL DEFAULT 'active',
start_date DATE NOT NULL DEFAULT CURRENT_DATE,
iu_number CHAR(10) UNIQUE,
license_plate VARCHAR(8)
);

CREATE TABLE privilege (
privilege_id SERIAL PRIMARY KEY,
privilege_name VARCHAR(50),
description TEXT
);

CREATE TABLE membership_privileges (
membership_type_id INT NOT NULL REFERENCES membership_types(membership_type_id) ON DELETE CASCADE,
privilege_id INT NOT NULL REFERENCES privilege(privilege_id) ON DELETE CASCADE
);

CREATE TABLE privilege_usage_log (
log_id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
privilege_id INT NOT NULL REFERENCES privilege(privilege_id) ON DELETE CASCADE,
used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE parking_records (
parking_id SERIAL PRIMARY KEY,
iu_number CHAR(10) REFERENCES membership(iu_number),
in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
out_time TIMESTAMPTZ,
free_parking_claimed BOOL NOT NULL,
amount_due DECIMAL(10,2)
);

CREATE TABLE workshops (
workshop_id SERIAL PRIMARY KEY,
workshop_name VARCHAR(90) NOT NULL,
description TEXT,
date_time TIMESTAMPTZ NOT NULL 
);

CREATE TABLE workshop_registration (
registration_id SERIAL PRIMARY KEY,
workshop_id INT NOT NULL REFERENCES workshops(workshop_id) ON DELETE CASCADE,
user_id INT NOT NULL REFERENCES users(user_id),
registration_date DATE NOT NULL DEFAULT NOW()
);

CREATE TABLE users_backup (
user_id SERIAL PRIMARY KEY,
role_id INT REFERENCES roles(role_id) NOT NULL,
first_name VARCHAR(50) NOT NULL,
last_name  VARCHAR(50) NOT NULL,
email VARCHAR(255) NOT NULL,
phone_number CHAR(8) NOT NULL,
password_hash VARCHAR(255),
date_of_birth DATE
);