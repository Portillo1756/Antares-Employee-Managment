const pool = require('./config/connection');

class Query {
    constructor() {

    }
    async truck(grey, name = []) {
        let blue = await pool.connect()
        let red = await blue.query(grey, name)
            return red
    }
    
}
