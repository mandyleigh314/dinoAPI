const express = require('express')
const bodyParser = require('body-parser')
const pgPromise = require('pg-promise')()

const app = express()

const database = pgPromise({ database: 'dinoDB' })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/api/dinosaurs', (req, res) => {
  database.any('SELECT * FROM "dinosaurs"').then(dinosaurs => {
    res.json(dinosaurs)
  })
})

app.get('/api/dinosaurs/:id', (req, res) => {
  const dinoId = req.params.id
  const getOneDino = database.one('SELECT * FROM "dinosaurs" WHERE id = $1', [dinoId]).then(getOneDino => {
    res.json(getOneDino)
  })
})

app.get('/api/dinosaurs/:id/habitats', (req, res) => {
  const dinoId = req.params.id
  const habDino = database.one('SELECT name, habitat FROM "dinosaurs" WHERE id = $1', [dinoId]).then(habDino => {
    res.json(habDino)
  })
})

app.post('/api/dinosaurs', (req, res) => {
  let newDino = {
    name: req.body.name,
    color: req.body.color,
    size: req.body.size,
    habitat: req.body.habitat
  }
  database
    .none(
      'INSERT INTO "dinosaurs" (name, color, size, habitat) VALUES ($(name), $(color), $(size), $(habitat))',
      newDino
    )
    .then(newDino => {
      res.json(newDino)
    })
})

app.put('/api/dinosaurs/:id', (req, res) => {
  const dinoId = req.params.id

  database
    .none(
      'UPDATE "dinosaurs" SET name = $(name), color = $(color), size = $(size), habitat = $(habitat) WHERE id = $(id)',
      {
        name: req.body.name,
        color: req.body.color,
        size: req.body.size,
        habitat: req.body.habitat,
        id: dinoId
      }
    )
    .then(dinoEdit => {
      res.json(dinoEdit)
    })
})

app.delete('/api/dinosaurs/:id', (req, res) => {
  const dinoId = req.params.id

  database.none('DELETE FROM "dinosaurs" WHERE id = $(id)', { id: dinoId }).then(dinoDelete => {
    res.json(dinoDelete)
  })
})

app.listen(3000, () => {
  console.log('Dinosaurs from the year 3000bc')
})
