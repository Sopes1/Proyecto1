const {MongoClient} = require('mongodb');
const uri = "mongodb://sopes1p1-2s2021:2E8TQCpXND5ca8PdKgWfG1uZGQq9LaeIrvKEDtZ0DVc4JJyCkFkfVkO3TurMlIB6TT6BphIiJRksDavsZhoeLw==@sopes1p1-2s2021.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@sopes1p1-2s2021@"
const client = new MongoClient(uri);
async function main() {
    await client.connect();
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        //await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

main().catch(console.error);
module.exports = client;