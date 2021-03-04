
BEGIN;

CREATE  FUNCTION update_article ( art json, bid int) RETURNS article  AS $$

    UPDATE article
        SET reference = art ->>'reference',
            "name" = art ->>'name', 
            "description" = art ->>'description',
            "image" = art ->>'image',
            color = art ->>'color',
            pre_tax_price = (art ->>'pre_tax_price')::posint,
            vat_rate = (art ->>'vat_rate')::posint,
            discount = (art ->>'discount')::posint,                          
            created_at = (art ->>'created_at')::TIMESTAMPTZ,
            updated_at = (art ->>'updated_at')::TIMESTAMPTZ
         WHERE id = bid RETURNING *;

$$ LANGUAGE sql ;

CREATE  FUNCTION update_category ( cat json, bid int) RETURNS category  AS $$

    UPDATE category
        SET "name" = cat ->>'name'
        WHERE id = bid RETURNING *;
$$ LANGUAGE sql ;

CREATE  FUNCTION update_user ( us json, bid int) RETURNS "user"  AS $$

    UPDATE "user"
        SET email = us ->>'email',
            firstname = us ->>'firstname', 
            lastname = us ->>'lastname',
            "password" = us ->>'password',
            phone_number = (us ->>'phone_number')::posint,
            role_id = (us ->>'role_id')::posint,                          
            created_at = (us ->>'created_at')::TIMESTAMPTZ,
            updated_at = (us ->>'updated_at')::TIMESTAMPTZ
        WHERE id = bid RETURNING *;

$$ LANGUAGE sql ;

CREATE  FUNCTION update_order ( ord json, bid int) RETURNS "order"  AS $$

    UPDATE "order"
        SET order_number = (ord ->>'order_number')::posint,
            total_price = (ord ->>'total_price')::posint,
            address_id = (ord ->>'address_id')::posint,                          
            created_at = (ord ->>'created_at')::TIMESTAMPTZ,
            updated_at = (ord ->>'updated_at')::TIMESTAMPTZ
        WHERE id = bid RETURNING *;

$$ LANGUAGE sql ;

CREATE  FUNCTION update_size ( siz json, bid int) RETURNS size  AS $$

    UPDATE "size"
        SET "name" = siz ->>'name'
        WHERE id = bid RETURNING *;
$$ LANGUAGE sql ;

CREATE  FUNCTION update_address ( addr json, bid int) RETURNS address  AS $$

    UPDATE "address"
        SET country = addr ->>'order_number',
            city = addr ->>'city',
            zip_code = (addr ->>'zip_code')::posint,   
            "number" = addr ->> 'number',
            street_name = addr ->> 'street_name',
            additional = addr ->> 'additional',                       
            created_at = (addr ->>'created_at')::TIMESTAMPTZ,
            updated_at = (addr ->>'updated_at')::TIMESTAMPTZ
        WHERE id = bid RETURNING *;

$$ LANGUAGE sql ;

COMMIT;

