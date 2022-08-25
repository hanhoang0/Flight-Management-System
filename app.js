//cmd line: npm run start

const express = require('express');
const app = express();
const cors = require('cors');
const { engine } = require('express-handlebars')
const pool = require('./creds');

// handlebars middleware
app.set('view engine', 'hbs');
app.engine('hbs', engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'main'
}));

// body parser middleware
app.use(cors());
app.use(express.json());      //req.body
app.use(express.urlencoded({ extended : false}))

// Set static folder
//app.use(express.static('views'));

//ROUTES
app.get('/', (req,res) => res.render('home'))

app.use('/flight', require('./server/routes/flight'))
app.use('/boarding', require('./server/routes/boarding'))
app.use('/airplane', require('./server/routes/airplane'))


// set up the server listening at port 3000
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
  console.log(`Server has started on port ${port}`);
});