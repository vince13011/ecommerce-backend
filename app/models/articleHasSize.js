const db = require('../database');


class ArticleHasSize {

    id;
    article_id;
    size_id;
    stock;
    create_at;
    update_at;

    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    static async findAll() {
        const { rows } = await db.query('SELECT * FROM "article_has_size";');
        return rows.map(articleHasSize => new ArticleHasSize(articleHasSize));
    }

    // get all articles from a particular size
    static async findAllInSize(id) {
        const { rows } = await db.query(`SELECT * FROM (SELECT * FROM "article" 
                                        JOIN "article_has_size" 
                                        ON article.id = article_has_size.article_id 
                                        WHERE article_has_size.size_id = $1) AS 
                                        "size_articles" JOIN size ON size.id = size_articles.size_id;`, [id]);
        if (!rows[0]) {
            throw new Error(`les sizes avec l'id ${id} n'existent pas`)
        }
        return rows.map(articleHasSize => new ArticleHasSize(articleHasSize));
    }

    // create an association between size and article
    async insert(id) {
        const { rows } = await db.query(`INSERT INTO "article_has_size" 
            (article_id, size_id, stock) VALUES($1,$2,$3) RETURNING*;`,
            [id, this.size_id, this.stock]);

        this.id = rows[0].id;
    }

}

module.exports = ArticleHasSize;