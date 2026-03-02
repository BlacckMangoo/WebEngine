import pkg from "pg";

const {Pool} = pkg;

const pool = new Pool(
    {
        user: "satvik",
        host: "localhost",
        database: "gameBackend",
        password: "10p241905",
        port: 5432,
    }
)

const res = await pool.query("SELECT NOW()");
console.log(res.rows[0]);