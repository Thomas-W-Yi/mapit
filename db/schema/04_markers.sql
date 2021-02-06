DROP TABLE IF EXISTS markers CASCADE;
CREATE TABLE markers (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  coord_id INTEGER REFERENCES coords(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  img_url VARCHAR(2083)
);