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


    // récupérer LA CATEGORY => TOUS LES ARTICLES
    static async findAllInCategory(id) {
        const { rows } = await db.query(`SELECT * FROM (SELECT * FROM "article" 
                                        JOIN "article_has_category" 
                                        ON article.id = article_has_category.article_id 
                                        WHERE article_has_category.category_id = $1 
                                        ORDER BY updated_at ASC) AS "category_articles" 
                                        JOIN category ON category.id = category_articles.category_id
                                        ;`, [id]);
        if (!rows[0]) {
            throw new Error(`les categories avec l'id ${id} n'existent pas`)
        }
        return rows.map(articleHasCategory => new ArticleHasCategory(articleHasCategory));
    }

    // récupérer LA CATEGORY => Un numbre limité d'article en fonction de la query string
    static async findInCategorySelection(id, limit) {
        const { rows } = await db.query(`SELECT * FROM (SELECT * FROM "article" 
                                        JOIN "article_has_category" 
                                        ON article.id = article_has_category.article_id 
                                        WHERE article_has_category.category_id = $1 
                                        ORDER BY updated_at ASC) AS "category_articles" 
                                        JOIN category ON category.id = category_articles.category_id
                                        LIMIT $2;`, [id, limit]);
        if (!rows[0]) {
            throw new Error(`les categories avec l'id ${id} n'existent pas`)
        }
        return rows.map(articleHasCategory => new ArticleHasCategory(articleHasCategory));
    }
    // create an association between category and article
    async insert(id) {
        const { rows } = await db.query(`INSERT INTO "article_has_category" 
            (article_id, category_id) VALUES($1,$2) RETURNING*;`,
            [id, this.category_id]);
        this.id = rows[0].id;
    }

}

module.exports = ArticleHasCategory;