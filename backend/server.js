const express=require("express");
const app=express();
let morgan = require('morgan');
const mongoose = require('mongoose').default;
mongoose.set('strictQuery', true);
mongoose.set('debug', true);

const config=require('./config/config')
const pokemon=require('./schema/pokemon');
const user=require('./schema/user');
const battle=require('./schema/battle');
const bodyParser = require("express");



let init = async () => {

    try {
        await mongoose.connect(config.pool, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('Connected to MongoDB');
        }).catch((err) => {
            console.error('Problem connecting to MongoDB', err);
        });

        initServer();
    } catch (e) {
        console.log(e)
        console.error('Problem connecting to database');
    }


};

let initServer = () => {

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static(__dirname+'/public'));

    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST,DELETE,PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
        next();
    });

    app.use(morgan('dev'));
    let authRouter= require('./app/auth-router')(express,user);
    app.use('/auth',authRouter);
    let pokemonRouter = require('./app/pokemon-router')(express,pokemon,config,battle);
    app.use('/pokemon', pokemonRouter);
    let battleRouter = require('./app/battle-router')(express,battle);
    app.use('/battle', battleRouter);
    let userRouter= require('./app/user-router')(express,user);
    app.use('/auth/login',userRouter);
    let registerRouter= require('./app/register-router')(express,user);
    app.use('/auth/register',registerRouter);



    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    });


    app.listen(config.port);

    console.log('Running on port ' + config.port);
};

init()
