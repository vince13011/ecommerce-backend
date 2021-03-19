# Projet e-commerce

## API - SWITCH
Dans ce projet j'ai créé une API REST qui sert à gérer tout ses jeux de société en base de données.  
Il a pour but de montrer une partie de mes compétences en javaScript côté Back end ainsi que la diversité des outils que je peux utiliser

## Stack

- Node js 10+
  - Express
- PostgreSQL 11+
- Cors
- JWT Token
- Sanitizer
- Bcrypt
- Sqitch (migration)

## Pour utiliser l'API
 - Clonner le projet  
 - installer sur sa machine Node.js, PostgreSQL et sqitch.  
 https://nodejs.org/fr/download/  
 https://www.postgresql.org/download/  
 https://sqitch.org/download/      
 - créer un fichier .env en se basant sur le fichier .env.example  
 - créer une base de donnée PostgreSQL switch
   
 ### Ensuite lancer les commandes suivantes dans sa CLI:  
 - npm i  
 - sqitch deploy db:pg:switch 
 - node index.js
 
 Vous pouvez maintenant utiliser l'API.  
 Si vous possedez l'extension Rest client de VSC  vous pouvez également utiliser le fichier table.http pour essayer les routes.
 Merci d'avoir consulté ce projet et n'hésitez pas à m'envoyer vos critiques et conseils afin que je puisse améliorer mes compétences.
 

