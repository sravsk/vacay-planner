const express = require('express');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const bcrypt = require('bcrypt-nodejs');
const path = require('path');

const db = require('../database');
const tm = require('../helpers/tm');
const yelp = require('../helpers/yelp');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: 'thisthingissupersecretandunguessable', // should be a large unguessable string
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  cookie: {
    // path: '/api', // cookie will only be sent to requests under '/api'
    maxAge: 60 * 60 * 1000, // duration of the cookie in milliseconds, defaults to duration above
    ephemeral: false, // when true, cookie expires when the browser closes
    httpOnly: false, // when true, cookie is not accessible from javascript
    secure: false
  }
}));

const homePath = __dirname + '/../client/dist';
app.use(express.static(homePath));

app.use('/media', express.static(__dirname + '/../client/media'));

app.use('/foodandevents', express.static(homePath));
app.use('/login', express.static(homePath));
app.use('/signup', express.static(homePath));

/////////////////////////////////////////////////////////////////////
//              These functions are to setup Test Data             //
/////////////////////////////////////////////////////////////////////

app.get('/filltestdata', (req, res) => {
  db.createDummyData();
  res.status(200).end('Created Data')
})

app.get('/cleardb', (req, res) => {
  db.clearTables();
  res.status(200).end('Tables clear, but still exist')
})

app.get('/dropdb', (req, res) => {
  db.dropTables();
  res.status(200).end('Tables deleted, restart server to recreate')
})

app.get('/createdb', (req, res) => {
  db.createDB();
  res.status(200).end('Tables created')
})

/////////////////////////////////////////////////////////////////////
//                            End                                  //
/////////////////////////////////////////////////////////////////////


// Get events from Ticketmaster API
app.get('/events', (req, res) => {

  let startDate = new Date(req.query.startDate).toISOString().split('.')[0]+'Z';
  let endDate = new Date(req.query.endDate).toISOString().split('.')[0]+'Z';
  let location = req.query.location.split(', ')
  let city = location[location.length - 3];
  let stateCode = location[location.length - 2];

  let options = {
    city: city,
    startDate: startDate,
    endDate: endDate,
    stateCode: stateCode,
    size: 30
  };

  tm(options, (data) => res.status(200).end(JSON.stringify(data)));

});

// Get restaurants from Yelp API
app.get('/restaurants/:location', (req, res) => {
  yelp.getRestaurants(req.params.location, data => {
    parsedData = JSON.parse(data);
    res.status(200).send((parsedData));
  }, req.params.location)
});

// Get saved trips from database for a registered user
app.get('/trips', (req, res) => {
  if (req.session.user !== null) {
    db.getUserTrips({email: req.session.user}, (obj) => res.status(200).end(JSON.stringify(obj)))
  } else {
    console.log('must be logged in to get trips')
  }
});

app.get('/trips/:id', (req, res) => {
  db.getTripItems(req.params.id, (obj) => res.status(200).end(JSON.stringify(obj)));
});

app.post('/trips', (req, res) => {
  if (req.session.user){
    db.newTrip(req.session.user, req.body)
    res.status(200).end('successfully added trip')
  } else {
    res.status(500).end('error')
  }
})

app.delete('/trips/:id', (req, res) => {
  db.deleteTripID(req.params.id, (obj) => res.status(200).end(JSON.stringify(obj)));
})

app.post('/login', (req, res) => {
  let email = req.body.email;
  let enteredPassword = req.body.password;

  db.findUser(email, found => {
    if (found) {
      let salt = found.dataValues.salt;
      bcrypt.hash(enteredPassword, salt, null, (err, encryptedPass) => {

        if (encryptedPass === found.dataValues.password) {
          req.session.user = found.dataValues.email;
          delete req.session.password;
          res.status(200).end(JSON.stringify(found.dataValues.email));
        } else {
          res.status(400).end('incorrect username or password');
        }

      })
    } else {
      res.status(400).end('User Doesn\'t exist. Sign up!');
    }
  })
})

app.post('/signup', (req, res) => {
  let email = req.body.email;
  let enteredPassword = req.body.password;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(enteredPassword, salt, null, (err, hashedPass) => {
      db.addUser({
        email: req.body.email,
        password: hashedPass,
        salt: salt
      }, (addedUser, error) => {
        if (error === true) {
          res.status(400).end('User already exists. Go to Login');
        } else if (addedUser) {
          req.session.user = addedUser.dataValues.email;
          delete req.session.password;
          res.status(200).end(JSON.stringify(addedUser.email));
        }
      })
    })
  })
})

// default protected route handled by react-router
app.get('*', function(req, res) {
  if (req.session.user !== null) {
    res.sendFile(path.join(__dirname, '/../client/dist/index.html'));
  }
});

app.post('/logout', (req, res) => {
  req.session.reset();
})

app.listen(process.env.PORT !== undefined ? process.env.PORT : PORT, () => {
  console.log(`listening on port ${PORT}`);
});
