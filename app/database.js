const { Pool } = require('pg');

// db est un pool de connecteurs de base de données
// avec Heroku, mon Pool va devoir se connecter à DATABASE_URL
// par contre, en local, il faut qu'il continue de se connecter avec les variables d'environnement de libpq (PGUSER, PGPASSWORD etc.)
// mais en fait, Pool se débrouille tout seul comme un grand
const db = new Pool({
    connectionString: "postgres://pwokrspjqplmgy:c9faa05c76be24b9cbb3bb866cfda93b3148da836175eb254f0a8c0f62defa63@ec2-52-209-134-160.eu-west-1.compute.amazonaws.com:5432/d8ohpsu04as0bb"
});

// maintenant, on n'a plus un seul connecteur mais un pool de connecteurs
module.exports = db;