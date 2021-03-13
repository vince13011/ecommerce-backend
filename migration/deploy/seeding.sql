-- Deploy switch:seeding to pg

BEGIN;

INSERT INTO "role"
 ("name")
 VALUES
 ('admin'),('user');

 INSERT INTO "status"
 ("status_name")
 VALUES
 ('pending'),('cancelled'),('confirmed'),('sent'),('delivered'),('returned');

INSERT INTO article (
    reference,"name","description","image",color,
    pre_tax_price,vat_rate,discount,created_at,updated_at
)
 VALUES (
1234,
'TSHIRT nike',
'tshirt nike bleu homme',
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6az5sB1UO7yc_W9a3t8tmNmlwaH_W-rh0C0WsmoRLUnGyQ9Sv6iyx72TstxY-GJKGsszKjnE&usqp=CAc',
'noir',
45,
20,
DEFAULT,
NOW(),
NOW()
),(
123432,
'TSHIRT KIABI',
'tshirt KIABI blanc homme',
'https://img.ltwebstatic.com/images2_pi/2019/06/04/1559631949293247477_thumbnail_900x1199.webp',
'blanc',
15,
20,
5,
NOW(),
NOW()
),
(
124334,
'Pantalon de costume hugo bogoss',
'pantalon noir  homme',
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwmBeNIIBuTfhuk5i6qoeZHV5hN95_oNX6cgIQ5RD12luso20Hg21TIIBhOv5rOpTUjEC5MynT&usqp=CAc',
DEFAULT,
35,
20,
5,
NOW(),
NOW()
),
(
123234878,
'Airmax',
'basket airmax',
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdWirhWig8kqdOHrCXLO3_LyiX6fYJSD5of28HEb5JA32FpI289tUca46347yPLfKQ46wQZH8&usqp=CAc',
'blanche',
100,
20,
5,
NOW(),
NOW()
),
(1234978,
'Jean levis',
'Jean bleu slim homme levis',
'data:image/jpeg;base64,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',
'bleu',
140,
20,
5,
NOW(),
NOW()
)
;

INSERT INTO "user" (
    email,firstname,lastname,"password",phone_number,"role_id",created_at,updated_at
) 
VALUES 
('jeanD@gmail.com','jean','dupont','czieuze113','0102030403',2,NOW(),NOW()),
('Michel@gmail.com','Michel','dupret','czieurfze897','0102020493',2,NOW(),NOW()),
('bigboss@gmail.com','vincent','giglio','czie56uze113','0105030413',1,NOW(),NOW());

INSERT INTO "address" (
    country,city,zip_code,"number",street_name,additional,"user_id",created_at,updated_at
)
VALUES 
('France','Marseille',13000, '4B', 'rue de la ligue des champions','3 ème étage',1,NOW(), NOW()),
('France','Nice',06000, '6', 'rue de la Tchetchenie','2 ème étage',2,NOW(), NOW()),
('France','Lille',59000, '2', 'rue de la fenetre en carton','au fond du chemin',2,NOW(), NOW()),
('La Réunion','St Paul',97460, '', 'La digue de la rascasse','la péniche du fond',3,NOW(), NOW());

INSERT INTO "category" ("title") 
VALUES
('homme'),('femme'),('tshirt'),('chaussures'),('pantalon');

INSERT INTO "size" ("size_name") 
VALUES
('unique'),('S'),('M'),('L'),('XL'),('36'),('38'),('40'),('42'),('44');

INSERT INTO "order"
(order_number, total_price, address_id, status_id, created_at, updated_at) 
VALUES
(25676972,'39,00',1,1,NOW(),NOW()),
(2567624,'249,40',1, 1,NOW(),NOW()),
(25327624,'100,25',1,2,NOW(),NOW()),
(267624,'29,00',3,3,NOW(),NOW()),
(250987625,'73,50',2,4,NOW(),NOW()),
(256237624,'21,30',1,5,NOW(),NOW()),
(256767628,'32,10',1,5,NOW(),NOW()),
(25090691,'43,40',2,6,NOW(),NOW());


INSERT INTO "order_has_article"
(order_id,article_id,size_id,quantity,unit_net_price,created_at,updated_at) 
VALUES
(1,1,1,2,'17,50',NOW(),NOW()),
(1,2,2,4,'62',NOW(),NOW()),
(3,1,2,2,'17,50',NOW(),NOW()),
(4,4,1,2,'43,50',NOW(),NOW()),
(4,3,3,2,'12,00',NOW(),NOW()),
(4,1,4,4,'45,50',NOW(),NOW()),
(5,4,1,2,'35,10',NOW(),NOW()),
(6,1,3,4,'17,50',NOW(),NOW()),
(7,3,2,2,'67,00',NOW(),NOW()),
(8,2,1,2,'17,50',NOW(),NOW());

INSERT INTO "article_has_size"
(article_id,size_id,stock,created_at,updated_at) 
VALUES
(1,1,20,NOW(),NOW()),
(2,2,20,NOW(),NOW()),
(2,3,20,NOW(),NOW()),
(2,3,20,NOW(),NOW()),
(3,4,12,NOW(),NOW()),
(4,4,30,NOW(),NOW()),
(4,5,20,NOW(),NOW());

INSERT INTO "article_has_category"
(article_id,category_id) 
VALUES
(1,1),
(1,3),
(2,1),
(2,3),
(3,1),
(3,5),
(4,1),
(4,4);

COMMIT;
