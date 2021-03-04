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
    static async findAll() {

        const { rows } = await db.query('SELECT * FROM article;');

        return rows.map(article => new Article(article));
    }

    //retourne un nombre limité d'article selon l'information envoyé dans la query string
    static async findSelection(limit) {

        const { rows } = await db.query(`SELECT * FROM article LIMIT ${limit};`);

        return rows.map(article => new Article(article));
    }
    /*
   Cette méthode de classe permet de retourner un article grâce  à son ID
   via une requête SQL
   */
    static async findOne(id) {
        const { rows } = await db.query('SELECT * FROM article WHERE id = $1;', [id]);
        if (!rows[0]) {
            throw new Error(`l'article avec l'id ${id} n'existe pas `)
        }

        return new Article(rows[0]);
    }

    /** 
   * Fonction non statique car propre à chaque instance
   * Elle permet de modifier un jeu de société  dans notre base de donnée
   * this correspond au contexte qui est utilisé
   * dans notre cas il correspond aux données de notre jeu de société avant modification
   * @param {json} data - Objet json venant modifier les données existantes
   */
    async updateById(data) {

        const { rows } = await db.query(`SELECT * FROM update_article($1,$2);`, [data, this.id]);
        if (rows[0].id === null) {
            throw new Error(`l'article avec l'id  ${this.id} n'existe pas `)
        }

        return new Article(rows[0]);
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

    async deleteById() {

        const { rows } = await db.query(`DELETE FROM article
                                    WHERE id = $1`, [this.id]);
    }

}
module.exports = Article;