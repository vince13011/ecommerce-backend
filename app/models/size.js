const db = require('../database');

//ici on défénit notre classe
class Size {

    /*
    ici on déclare les champs de notre classe 
    il est donc plus facile de comprendre la classe dans son ensemble
    */
    id;
    size_name;

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

        const { rows } = await db.query('SELECT * FROM size;');

        return rows.map(size => new Size(size));
    }

    /*
   Cette méthode de classe permet de retourner un article grâce à son ID
   via une requête SQL
   */
    static async findOne(id) {
        const { rows } = await db.query('SELECT * FROM size WHERE id = $1;', [id]);
        if (!rows[0]) {
            throw new Error(`la size avec l'id ${id} n'existe pas `)
        }

        return new Size(rows[0]);
    }

    async insert() {
        const { rows } = await db.query(`INSERT INTO "size" (size_name) VALUES($1) RETURNING*;`, [this.size_name]);
        this.id = rows[0].id;
    }

    /** 
   * Fonction non statique car propre à chaque instance
   * Elle permet de modifier un jeu de société  dans notre base de donnée
   * this correspond au contexte qui est utilisé
   * dans notre cas il correspond aux données de notre jeu de société avant modification
   * @param {json} data - Objet json venant modifier les données existantes
   */
    async updateById(data) {

        const { rows } = await db.query(`SELECT * FROM update_size($1,$2);`, [data, this.id]);
        if (rows[0].id === null) {
            throw new Error(`la size avec l'id ${this.id} n'existe pas`)
        }

        return new Size(rows[0]);
    }

    async deleteById() {
        const { rows } = await db.query(`DELETE FROM "size"
                                    WHERE id = $1`, [this.id]);
    }

}
module.exports = Size;