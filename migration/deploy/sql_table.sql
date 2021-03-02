-- Deploy switch:sql_table to pg

BEGIN;

-- un domaine qui n'autorise que les valeurs positives
CREATE DOMAIN posint AS int CHECK (value > 0);


CREATE TABLE category (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL
);

CREATE TABLE article (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reference text NOT NULL,
   "name" text NOT NULL,
   description
);

CREATE TABLE size (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    min_age posint NOT NULL,
    min_players posint NOT NULL,
    max_players posint,
    "type" text NOT NULL, 
    note posint NOT NULL,
    duration interval NOT NULL,
    creator text NOT NULL 
);

CREATE TABLE order (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    min_age posint NOT NULL,
    min_players posint NOT NULL,
    max_players posint,
    "type" text NOT NULL, 
    note posint NOT NULL,
    duration interval NOT NULL,
    creator text NOT NULL 
);

CREATE TABLE 'address' (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    min_age posint NOT NULL,
    min_players posint NOT NULL,
    max_players posint,
    "type" text NOT NULL, 
    note posint NOT NULL,
    duration interval NOT NULL,
    creator text NOT NULL 
);

CREATE TABLE user (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    min_age posint NOT NULL,
    min_players posint NOT NULL,
    max_players posint,
    "type" text NOT NULL, 
    note posint NOT NULL,
    duration interval NOT NULL,
    creator text NOT NULL 
);

CREATE TABLE 'role' (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    min_age posint NOT NULL,
    min_players posint NOT NULL,
    max_players posint,
    "type" text NOT NULL, 
    note posint NOT NULL,
    duration interval NOT NULL,
    creator text NOT NULL 
);

CREATE TABLE order_has_article (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    min_age posint NOT NULL,
    min_players posint NOT NULL,
    max_players posint,
    "type" text NOT NULL, 
    note posint NOT NULL,
    duration interval NOT NULL,
    creator text NOT NULL 
);
CREATE TABLE article_has_size (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    min_age posint NOT NULL,
    min_players posint NOT NULL,
    max_players posint,
    "type" text NOT NULL, 
    note posint NOT NULL,
    duration interval NOT NULL,
    creator text NOT NULL 
);
CREATE TABLE article_has_category (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    min_age posint NOT NULL,
    min_players posint NOT NULL,
    max_players posint,
    "type" text NOT NULL, 
    note posint NOT NULL,
    duration interval NOT NULL,
    creator text NOT NULL 
);



COMMIT;
