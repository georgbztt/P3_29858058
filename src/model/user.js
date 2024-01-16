const db = require('../database/conection');
module.exports = {
    create(data) {
        const { name, email, password } = data;
        return new Promise((suc, rej) => {
            db.serialize(function () {
                try {
                    const stmt = db.prepare("INSERT INTO usuarios (name, email, password,is_admin) VALUES (?,?,?,false)");
                    stmt.run(name, email, password);
                    stmt.finalize();
                    suc(data);
                } catch (error) {
                    rej(error)
                }
            });
        })
    },
    login(data) {
        const { email, password } = data;
        console.log({data});
        return new Promise((suc, rej) => {
            db.all(`SELECT * from usuarios where email ='${email}' and password='${password}'`, function (err, rows) {
                if (err) {
                    console.log(err)
                    rej(err.message)
                } else {
                    suc(rows[0])
                }
            });

        })
    },
}