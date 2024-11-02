const express = require('express') // Importe le module express
const app = express() // Crée une instance d'express
const mongoose = require('mongoose') // Importe mongoose
const { Schema } = mongoose
var bodyParser = require('body-parser'); // Permet de récupérer des données présentent dans le body

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Bienvenu(e) dans mon projet de rendu pour le module NoSQL / mongoDB de troisième année')
})

// CREER UN MODEL TACHE

const Tache = mongoose.model('Tache', {
    name: String,
    date: Date,
    description: String,
    etat: String,
    user: [{ type: Schema.Types.ObjectId, ref: 'User'}]
})

// CREER UN MODEL USER

const User = mongoose.model('User', {
  name: String,
  surname: String,
  tache: [{type: Schema.Types.ObjectId, ref: 'Tache'}]
})

//  CREATION D UNE TACHE A LA MANO

//  const doc = new Tache({
//      name: "Faire le projet NoSQL, mongoDB",
//      date: 25/10/2024,
//      description: "Finir le projet donné pour le module NoSQL/ mongoDB avant le 02/01/2024",
//      etat: "En cours",
//  })
// doc.save()

//  CREATION D UNE TACHE DEPUIS LE BODY

app.post('/taches', async (req, res) =>{
  const newTache = await Tache.create(req.body)
  res.send(newTache)
})

//  CREATION D UN USER DEPUIS LE BODY

app.post('/users', async (req, res) =>{
  const newUser = await User.create(req.body)
  res.send(newUser)
})

// AFFICHAGE DE LA LISTE DES TACHES

app.get('/taches', async (req, res) =>{
    const taches = await Tache.find()
    res.send(taches)
})

// AFFICHAGE DE LA LISTE DES USERS

app.get('/users', async (req, res) =>{
  const users = await User.find()
  res.send(users)
})

// AFFICHAGE D UNE TACHE GRACE A L ID PASSEE EN PARAMS

app.get('/taches/:id', async (req, res) =>{
  const tache = await Tache.findById(req.params.id)
  res.send(tache)
})

// AFFICHAGE D UN USER GRACE A L ID PASSEE EN PARAMS

app.get('/users/:id', async (req, res) =>{
  const user = await User.findById(req.params.id)
  res.send(user)
})

// AFFICHAGE D UN USER GRACE AU NAME PASSE EN PARAMS

app.get('/user/by-name/:name', async (req, res) =>{
  const user = await User.find({name: req.params.name})
  res.send(user)
})

// SUPPRESSION D UNE TACHE GRACE A L ID PASSEE EN PARAMS

app.delete('/taches/:id', async (req, res) =>{
  // JE VERIFIE QUE L'ID PASSEE EN PARAM EST BIEN RECEPTIONNEE
  //    res.send(req.params.id)
  const del = await Tache.findByIdAndDelete(req.params.id)
  const taches = await Tache.find()
  console.log('1 élément a été supprimé')
  res.send(taches)
})

// SUPPRESSION D UN USER GRACE A L ID PASSEE EN PARAMS

app.delete('/users/:id', async (req, res) =>{
  const del = await User.findByIdAndDelete(req.params.id)
  const users = await User.find()
  console.log('1 élément a été supprimé')
  res.send(users)
})

// SUPPRESSION D UN USER GRACE AU NAME PASSE EN PARAMS

app.delete('/users/by-name/:name', async (req, res) =>{
  const del = await User.findOneAndDelete({name: req.params.name})
  const users = await User.find()
  console.log('1 élément a été supprimé')
  res.send(users)
})

// MODIFICATION D UNE TACHE

app.put('/taches/:id', async (req, res) =>{
    const modif = await Tache.findOneAndUpdate({_id: req.params.id}, req.body)
    res.send(modif)
})

// MODIFICATION D UN USER

app.put('/users/modifier/:id', async (req, res) =>{
  const modif = await User.findOneAndUpdate({_id: req.params.id}, req.body)
  res.send(modif)
})

// FILTRER LES TACHES PAR ETAT

app.get('/taches/filter-by-etat/:etat', async (req, res) =>{
  const taches = await Tache.find()
  const filtered = taches.filter((tache) => tache.etat === req.params.etat)
  res.send(filtered)
})

// FILTRER LES TACHES PAR DATE

app.get('/taches/filter-by-date/:date', async (req, res) =>{
  const filtered = await Tache.find({date: new Date(req.params.date)})
  res.send(filtered)
})

// TENTATIVE DE SORT BY DATE

// app.get('/taches/filter-between-dates/:date1&:date2', async (req, res) =>{
//   const filtered = Tache.find({date: { $gte: new Date(req.params.date1), $lte: new Date(req.params.date2)}})
//   res.send(filtered)
//   console.log(req.params)
// })

// ASSIGNER UNE TACHE A UN USER

app.put('/users/assigner-tache/:nameuser&:idtache', async (req, res) =>{
  const user = await User.findOne({name: req.params.nameuser})
  var tache = await Tache.findByIdAndUpdate(req.params.idtache, {user: user._id})
  const upuser = await User.findOneAndUpdate({name: req.params.nameuser}, {tache: tache._id})
  const pop = await upuser.populate('tache')
  res.send(pop)
})

// VOIR LES TACHES ASSIGNEES A UN USER

app.get('/users/taches/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  res.send(user.tache)
})
// Je start le serveur sur le port 3000
async function start() {
    try {
      await mongoose.connect('mongodb://localhost:27017/mon-projet')
      console.log('✅ Connected to MongoDB')
  
      app.listen(3000, () => console.log('✅ Server started on port 3000'))
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }
  
  start()