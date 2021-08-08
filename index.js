const express = require('express'),
    morgan =require ('morgan'),
    bodyParser = require('body-parser'),
    uuid = require ('uuid');

const app = express();

app.use(morgan('common'));
app.use(express.static("public"));
app.use(bodyParser.json());

let movies = [
    //1
    {
        title: 'Cinema Paradiso',
        description:"A filmmaker recalls his childhood when falling in love with the pictures at the cinema of his home village and forms a deep friendship with the cinema's projectionist." ,
        genre: {
            name:'romance',
            description: "A genre that explores the complex side of love",
        },
        director:{
            name: 'Giuseppe Tornatore',
            bio: "An Italian film director and screenwriter. He is considered one of the directors who brought critical acclaim back.",
            born: "05.27.1956",
            died:'-',
        },
        imgUrl: 'https://m.media-amazon.com/images/M/MV5BNDMwNDk3NDQ0Nl5BMl5BanBnXkFtZTcwNjEwMjI2MQ@@._V1_UX100_CR0,0,100,100_AL_.jpg',
    } ,
    //2
    {
        title: 'Pulp Fiction',
        description:"The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption." ,
        genre: {
            name:'drama, crime',
            description:"A sub-genre of drama that focuses on crimes, the criminals that commit them and the police that catch them",
        },
        director:{
            name: 'Quentin Tarantino',
            bio: "An American film director, screenwriter, producer, author, film critic, and actor.",
            born: "03.27.1963",
            died:'-',
        },
        imgUrl: 'https://m.media-amazon.com/images/M/MV5BMTU2Mjc0MTg4MF5BMl5BanBnXkFtZTcwOTA0MzU5Ng@@._V1_UX100_CR0,0,100,100_AL_.jpg',
    } ,
    //3
    {
        title: 'Eternal Sunshine of the Spotless Mind',
        description:"When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories." ,
        genre: {
            name:'drama, romance, sci-fi',
            description:"A film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science",
        },
        director:{
            name: 'Michel Gondry',
            bio: "A French film director, screenwriter, and producer noted for his inventive visual style and distinctive manipulation of mise en scène.",
            born: "05.08.1963",
            died:'-',
        },
        imgUrl: 'https://m.media-amazon.com/images/M/MV5BZTg3ODg2MzMtZmRmYy00ZWUwLTk5Y2QtOThmOTY1ZWZjZmJlXkEyXkFqcGdeQXVyODIyOTEyMzY@._V1_UX100_CR0,0,100,100_AL_.jpg',
    } ,
    //4
    {
        title: 'Scarface',
        description:"In 1980 Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed." ,
        genre: {
            name:'crime, drama',
            description:"A sub-genre of drama that focuses on crimes, the criminals that commit them and the police that catch them",
        },
        director:{
            name: 'Brian De Palma',
            bio: "An American film director and screenwriter. With a career spanning over 50 years, he is best known for his work in the suspense, crime and psychological thriller genres.",
            born: "09.11.1940",
            died:'-',
        },
        imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcRDPyznR3qB1xKjYQaTQMUTpfUYQQDia3t_RZGtaVJlJWzaJ4',
    } ,
    //5
    {
        title: 'Interstellar',
        description:"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." ,
        genre: {
            name:'adventure, drama, sci-fi',
            description:"A film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science",
        },
        director:{
            name: 'Christopher Nolan',
            bio: "A British-American film director, producer, and screenwriter. His directorial efforts have grossed more than US$5 billion worldwide, garnered 36 Oscar nominations and 11 wins.",
            born: "07.30.1970",
            died:'-',
        },
        imgUrl: 'https://m.media-amazon.com/images/M/MV5BMTc0MjI0NzI0MV5BMl5BanBnXkFtZTgwMjIyODgxMzE@._V1_UY100_CR25,0,100,100_AL_.jpg',
    } 
];
    
let users = [
    {
        id:'1',
        username: "Nikki",
        password: "password",
        email: "nikki@gmail.com",
        birthday: "02.27.1987"
    },
    {
        id:'2',
        username: "Helena",
        password: "password",
        email: "Helena@gmail.com",
        birthday: "04.07.1986"
    },
    {
        id:'3',
        username: "Zoey",
        password: "password",
        email: "Zoey@gmail.com",
        birthday: "06.23.1965"
    },
];


app.get('/', (req, res)=>{
    res.send('Welcome to NiliFlex');
});

//Return a list of ALL movies to the user
app.get ('/movies', (req, res)=>{
    res.json (movies);
});

//Return data about a single movie by title to the user
app.get ('/movies/:title', (req, res) => {
    res.json (movies.find((movie) => 
    { return movie.title === req.params.title
    }));
});

//Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get ('/movies/genre/:name', (req, res) => {
    res.json (movies.find((movie) =>{
        return movie.genre.name === req.params.name;
    }));
});

//Return data about a director by name
app.get('/movies/director/:name', (req, res) =>{
    res.json (movies.find((movie) =>{
        return movie.director.name === req.params.name;
    }));
});
//Return all users
app.get('/users', (req, res) => {
    res.json(users);
  });

//Allow new users to register

app.post('/users', (req, res) =>{
    let newUser = req.body;
    
    if(!newUser.username) {
        const message = 'You must specify a username!'
        res.status(400). send (message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201). send (newUser);
    }
});

//Allow users to update their user info
app.put('/users/:username', (req, res) =>{
    let user = users.find((user) => {
        return user.username === req.params.username
    });
    if (user) {
        user.username = req.params.username;
        res.status(201) . send ('User with Username ' + req.params.username+ ' has been successfully updated !');
    } else {
        res.status(404). send ('User with Username ' + req.params.username+ ' was not found !');
    }
});

//Allow users to add a movie to their list of favorites
app.put('/users/movies/:favorites', (req, res) => {
	let favorite = movies.find((movie) => 
	    res.status(201) . send('Movie has been added to your favorites.'));
});

//Allow users to remove a movie from their list of favorites
app.delete('/users/movies/:favorites', (req, res) => {
	let favorite = movies.find((movie) => 
	    res.status(201) . send('Movie has been removed from your favorites.'));
});

//Allow existing users to deregister
app.delete('/users/:id', (req, res) => {
    let user= users.find((user) => { return user.id === req.params.id
    });
    if (user) {
        users = users.filter ((obj) => { 
            return obj.id !== req.params.id
        });
      res.status(201).send('User with ID '+ req.params.id+ ' has been succesfully deleted.');
    } else {
      res.status(400).send('There is no user with ID '+req.params.id);
    }
  });


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8087, () => {
    console.log('Your app is listening on port 8087.');
  });
