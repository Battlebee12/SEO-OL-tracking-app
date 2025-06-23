CREATE TABLE Shifts (
  id SERIAL PRIMARY KEY,
  ol_name VARCHAR(255) NOT NULL,
  ol_student_id INT NOT NULL,
  sign_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sign_out_time TIMESTAMP,
  rsd TEXT
  group_no INT,
);