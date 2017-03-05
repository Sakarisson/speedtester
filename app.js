require('dotenv').config()
const mysql = require('mysql')
const speedTest = require('speedtest-net')

function checkSpeed(callback) {
  const test = speedTest({
    maxTime: 60000, // 1 minute
    serverId: 462   // Faroese Telecom server
  })

  test.on('downloadprogress', (progress) => {
    console.log('Download progress:', progress)
  })

  test.on('uploadprogress', (progress) => {
    console.log('Upload progress:', progress)
  })

  test.on('data', (data) => {
    console.dir(data)
  })

  test.on('error', (err) => {
    console.error(err)
  })
}

function connectToDatabase(callback) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  })

  connection.connect((err) => {
    if(err) {
      callback(err)
      return
    }
    callback(null, connection)
  })
}

connectToDatabase((err, connection) => {
  if(err) {
    console.error(err)
    return
  }
  connection.query(`SELECT * FROM measurements;`, (err, result) => {
    if(err) {
      console.error(err)
      return
    }
    console.log(result)
  })
})