const db = require('../database');

//ici on défénit notre classe
class Order {

    /*
    ici on déclare les champs de notre classe 
    il est donc plus facile de comprendre la classe dans son ensemble
    */

    id;
    order_number;
    total_price;
    address_id;
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

        const { rows } = await db.query('SELECT * FROM order;');

        return rows.map(order => new Order(order));
    }

    /*
   Cette méthode de classe permet de retourner un article grâce  à son ID
   via une requête SQL
   */
    static async findOne(id) {
        const { rows } = await db.query('SELECT * FROM order WHERE id = $1;', [id]);
        if (!rows[0]) {
            throw new Error(`l'order avec l'id ${id} n'existe pas`)
        }

        return new Order(rows[0]);
    }


}
module.exports = Order;