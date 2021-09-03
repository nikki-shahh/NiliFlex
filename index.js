const express = require('express'),
    morgan =require ('morgan'),
    bodyParser = require('body-parser')

const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models/models.js');

//mongoose.connect('mongodb://localhost:27017/niliflex', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb+srv://niliflex:passw0rd@cluster0.og8jo.mongodb.net/moviedb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Movies = Models.Movie;
const Users = Models.User;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');

let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');

app.use(express.static('public'));
app.use(morgan('common'));
app.use(cors());


app.get('/', (req, res)=>{
    res.send('Welcome to NiliFlex');
});

//Return a list of ALL movies to the user
app.get('/movies', passport.authenticate('jwt',{session: false}) , (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return data about a single movie by title to the user
app.get ('/movies/:Title', passport.authenticate('jwt',{session: false}) ,(req, res) => {
    Movies.findOne ({Title: req.params.Title})
      .then ((movie) =>{
        res.json(movie);
      })
      .catch((err) =>{
        console.error (err);
        res.status(500).send ("error: "+ err);
      });
});

//Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/genres/:Name', passport.authenticate('jwt',{session: false}) , (req, res) => {
  Movies.findOne({'Genre.Name': req.params.Name})
    .then((movie) => {
      res.json(movie.Genre);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

//Return data about a director by name
app.get ('/directors/:Name', passport.authenticate('jwt',{session: false}) ,(req, res) => {
  Movies.findOne ({ 'Director.Name' : req.params.Name})
    .then ((movie) => {
      res.json(movie.Director);
    })
    .catch ((err) =>{
      console.error (err);
      res.status(500).send ("Error: "+ err);
    });
});

//Return all users

//app.get('/users' , passport.authenticate('jwt',{session: false}),(req, res) => {
    //Users.find()
      //.then((users) => {
       // res.status(201).json(users);
      //})
      //.catch((err) => {
       // console.error(err);
        //res.status(500).send('Error: ' + err);
     // });
  //});

//Allow new users to register

app.post('/users' ,  
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword (req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users.create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
            .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//Allow users to update their user info
app.put('/users/:Username' ,
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
]
,passport.authenticate('jwt',{session: false}) ,(req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, 
    { 
      $set:{
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
//Allow users to add a movie to their list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt',{session: false}) ,(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Allow users to remove a movie from their list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt',{session: false}) ,(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Allow existing users to deregister
app.delete('/users/:Username', passport.authenticate('jwt',{session: false}) ,(req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } 
      else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0',() => {
   console.log('Listening on Port ' + port);
  });
