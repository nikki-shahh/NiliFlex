const express = require('express'),
    morgan =require ('morgan'),
    bodyParser = require('body-parser'),
    uuid = require ('uuid')

const mongoose = require('mongoose');
const Models = require('./models/models.js');

mongoose.connect('mongodb://localhost:27017/niliflex', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb+srv://niliflex:passw0rd@cluster0.og8jo.mongodb.net/moviedb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const Movies = Models.Movie;
const Users = Models.User;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');

app.use(express.static('public'));
app.use(morgan('common'));



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

app.get('/users' , passport.authenticate('jwt',{session: false}),(req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

//Allow new users to register

app.post('/users' ,(req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users.create({
              Username: req.body.Username,
              Password: req.body.Password,
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
app.put('/users/:Username', passport.authenticate('jwt',{session: false}) , (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
    { 
      $set:{
      Username: req.body.Username,
      Password: req.body.Password,
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

app.listen(8087, () => {
    console.log('Your app is listening on port 8087.');
  });
