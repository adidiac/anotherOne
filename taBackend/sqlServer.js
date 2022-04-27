//ionut si student123456@
const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "ionut", // update me
      password: "student123456@" // update me
    },
    type: "default"
  },
  server: "tema3craciun.database.windows.net", // update me
  options: {
    database: "tema3", //update me
    encrypt: true
  }
};

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected");
  }
});

connection.connect();   

function insertIntoDatabase(Nume,Adresa,Timestamp,Rezultat)
{
    const request = new Request(
        `INSERT INTO [dbo].[Date] ([Nume],[Adresa],[Timestamp],[Rezultat]) VALUES ('${Nume}','${Adresa}','${Timestamp}','${Rezultat}')`,
        (err, rowCount) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`${rowCount} row(s) inserted`);
            }
        }
    );
    connection.execSql(request);
}

function selectAllData(res)
{
    let values=[];
    //return all data from database
    const request = new Request(
        `SELECT * FROM [dbo].[Date]`,
        (err, rowCount) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`${rowCount} row(s) selected`);
                //return 
                res.send(values);
            }
        }
    );

    connection.execSql(request);

    request.on("row", columns => {
        const data = columns.reduce((data, column) => {
            data[column.metadata.colName] = column.value;
            return data;
        }, {});
        values.push(data);
    });
}

module.exports = {
    insertIntoDatabase,
    selectAllData };