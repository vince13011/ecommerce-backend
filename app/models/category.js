const db = require('../database');

//ici on défénit notre classe
class Category {

    /*
    ici on déclare les champs de notre classe 
    il est donc plus facile de comprendre la classe dans son ensemble
    */

    id;
    name;

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

        const { rows } = await db.query('SELECT * FROM category;');

        return rows.map(category => new Category(category));
    }

    /*
   Cette méthode de classe permet de retourner un article grâce à son ID
   via une requête SQL
   */
    static async findOne(id) {
        const { rows } = await db.query('SELECT * FROM category WHERE id = $1;', [id]);
        if (!rows[0]) {
            throw new Error(`la categorie avec l'id ${id} n'existe pas `)
        }

        return new Category(rows[0]);
    }

    async insert() {
        const { rows } = await db.query(`INSERT INTO "category" (name) VALUES($1) RETURNING*;`, [this.name]);
        this.id = rows[0].id;
    }


}
module.exports = Category;