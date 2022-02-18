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
    let reqtables = ["Books", "Authors", "BookInstances", "Users", "Checkouts"];
    let testsql = "SELECT * FROM information_schema.tables WHERE table_schema = 'library' AND (";
    reqtables.forEach(e => testsql += ( "table_name = '" + e + "' OR "));
    testsql = testsql.slice(0, -3);
    testsql += ")";

    connection.query(testsql, function(err, rows) {
        if(err)
        {
            console.log("Failed to verify database.");
            throw err;
        }
        else
        {
            if(rows.length == reqtables.length)
            {
                console.log("Database verified.");
            }
            else
            {
                console.log("Building database.");
                // Drop all the conflicting tables if they exists
                let dropsql = "DROP TABLE IF EXISTS ";
                reqtables.forEach(e => dropsql += e + ", ");
                dropsql = dropsql.slice(0, -2);
                connection.query(dropsql, function(err) {
                    if(err)
                    {
                        throw err;
                    }
                    // Cretate new tables
                    // Authors
                    let authorssql =`
                    CREATE TABLE Authors (
                        AuthorID int NOT NULL AUTO_INCREMENT,
                        Name varchar(256) NOT NULL,
                        YearBorn year NOT NULL,
                        PRIMARY KEY(AuthorID)
                    )`;
                    connection.query(authorssql, function(err) {
                        if(err) throw err;
                    });

                    // Books
                    let bookssql = `
                    CREATE TABLE Books (
                        BookID int NOT NULL AUTO_INCREMENT,
                        Title varchar(256) NOT NULL,
                        AuthorID int NOT NULL,
                        Year int NOT NULL,
                        PRIMARY KEY (BookID),
                        FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID)
                    )`;
                    connection.query(bookssql, function(err) {
                        if(err) throw err;
                    });

                    // Book Instances
                    let bookinstancessql = `
                    CREATE TABLE BookInstances (
                        BookInstanceID int NOT NULL AUTO_INCREMENT,
                        BookID int NOT NULL,
                        CheckedOut bool NOT NULL,
                        AcquisitionTimestamp timestamp NOT NULL,
                        PRIMARY KEY (BookInstanceID),
                        FOREIGN KEY (BookID) REFERENCES Books(BookID)
                    )`;
                    connection.query(bookinstancessql, function(err) {
                        if(err) throw err;
                    });

                    // Users
                    let userssql = `
                    CREATE TABLE Users (
                        UserID int NOT NULL AUTO_INCREMENT,
                        Name varchar(256) NOT NULL,
                        RegisterDate timestamp NOT NULL,
                        PRIMARY KEY (UserID)
                    )`;
                    connection.query(userssql, function(err) {
                        if(err) throw err;
                    });

                    // Checkouts
                    let checkoutssql = `
                    CREATE TABLE Checkouts (
                        CheckoutID int NOT NULL AUTO_INCREMENT,
                        UserID int NOT NULL,
                        BookINstanceID int NOT NULL,
                        CheckoutTimestamp timestamp NOT NULL,
                        DeadlineTimestamp timestamp NOT NULL,
                        PRIMARY KEY (CheckoutID),
                        FOREIGN KEY (UserID) REFERENCES Users(UserID),
                        FOREIGN KEY (BookInstanceID) REFERENCES BookInstances(BookInstanceID)
                    )`;
                    connection.query(checkoutssql, function(err) {
                        if(err) throw err;
                    })
                })
            }
        }
    });
});

module.exports = {
    connection: connection
}