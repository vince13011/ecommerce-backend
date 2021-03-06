-- Revert switch:update_function from pg

BEGIN;

DROP FUNCTION update_address(json, int),
              update_article(json, int),
              update_category(json, int),
              update_order(json, int),
              update_size(json, int),
              update_user(json, int);

COMMIT;
