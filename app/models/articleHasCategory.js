const db = require('../database');


class ArticleHasCategory {

    id;
    article_id;
    category_id;

    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    static async findAll() {
        const { rows } = await db.query('SELECT * FROM "article_has_category";');
        return rows.map(articleHasCategory => new ArticleHasCategory(articleHasCategory));
    }

    // get all articles from a particular category
    static async findAllInCategory(id) {
        const { rows } = await db.query('SELECT * FROM "article_has_category" WHERE category_id = $1;', [id]);
        if (!rows[0]) {
            throw new Error(`les categories avec l'id ${id} n'existent pas`)
        }
        return rows.map(articleHasCategory => new ArticleHasCategory(articleHasCategory));
    }

    // create an association between category and article
    async insert() {
        const { rows } = await db.query(`INSERT INTO "article_has_category" 
            (article_id, category_id) VALUES($1,$2) RETURNING*;`,
            [this.article_id, this.category_id]);

        this.id = rows[0].id;
    }

}

module.exports = ArticleHasCategory;