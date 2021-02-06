DROP TABLE IF EXISTS coords CASCADE;
CREATE TABLE coords (
  id SERIAL PRIMARY KEY NOT NULL,
  latitude Decimal(8,6) NOT NULL,
  longitude Decimal(9,6) NOT NULL
);
