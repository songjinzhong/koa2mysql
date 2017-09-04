var mysql = require('mysql')

const DBconfig = {
  host: '192.168.31.208',
  user: 'root',
  password: '111111',
  port: '3306',
  database: 'iot'
}

let connection
function connect () {
  connection = mysql.createConnection(DBconfig)
}
function end () {
  connection.end(function (err) {
    if (err) {
      console.log(err)
    }
    connection = null
  })
}
function excuteQuery (query) {
  return new Promise((resolve, reject) => {
    connect()
    connection.query(query, (err, rows) => {
      if (err) {
        console.log(err)
        reject(err)
        return null
      }
      resolve(rows)
    })
    end()
  })
}
const sql = {
  selectDate: () => {
    const query = 'select distinct timer from speed'
    return excuteQuery(query)
  },
  selectOnce: (timer) => {
    const query = `select * from speed where timer = '${timer}'`
    return excuteQuery(query)
  }
}
module.exports = sql
