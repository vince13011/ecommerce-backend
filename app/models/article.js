const db = require('../database');

//ici on défénit notre classe
class Article {

    /*
    ici on déclare les champs de notre classe 
    il est donc plus facile de comprendre la classe dans son ensemble
    */

    id;
    reference;
    name;
    description;
    image;
    color;
    pre_tax_price;
    vat_rate;
    discount;
    created_at;
    updated_at;


    /**
     * le constructor est la méthode qui s'éxecute lors d'une nouvelle instance de notre classe 
    exemple:
    const newGame = new Boardgame(data);
    * @constructor
    * @param {Object} data - objet Json
    */
    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    /* 
    Cette méthode de classe permet de retourner l'ensemble des jeux de société
    via une requête SQL
    */
    static async findOne(id) {

        const article = await db.query(
            `
                SELECT "id", "reference", "name", "description", "image", "color", "pre_tax_price", "vat_rate", "discount", "updated_at" 
                    FROM "article" WHERE id = $1;
            `, [id]
        );
        const categorie = await db.query(
            `
                SELECT category.id ,"title" 
                    FROM article_has_category AS article_has_category 
                        JOIN category AS category 
                        ON article_has_category.category_id = category.id 
                            WHERE article_has_category.article_id = $1;
            `, [id]
        );
        const size = await db.query(
            `
                SELECT size.id, size.size_name, article_size.stock 
                    FROM size AS size 
                    JOIN 
                    (SELECT * 
                        FROM article AS article 
                            JOIN article_has_size AS article_has_size 
                            ON article_has_size.article_id = article.id 
                                WHERE article.id = $1) AS "article_size" 
                                    ON size.id = article_size.size_id;
            `, [id]
        );
        // pour sort by updated_at
        let string = article.rows[0].updated_at;
        // j'enlève tous ce qui n'est pas chiffre
        string = string.toString().replace(/[^\d]/g, '');
        // updated_at transformé en string
        article.rows[0].updated_at = string;
        article.rows[0].categories = categorie.rows;
        article.rows[0].sizes = size.rows;
        return article.rows[0];
    }

    static async findAll(limit = null) {

        let articlesId = await db.query(`SELECT id FROM "article"`);
        articlesId = articlesId.rows;
        let rows = [];
        for (let index = 0; index < articlesId.length; index++) {
            const { id } = articlesId[index];
            const article = await this.findOne(id);
            rows.push(article);
        }
        if (limit === null) limit = rows.length;
        // pour la limit splice : prendre de 0 à limit éléments
        rows = rows.splice(0, limit);
        // on sort du plus petit au plus grand
        rows = rows.sort((a, b) => { return Number(a.updated_at) - Number(b.updated_at) });
        // on INVERSE le sorte du plus grand au plus petit
        rows = rows.reverse();
        return rows.map(article => new Article(article));
    }


    /** 
    * Fonction non statique car propre à chaque instance
    * Elle permet de modifier un jeu de société  dans notre base de donnée
    * this correspond au contexte qui est utilisé
    * dans notre cas il correspond aux données de notre jeu de société avant modification
    * @param {json} data - Objet json venant modifier les données existantes
    */
    static async updateById(data, id) {
        const { rows } = await db.query(
            `
                UPDATE "article" 
                    SET "reference"=$1, 
                        "name"=$2, 
                        "description"=$3,
                        "image"=$4,
                        "color"=$5,
                        "pre_tax_price"=$6,
                        "vat_rate"=$7,
                        "discount"=$8
                    WHERE id=$9;
            `, [data.reference, data.name, data.description, data.image, data.color, data.pre_tax_price, data.vat_rate, data.discount, id]);
        if (id === null) {
            throw new Error(`l'article avec l'id  ${id} n'existe pas `)
        }
        const result = await Article.findOne(id);
        console.log(await Article.findOne(id));
        return result;
    }

    async insert() {
        const { rows } = await db.query(`INSERT INTO "article" (
        reference,
        name,
        description,
        image,
        color,
        pre_tax_price,
        vat_rate,
        discount
    )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING*;`,
            [this.reference, this.name, this.description, this.image,
            this.color, this.pre_tax_price, this.vat_rate, this.discount]);

        this.id = rows[0].id;
    }

    static async delete(id) {
        const { rows } = await db.query(`DELETE FROM "article" WHERE id = $1`, [id]);
    }

}
module.exports = Article;