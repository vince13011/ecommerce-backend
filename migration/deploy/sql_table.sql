-- Deploy switch:sql_table to pg

BEGIN;

-- un domaine qui n'autorise que les valeurs positives
CREATE DOMAIN posint AS int CHECK (value > 0);


CREATE TABLE category (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" text NOT NULL
);

CREATE TABLE article (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reference text NOT NULL,
   "name" text NOT NULL,
   "description" text NOT NULL,
   "image" text NOT NULL,
   color text DEFAULT NULL,
   pre_tax_price posint NOT NULL,
   vat_rate posint NOT NULL,
   discount int DEFAULT NULL,
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE size (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "size_name" text NOT NULL
);

CREATE TABLE "role" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL
);

CREATE TABLE "user" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email text NOT NULL,
    firstname text NOT NULL,
    lastname text NOT NULL,
    "password" text NOT NULL,
    phone_number text NOT NULL,
    "role_id" INTEGER NOT NULL REFERENCES "role"("id"),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()  
);
CREATE TABLE "address" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    country text NOT NULL DEFAULT 'France',
    city text NOT NULL,
    zip_code posint NOT NULL,
    "number" text NOT NULL,
    street_name text NOT NULL,
    additional text ,
    "user_id" INTEGER NOT NULL REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE TABLE "order" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_number posint UNIQUE NOT NULL,
    total_price text NOT NULL,
    "address_id" INTEGER NOT NULL REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_has_article (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id posint NOT NULL REFERENCES "order"(id),
    article_id posint REFERENCES article(id) ON DELETE SET NULL,
    quantity posint NOT NULL DEFAULT 1,
    unit_net_price text NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE TABLE article_has_size (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_id posint NOT NULL REFERENCES article(id) ON DELETE CASCADE ON UPDATE CASCADE,
    size_id posint NOT NULL REFERENCES size(id) ON DELETE CASCADE ON UPDATE CASCADE,
    stock int DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE article_has_category (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_id posint NOT NULL REFERENCES article(id) ON DELETE CASCADE ON UPDATE CASCADE,
    category_id int NOT NULL REFERENCES category(id) ON UPDATE CASCADE
);



COMMIT;
