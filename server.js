
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

const connectionString = 'mongodb+srv://aralimata:9526cb3867.@cluster0.z96kawl.mongodb.net/?retryWrites=true&w=majority';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('earthquake-search-db')
    const locationsCollection = db.collection('locations-history')

    console.log("entré");

    // ========================
    // Middlewares
    // ========================
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    // ========================
    // Routes
    // ========================
    app.get('/location-history', (req, res) => {
      db.collection('locations-history').find().toArray()
        .then(quotes => {
          console.log(quotes);
          //res.render('index.ejs', { quotes: quotes })
          res.send(quotes)
        })
        .catch(/* ... */)
    })

    app.post('/location', (req, res) => {
      locationsCollection.insertOne(req.body)
        .then(result => {
          console.log(result.data)
        })
        .catch(error => console.error(error))
    })

    app.post('/chiapas', (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      quotesCollection.insertOne(req.body)
        .then(result => {
          console.log("insertado")
        })
        .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Deleted Darth Vadar\'s quote')
        })
        .catch(error => console.error(error))
    })

    // ========================
    // Listen
    // ========================
    const isProduction = process.env.NODE_ENV === 'production'
    const port = isProduction ? 7500 : 3000
    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)