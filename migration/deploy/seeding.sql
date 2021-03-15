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
'HTOB0001',
'TSHIRT Oversize ',
'tshirt violet oversize pour homme disponible en plusieurs tailles',
'https://ibb.https://i.ibb.co/84Kfrzv/pexels-nathan-thomas-1.jpg',
'violet',
45,
20,
DEFAULT,
NOW(),
NOW()
),(
'HTPM00001',
'TSHIRT PAC-MAN',
'tshirt jaune fantaisie PAC-MAN pour homme disponible en plusieurs tailles',
'https://i.ibb.co/Rg33M1g/pexels-jonathon-burton-1.jpg',
'jaune',
15,
20,
5,
NOW(),
NOW()
),
(
'HTR00001',
'TSHIRT rayé',
'tshirt rayé bleu et noir pour homme disponible en plusieurs tailles',
'https://i.ibb.co/tCJ2Z1s/jimmy-jimenez-3.jpg',
'Bleu/Noir',
35,
20,
5,
NOW(),
NOW()
),
(
'HTT00001',
'TSHIRT TRUE',
'tshirt blanc de la marque TRUE pour homme disponible en plusieurs tailles',
'https://i.ibb.co/8XJ9N27/pexels-youssef-fatihi-1.jpg',
'blanc',
39,
20,
5,
NOW(),
NOW()
),
(
'HTBYP00001',
'TSHIRT Burn Your Problems',
'tshirt blanc de la marque Burn Your Problems pour homme disponible en plusieurs tailles',
'https://i.ibb.co/80h0Msk/pexels-sebastiaan-stam-1.jpg',
'blanc',
29,
20,
5,
NOW(),
NOW()
),
(
'FTC00001',
'TSHIRT Culprit',
'tshirt gris de la marque Culprit pour femme disponible en plusieurs tailles',
'https://i.ibb.co/WBpGz85/pexels-spencer-selover-1.jpg',
'gris',
34,
20,
5,
NOW(),
NOW()
),
(
'FTMA00001',
'TSHIRT MovieArt',
'tshirt noir de la marque MovieArt pour femme disponible en plusieurs tailles',
'https://i.ibb.co/qNMFwQs/pexels-wilson-vitorino-1.jpg',
'noir',
20,
20,
5,
NOW(),
NOW()
),
(
'FTI00001',
'TSHIRT oversize Introvert',
'tshirt noir de la marque Introvert pour femme disponible en plusieurs tailles',
'https://i.ibb.co/Y3CkJcn/pexels-matheus-potsclam-barro-1.jpg',
'noir',
27,
20,
5,
NOW(),
NOW()
),
(
'FTGV00001',
'TSHIRT oversize Vibes With me',
'tshirt blanc de la marque GoodVibes pour femme disponible en plusieurs tailles',
'https://i.ibb.co/bs33CKz/pexels-artem-beliaikin-1.jpg',
'blanc',
22,
20,
5,
NOW(),
NOW()
),
'FTE00001',
'TSHIRT oversize EPX',
'tshirt gris de la marque EPX pour femme disponible en plusieurs tailles',
'https://i.ibb.co/h92y4xz/pexels-cottonbro-1.jpg',
'gris',
36,
20,
5,
NOW(),
NOW()
),
'HCC00001',
'Converse montante ',
'Paire  de Converse montante de couleur noire homme disponible en plusieurs tailles',
'https://i.ibb.co/q5WhSyK/stephan-schmid-t-Vz-Dw-E78-DH4-unsplash.jpg',
'noire',
85,
20,
5,
NOW(),
NOW()
),
'HCNLV00001',
'Sneackers Nike Edition LV ',
'Paire  de sneackers nike montante édition LV de couleur orange homme disponible en plusieurs tailles',
'https://i.ibb.co/rGpG2zS/pexels-erik-mclean.jpg',
'orange',
149,
20,
5,
NOW(),
NOW()
),
'HCC00001',
'Chaussures Dr Martens ',
'Paire  de chaussures montante de marque Dr Martens de couleur jaunes homme disponible en plusieurs tailles',
'https://i.ibb.co/zF6tnbf/pexels-fotografierende.jpg',
'jaune',
115,
20,
5,
NOW(),
NOW()
),
'HCS00001',
'Chaussures En cuir Scarosso ',
'Paire  de chaussures en cuir montante de marque Scarosso de couleur marron foncé homme disponible en plusieurs tailles',
'https://i.ibb.co/FKbHLcp/pexels-andrew-neel.jpg',
'marron',
235,
20,
5,
NOW(),
NOW()
),
'HCN00002',
'Sneackers Nike 2021',
'Paire  de sneackers montante de marque Nike de couleur jaunes homme disponible en plusieurs tailles',
'https://i.ibb.co/Lx3N19t/pexels-melvin-buezo.jpg',
'Jaune',
95,
20,
5,
NOW(),
NOW()
)
;

INSERT INTO "category" ("title") 
VALUES
('homme'),('femme'),('tshirt'),('chaussures'),('pantalon'),('robe');


