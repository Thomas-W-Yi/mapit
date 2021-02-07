DROP TABLE IF EXISTS markers CASCADE;
CREATE TABLE markers (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  latitude Decimal(8,6) NOT NULL,
  longitude Decimal(9,6) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  img_url VARCHAR(2083)
);
