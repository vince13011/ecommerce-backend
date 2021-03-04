-- Deploy switch:seeding to pg

BEGIN;

INSERT INTO article (
    reference,
   "name",
   "description",
   "image",
   color,
   pre_tax_price,
   vat_rate,
   discount,
   created_at,
   updated_at
) VALUES (
1234,
'TSHIRT nike',
'tshirt nike bleu homme',
'c:/repertoire/image/b',
'noir',
30,
20,
DEFAULT,
NOW(),
NOW()
),(
1234,
'TSHIRT KIABI',
'tshirt KIABI blanc homme',
'c:/repertoire/image/c',
DEFAULT,
20,
20,
5,
NOW(),
NOW()
);
COMMIT;