INSERT INTO "article_has_category" (
    article_id,category_id
) 
VALUES
(1,1),(1,3),(2,1),(2,3),(3,1),(3,3),(4,1),(4,3),(5,1),(5,3),
(6,2),(6,3),(7,2),(7,3),(8,2),(8,3),(9,2),(9,3),(10,2),(10,3),
(11,1),(1,4),(12,1),(12,4),(13,1),(13,4),(14,1),(14,4),(15,1),(15,4)


INSERT INTO "size" ("size_name") 
VALUES
('unique'),('S'),('M'),('L'),('XL'),('XXL')('36'),('38'),('40'),('42'),('44'),
('36'),('37'),('38'),('39'),('40'),('41'),('42'),('43'),('44')

INSERT INTO "article_has_size" ("article_id","size_id","quantity","created_at","updated_at") 
VALUES
(1,2,20,NOW(),NOW()),(1,3,20,NOW(),NOW()),(1,4,20,NOW(),NOW()),(1,5,20,NOW(),NOW()),(1,6,20,NOW(),NOW()),
(2,2,20,NOW(),NOW()),(2,3,20,NOW(),NOW()),(2,4,20,NOW(),NOW()),(2,5,20,NOW(),NOW()),(2,6,20,NOW(),NOW()),
(3,2,20,NOW(),NOW()),(3,3,20,NOW(),NOW()),(3,4,20,NOW(),NOW()),(3,5,20,NOW(),NOW()),(3,6,20,NOW(),NOW()),
(4,2,20,NOW(),NOW()),(4,3,20,NOW(),NOW()),(4,4,20,NOW(),NOW()),(4,5,20,NOW(),NOW()),(4,6,20,NOW(),NOW()),
(5,2,20,NOW(),NOW()),(5,3,20,NOW(),NOW()),(5,4,20,NOW(),NOW()),(5,5,20,NOW(),NOW()),(5,6,20,NOW(),NOW()),
(6,2,20,NOW(),NOW()),(6,3,20,NOW(),
(7,2,20,NOW(),NOW()),(7,3,20,NOW(),
(8,2,20,NOW(),NOW()),(8,3,20,NOW(),
(9,2,20,NOW(),NOW()),(9,3,20,NOW(),
(10,2,20,NOW(),NOW()),(10,3,20,NOW(),
(11,14,20,NOW(),NOW()),(11,15,20,NOW(),NOW()),(11,16,20,NOW(),NOW()),(11,17,20,NOW(),NOW()),(11,18,20,NOW(),NOW()),
(12,15,20,NOW(),NOW()),(12,16,20,NOW(),NOW()),(12,17,20,NOW(),NOW()),(12,18,20,NOW(),NOW()),(12,19,20,NOW(),NOW()),
(13,17,20,NOW(),NOW()),(17,18,20,NOW(),NOW()),(17,19,20,NOW(),NOW()),
(14,14,20,NOW(),NOW()),(14,15,20,NOW(),NOW()),(14,16,20,NOW(),NOW()),(14,17,20,NOW(),NOW()),
(15,20,20,NOW(),NOW()),(15,18,20,NOW(),NOW()),(15,17,20,NOW(),NOW()),(15,14,20,NOW(),NOW()),(4,6,20,NOW(),NOW())



INSERT INTO "user" (
    email,firstname,lastname,"password",phone_number,"role_id",created_at,updated_at
) 
VALUES 
('jeanD@gmail.com','jean','dupont','czieuze113','0102030403',2,NOW(),NOW()),
('Michel@gmail.com','Michel','dupret','czieurfze897','0102020493',2,NOW(),NOW()),
('Quentin@gmail.com','Quentin','Heron','czie56uze113','0105030413',1,NOW(),NOW());

INSERT INTO "address" (
    country,city,zip_code,"number",street_name,additional,"user_id",created_at,updated_at
)
VALUES 
('France','Marseille',13000, '4B', 'rue de la ligue des champions','3 ème étage',1,NOW(), NOW()),
('France','Nice',06000, '6', 'rue de la Tchetchenie','2 ème étage',2,NOW(), NOW()),
('France','Lille',59000, '2', 'rue de la fenetre en carton','au fond du chemin',2,NOW(), NOW()),
('La Réunion','St Paul',97460, '', 'La digue de la rascasse','la péniche du fond',3,NOW(), NOW());


INSERT INTO "order"
(order_number, total_price, address_id, status_id, created_at, updated_at) 
VALUES
(25676972,'260,00',1,1,NOW(),NOW()),
(2567624,'138',2, 1,NOW(),NOW()),
(25327624,'70',1,2,NOW(),NOW());


INSERT INTO "order_has_article"
(order_id,article_id,size_id,quantity,unit_net_price,created_at,updated_at) 
VALUES
(1,1,2,2,'50',NOW(),NOW()),
(1,12,3,1,'160',NOW(),NOW()),
(2,2,3,3,'20',NOW(),NOW()),
(2,5,4,1,'35',NOW(),NOW()),
(2,3,2,1,'43',NOW(),NOW()),
(3,8,2,2,'35',NOW(),NOW());



COMMIT;
