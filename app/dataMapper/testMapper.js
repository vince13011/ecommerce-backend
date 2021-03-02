const db = require('../database');

testMapper = {

findone: async (id) => {
            const { rows } = await db.query('SELECT * FROM boardgame WHERE id = $1;', [id]);
            if (!rows[0]){
               throw new Error(`le jeu avec l'id ${id} n'existe pas `)
            }
    
            return new Boardgame(rows[0]);
        },
autreMethode: " "
    
    }
module.exports=testMapper;