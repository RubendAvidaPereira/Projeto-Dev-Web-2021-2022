(async () => {
    const database = require('./db');
    const db = require('./models/models');
 
    try {
        const resultado = await database.sync();
        console.log("Connected to the database...");
    } catch (error) {
        console.log(error);
    }
})();