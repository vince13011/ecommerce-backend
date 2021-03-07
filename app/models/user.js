const db = require('../database');

//ici on défénit notre classe
class User {

    /*
    ici on déclare les champs de notre classe 
    il est donc plus facile de comprendre la classe dans son ensemble
    */

    id;
    email;
    firstname;
    lastname;
    password;
    phone_number;
    role_id;
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

        const { rows } = await db.query('SELECT * FROM "user";');

        return rows.map(user => new User(user));
    }

    /*
   Cette méthode de classe permet de retourner un article grâce  à son ID
   via une requête SQL
   */
    static async findOne(id) {
        const { rows } = await db.query(`SELECT * FROM "user"
                                        JOIN "address" on "user".id = user_id
                                         WHERE "user".id =$1;`, [id]);
        if (!rows[0]) {
            throw new Error(`le user avec l'id ${id} n'existe pas`)
        }

        return rows.map(user => new User(user)); 
       }
    
       static async findByEmail(email) {
        const { rows } = await db.query(`SELECT * FROM "user"
                                         WHERE "user".email =$1;`, [email]);
        console.log(rows[0])
        if (rows[0]=== undefined) {
           return null
        }

        return rows.map(user => new User(user)); 
       }   

    async insert() {

        const { rows } = await db.query(`INSERT INTO "user" (
        "email",
        "firstname",
        "lastname",
        "password",
        "phone_number",
        "role_id"
    )
    VALUES($1,$2,$3,$4,$5,$6) RETURNING*;`,
            [this.email, this.firstname, this.lastname, this.password,
            this.phone_number, this.role_id]);

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

        const { rows } = await db.query(`SELECT * FROM update_user($1,$2);`, [data, this.id]);
        if (rows[0].id === null) {
            throw new Error(`l'user avec l'id  ${this.id} n'existe pas `)
        }

        return new User(rows[0]);
    }

    async deleteById() {
        const { rows } = await db.query(`DELETE FROM "user" WHERE id = $1`, [this.id]);
    }

}
module.exports = User;