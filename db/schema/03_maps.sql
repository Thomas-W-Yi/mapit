DROP TABLE IF EXISTS maps CASCADE;
CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  coord_id INTEGER REFERENCES coords(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL
);
