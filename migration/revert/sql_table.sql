-- Revert switch:sql_table from pg

BEGIN;

DROP TABLE category, article, size, "order", "address","status", "user", "role", order_has_article, article_has_size, article_has_category;
DROP DOMAIN posint;
COMMIT;
