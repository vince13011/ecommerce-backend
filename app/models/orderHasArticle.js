const db = require('../database');


class OrderHasArticle {

    id;
    order_id;
    article_id;
    quantity;
    unit_net_price;
    created_at;
    updated_at;

    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    static async findAll() {
        const { rows } = await db.query('SELECT * FROM "order_has_article";');
        return rows.map(orderHasArticle => new OrderHasArticle(orderHasArticle));
    }

    // get all articles from a particular order
    static async findAllInOrder(id) {
        const { rows } = await db.query(`SELECT * FROM (SELECT * FROM "article" 
                                        JOIN "order_has_article" 
                                        ON article.id = order_has_article.article_id 
                                        WHERE order_has_article.order_id = $1) AS 
                                        "order_articles" JOIN "order" ON "order".id = order_articles.order_id;`, [id]);
        if (!rows[0]) {
            throw new Error(`les orderHasArticle avec l'id ${id} n'existent pas`)
        }
        return rows.map(orderHasArticle => new OrderHasArticle(orderHasArticle));
    }

    // create an association between size and article
    async insert() {
        const { rows } = await db.query(`INSERT INTO "order_has_article" 
            (order_id, article_id, quantity,unit_net_price) VALUES($1,$2,$3,$4) RETURNING*;`,
            [this.order_id, this.article_id, this.quantity, this.unit_net_price]);

        this.id = rows[0].id;
    }

}

module.exports = OrderHasArticle;