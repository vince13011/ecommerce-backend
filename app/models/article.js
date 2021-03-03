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
    update_at;

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

     /*
    Cette méthode de classe permet de retourner un article grâce  à son ID
    via une requête SQL
    */
   static async findOne(id) {
    const { rows } = await db.query('SELECT * FROM article WHERE id = $1;', [id]);
    if (!rows[0]){
       throw new Error(`le jeu avec l'id ${id} n'existe pas `)
    }

    return new Article(rows[0]);
}

    
}
module.exports=Article;