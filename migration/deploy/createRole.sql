-- Deploy switch:createRole to pg

BEGIN;
 INSERT INTO "role"
 ("name")
 VALUES
 ('admin'),('user');

COMMIT;
