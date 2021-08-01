const express = require('express'),
    morgan =require ('morgan');

const app = express();

let topTenMovies = [
    //1
    {
        title: 'Cinema Paradiso'
    } ,
    //2
    {
        title: 'Pulp Fiction'
    } ,
    //3
    {
        title: 'Eternal Sunshine of the Spotless Mind'
    } ,
    //4
    {
        title: 'Scarface'
    } ,
    //5
    {
        title: 'Interstellar'
    } ,
    //6
    {
        title: 'Twelve Angry Men'
    } ,
    //7
    {
        title: 'The Prestige'
    } , 
    //8
    {
        title: 'The Piano'
    } , 
    //9
    {
        title: 'The Revenant'
    } ,
    //10
    {
        title: 'Apocalypto'
    }
];
    
app.use(morgan('common'));
app.use(express.static('public/documentation.html'));


app.get('/', (req, res)=>{
    res.send('Welcome to NiliFlex');
});

app.get('/movies', (req, res)=>{
    res.json(topTenMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8087, () => {
    console.log('Your app is listening on port 8087.');
  });
