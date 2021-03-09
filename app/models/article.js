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
    static async findOne(id) {
        const results= await db.query( `SELECT 
       article.id,
       article.name,
       article.reference,
       article.color,
       article.description,
       category.title as category,
       size_name as size,
       article_has_size.stock,
       article.pre_tax_price,
       article.vat_rate,
       article.discount
       FROM "article"
       LEFT JOIN "article_has_category" ON "article_has_category"."article_id" = "article"."id"
       LEFT JOIN "category" ON "category"."id" = "article_has_category"."category_id"
       LEFT JOIN "article_has_size" ON "article_has_size"."article_id" = "article"."id"
       LEFT JOIN "size" ON "size"."id" = "article_has_size"."size_id"
       WHERE article.id=$1
       `
       
       ,[id])
       
        const dataResults=results.rows
        const data=[]

        for (const result of dataResults) {
            const category = result.category
            const size ={size_name:result.size,stock:result.stock}
            delete result.size;
            delete result.stock;
            delete result.category;
            const dataFound = data.find(elem => elem.id === result.id);
            if(!dataFound){
                result.categories=[category]
                result.sizes=[size]
                data.push(result)
            } else{
              
             const categoryfound= dataFound.categories.find(e=> e=== category)
              if(!categoryfound){
                dataFound.categories.push(category)
              }
              const sizeFound=dataFound.sizes.find(e=>e.size_name===size.size_name)
              if(!sizeFound){
                dataFound.sizes.push(size)
              }
          }
          
        }
        
        return data
       
       
    }

    static async findAll(limit = null) {
       const results= await db.query( `SELECT 
       article.id,
       article.name,
       article.reference,
       article.color,
       article.description,
       category.title as category,
       size_name as size,
       article_has_size.stock,
       article.pre_tax_price,
       article.vat_rate,
       article.discount,
       article.updated_at
       FROM "article"
       LEFT JOIN "article_has_category" ON "article_has_category"."article_id" = "article"."id"
       LEFT JOIN "category" ON "category"."id" = "article_has_category"."category_id"
       LEFT JOIN "article_has_size" ON "article_has_size"."article_id" = "article"."id"
       LEFT JOIN "size" ON "size"."id" = "article_has_size"."size_id"
       ORDER BY article.updated_at DESC
       LIMIT $1`,[limit])
        const dataResults=results.rows
        const data=[]

        for (const result of dataResults) {
            const category = result.category
            const size ={size_name:result.size,stock:result.stock}
            delete result.size;
            delete result.stock;
            delete result.category;
            const dataFound = data.find(elem => elem.id === result.id);
            if(!dataFound){
                result.categories=[category]
                result.sizes=[size]
                data.push(result)
            } else{
              
             const categoryfound= dataFound.categories.find(e=> e=== category)
              if(!categoryfound){
                dataFound.categories.push(category)
              }
              const sizeFound=dataFound.sizes.find(e=>e.size_name===size.size_name)
              if(!sizeFound){
                dataFound.sizes.push(size)
              }
          }
          
        }
        
        return data
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