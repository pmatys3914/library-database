let mysql = require('mysql');
let data = require('./mysqlData');

let connection = mysql.createConnection(data);

connection.connect(function(err) {
    if(err) {
        throw err;
    }
    else
    {
        console.log("Connection to Database successful.")
    }

    // Check if the database has all required tables. If not, create them in place of existing ones.
    let testsql = "SELECT * FROM information_schema.tables WHERE table_schema = 'sql11469736' AND (table_name = 'Books' OR table_name = 'Authors')";
    let reqtables = 2;
    connection.query(testsql, function(err, rows) {
        if(err)
        {
            console.log("Failed to verify database.");
            throw err;
        }
        else
        {
            if(rows.length == reqtables)
            {
                console.log("Database verified.");
            }
            else
            {
                console.log("Building database.");
                // Drop all the conflicting tables if they exists
                let dropsql = "DROP TABLE IF EXISTS Authors, Books";
                connection.query(dropsql, function(err) {
                    if(err)
                    {
                        throw err;
                    }
                    // Cretate new tables
                    // Authors
                    let authorssql =`
                    CREATE TABLE Authors (
                        AuthorID int NOT NULL,
                        Name varchar(255) NOT NULL,
                        YearBorn int NOT NULL,
                        PRIMARY KEY(AuthorID)
                    )`;
                    connection.query(authorssql, function(err) {
                        if(err) throw err;
                    });
                    // Books
                    let bookssql = `
                    CREATE TABLE Books (
                        BookID int NOT NULL,
                        Title varchar(255) NOT NULL,
                        AuthorID int NOT NULL,
                        Year int NOT NULL,
                        Copies int NOT NULL,
                        CheckedOut int NOT NULL,
                        PRIMARY KEY (BookID),
                        FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID)
                    )`;
                    connection.query(bookssql, function(err) {
                        if(err) throw err;
                    });
                })
            }
        }
    });
});

module.exports = {
    connection : connection
}