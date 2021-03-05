-- Deploy switch:seeding to pg

BEGIN;

 INSERT INTO "role"
 ("name")
 VALUES
 ('admin'),('user');

INSERT INTO article (
    reference,"name","description","image",color,
    pre_tax_price,vat_rate,discount,created_at,updated_at
)
 VALUES (
1234,
'TSHIRT nike',
'tshirt nike bleu homme',
'c:/repertoire/image/b',
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
'c:/repertoire/image/c',
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
'c:/repertoire/image/c',
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
'c:/repertoire/image/c',
'noire',
100,
20,
5,
NOW(),
NOW()
);

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

INSERT INTO "category" ("name") 
VALUES
('homme'),('femme'),('tshirt'),('chaussures'),('pantalon');

INSERT INTO "size" ("name") 
VALUES
('unique'),('S'),('M'),('L'),('XL'),('36'),('38'),('40'),('42'),('44');

INSERT INTO "order"
(order_number,total_price,address_id,created_at,updated_at) 
VALUES
(25676972,'39,00',1,NOW(),NOW()),
(2567624,'249,40',1,NOW(),NOW()),
(25327624,'100,25',1,NOW(),NOW()),
(267624,'29,00',3,NOW(),NOW()),
(250987625,'73,50',2,NOW(),NOW()),
(256237624,'21,30',1,NOW(),NOW()),
(256767628,'32,10',1,NOW(),NOW()),
(25090691,'43,40',2,NOW(),NOW());


INSERT INTO "order_has_article"
(order_id,article_id,quantity,unit_net_price,created_at,updated_at) 
VALUES
(1,1,2,'17,50',NOW(),NOW()),
(1,2,4,'62',NOW(),NOW()),
(3,1,2,'17,50',NOW(),NOW()),
(4,4,2,'43,50',NOW(),NOW()),
(4,3,2,'12,00',NOW(),NOW()),
(4,1,4,'45,50',NOW(),NOW()),
(5,4,2,'35,10',NOW(),NOW()),
(6,1,4,'17,50',NOW(),NOW()),
(7,3,2,'67,00',NOW(),NOW()),
(8,2,2,'17,50',NOW(),NOW());

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
