const db = require('../database');

//ici on défénit notre classe
class Address {

    /*
    ici on déclare les champs de notre classe 
    il est donc plus facile de comprendre la classe dans son ensemble
    */

    id;
    country;
    city;
    zip_code;
    number;
    street_name;
    additional;
    user_id;
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

        const { rows } = await db.query('SELECT * FROM address;');

        return rows.map(address => new Address(address));
    }

    /*
   Cette méthode de classe permet de retourner un article grâce  à son ID
   via une requête SQL
   */
    static async findOne(id) {
        const { rows } = await db.query('SELECT * FROM address WHERE id = $1;', [id]);
        if (!rows[0]) {
            throw new Error(`l'address avec l'id ${id} n'existe pas`)
        }

        return new Address(rows[0]);
    }

    async insert() {

        const { rows } = await db.query(`INSERT INTO "address" (
            country,
            city,
            zip_code,
            number,
            street_name,
            additional,
            user_id
    )
    VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING*;`,
            [this.country, this.city, this.zip_code, this.number,
            this.street_name, this.additional, this.user_id]);

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

        const { rows } = await db.query(`SELECT * FROM update_address($1,$2);`, [data, this.id]);
        if (rows[0].id === null) {
            throw new Error(`l'address avec l'id  ${this.id} n'existe pas `)
        }

        return new Address(rows[0]);
    }


}
module.exports = Address;