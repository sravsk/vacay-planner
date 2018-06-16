const Sequelize = require('sequelize');
const moment = require('moment');

const testRests = require('../sample_data/sample_restaurants.js');
const testEvents = require('../sample_data/sample_events.js');

if (process.env.DATABASE_URL !== undefined) {
  var db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging:  true
  })

} else {
  var db = new Sequelize('vacay_planner', 'vacay', 'planner', {
    host: 'localhost',
    dialect: 'postgres'
  })
}

// Check for db connection

db
  .authenticate()
  .then(() => {
    console.log('Connected to vacay-planner');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


// The following 4 functions create the
// Database Table Schemas

const User = db.define('users', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  email: {type: Sequelize.STRING, unique: true},
  password: {type: Sequelize.STRING, allowNull: false},
  salt: {type: Sequelize.STRING, allowNull: false}
});

const Trip = db.define('trips', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  start_date: Sequelize.DATE,
  end_date: Sequelize.DATE,
  tripName: {type: Sequelize.STRING, allowNull: false, unique: true},
  loc: Sequelize.STRING,
  latLng: Sequelize.STRING,
  itinerary: Sequelize.TEXT // stringify an array of objects - keys will be days in trip and properties will be itineraries for the corresonding days
});

var Restaurant = db.define('restaurants', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: {type: Sequelize.STRING, allowNull: false},
  yelpURL: {type: Sequelize.STRING, allowNull: false},
  review_count: {type: Sequelize.INTEGER, allowNull: false},
  rating: {type: Sequelize.FLOAT, allowNull: false},
  price: {type: Sequelize.STRING},
  restLong: Sequelize.FLOAT,
  restLat: Sequelize.FLOAT,
  categories: Sequelize.JSON,
  image_url: Sequelize.STRING,
  display_address: Sequelize.JSON
});

const Event = db.define('event', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: {type: Sequelize.STRING, allowNull: false},
  eventURL: {type: Sequelize.STRING},
  eventImg: Sequelize.STRING,
  start_date: Sequelize.DATE,
  venueName: {type: Sequelize.STRING/*, allowNull: false*/},
  venueLong: Sequelize.FLOAT,
  venueLat: Sequelize.FLOAT,
  venueAddress: Sequelize.STRING
});

const POI = db.define('poi', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  latLng: Sequelize.JSON,
  name: {type: Sequelize.STRING, allowNull: false},
  rating: Sequelize.FLOAT
});


// This sets up Associations between different tables/models,
// and gives us nifty helper functions; like setters and getters.

User.hasMany(Trip, {
  foreignKey: {
    allowNull: false
  }
});

Trip.belongsTo(User, {
  allowNull: false
});

Trip.hasMany(Restaurant, {
  foreignKey: {
    allowNull: false
  }
});

Restaurant.belongsTo(Trip);

Trip.hasMany(Event, {
  foreignKey: {
    allowNull: false
  }
});

Event.belongsTo(Trip);

Trip.hasMany(POI, {
  foreignKey: {
    allowNull: false
  }
})

POI.belongsTo(Trip);

// This long promise chain is required to make sure
// that all of the associations are setup properly.

User.sync().then(() => Trip.sync().then(() => Restaurant.sync().then(() => Event.sync().then(() => POI.sync()))));

// These are all of the functions that are
// being exported to the server file.

var dbHelpers = {

  // This function adds a new user if one is passed as an object
  // and is
  addUser: (obj, cb) => {
    User.findOne({where: {email: obj.email}}).then(user => {
      if (user === null) {
        User.create({
          email: obj.email,
          password: obj.password,
          salt: obj.salt
        }).then(user => cb(user, false))
      } else {
        cb(null, true)
      }
    });
  },

  // This will find a user and pass it to a callback,
  // which is needed for authentication to work
  findUser: (obj, cb) => {
    User.findOne({where: {email: obj}}).then(user => cb(user))
  },

  // This will find a given user's Trips
  // and all associated Events & Restaurants
  // and then pass that whole thing
  // to a callback
  getUserTrips: (obj, cb) => {
    var output = [];
    User.findOne({where: {email: obj.email}})
    .then( user => {
      //find all user Trips
      user.getTrips().then(userTrips => {
        cb(userTrips);
      })
    })
    // .catch(err=> {
    //   cb(null);
    // })
  },

  // This will get all trip items
  // (Events & Restaurants, location, latLng) when
  // given a Trip ID
  getTripItems: (tripId, cb) => {
    Trip.findOne({where: {id: tripId}}).then(trip => {
      output = {
        loc: trip.loc,
        latLng: trip.latLng,
        events: [],
        restaurants: [],
        pois: [],
        startDate: trip.start_date,
        endDate: trip.end_date,
        itinerary: trip.itinerary
      }

      trip.getEvents()
      .then(tripEvents => output.events = tripEvents)
      .then(trip.getRestaurants()
      .then(tripRestaurants => {
        return output.restaurants = tripRestaurants
      }))
      .then(Restaurants => {
        return POI.findAll({ where : {id : tripId}}).then(tripPOIs => output.poi = tripPOIs )
        })
      .then(trips => {
        console.log("output before sending to server", output)
        cb(output)
      })
    })

    // method to grab only events and restaurants

     // trip.getEvents()
     //  .then(tripEvents => output.events = tripEvents)
     //  .then(() => {trip.getRestaurants()
     //  .then(tripRestaurants => output.restaurants = tripRestaurants)
     //    .then(() => cb(output))
     //  })
  },

  // This will create a new Trip
  // and save all associated Events
  // & Restaurants to the Database
  newTrip: (email, obj) => {
    User.findOne({where: {email: email}}).then(user => {
      // find trip days
      let days = [];
      let itinerary = [];
      let i = 0;
      let tempDate = moment(obj.trip.start_date,);
      while (tempDate <= moment(obj.trip.end_date)) {
        days.push(tempDate.format("dddd, MMMM Do YYYY"));
        i++;
        tempDate = moment(obj.trip.start_date).add(i, 'days');
      }
      // convert days array to an array of objects with days as keys and empty arrays as properties
      days.forEach((day, i) => {
        itinerary[i] = {};
        itinerary[i][day] = [];
      })
      //create the Trip
      user.createTrip({
        start_date: obj.trip.start_date,
        end_date: obj.trip.end_date,
        tripName: obj.trip.name,
        loc: obj.trip.loc,
        latLng: JSON.stringify(obj.trip.latLng),
        itinerary: JSON.stringify(itinerary)
      }).then(trip => {
        console.log('OBJPOI', obj)
        //create the Events if they exist
        if (obj.eventList !== undefined) {
          obj.eventList.forEach(event => {
            var tempEvent = Event.build({
              name: event.name,
              eventURL: event.url,
              eventImg: event.images[0].url,
              start_date: event.dates.start.dateTime,
              venueName: event._embedded.venues[0].name,
              venueLong: event._embedded.venues[0].location.longitude,
              venueLat: event._embedded.venues[0].location.latitude,
              venueAddress: `${event._embedded.venues[0].address.line1}, ${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].state.stateCode} ${event._embedded.venues[0].postalCode}`
            })

            tempEvent.setTrip(trip, {save: false});
            tempEvent.save();
          })
        }
        //create the Restaurants if they exist
        if (obj.restaurantList !== undefined) {
          obj.restaurantList.forEach(restaurant => {
            console.log("Restaurant", Restaurant)
            var tempRest = Restaurant.build({
              name: restaurant.name,
              yelpURL: restaurant.url,
              review_count: restaurant.review_count,
              rating: restaurant.rating,
              price: restaurant.price,
              restLong: restaurant.coordinates.longitude,
              restLat: restaurant.coordinates.latitude,
              categories: restaurant.categories,
              display_address: restaurant.location.display_address,
              image_url: restaurant.image_url
            })
            tempRest.setTrip(trip, {save: false});
            tempRest.save();
          })
        }
        //create the POI if they exist
        if (obj.poiList !== undefined) {
          obj.poiList.forEach(poi => {
            console.log('poi', poi)
            var tempPOI = POI.build({
              latLng: poi.geometry.location,
              name: poi.name,
              rating: poi.rating
            })
            tempPOI.setTrip(trip, {save: false});
            tempPOI.save();
          })
        }
      })
    })
  },

  //this will delete a trip by id and pass the remaining trips to server
  deleteTripID: (tripId, cb) => {
    Trip.findOne({where: {id: tripId}}).then(trip => {
      return  trip.destroy({
        where : {
          id : tripId
        }
      })
    }).then(deletedTrip => {
      return Trip.findAll();
    }).then(trips => {
      cb(trips);
    })
  },

    //this will add new events to a trip by id
  updateTripEvent: (tripId, newEvents) => {
    Trip.findOne({where: {id: tripId}}).then(trip => {
      if (newEvents.eventList !== undefined) {
          newEvents.eventList.forEach(event => {
            var tempEvent = Event.build({
              name: event.name,
              eventURL: event.url,
              eventImg: event.images[0].url,
              start_date: event.dates.start.dateTime,
              venueName: event._embedded.venues[0].name,
              venueLong: event._embedded.venues[0].location.longitude,
              venueLat: event._embedded.venues[0].location.latitude,
              venueAddress: `${event._embedded.venues[0].address.line1}, ${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].state.stateCode} ${event._embedded.venues[0].postalCode}`
            })
            tempEvent.setTrip(trip, {save: false});
            tempEvent.save();
          })
        }
    })
  },

  // add restaurant to a day of a particular trip
  addRestaurantToDay: (tripId, dayIndex, restaurant, callback) => {
    Trip.findOne({where: {id: tripId}})
    .then(trip => {
      let itinerary = JSON.parse(trip.itinerary);
      let key = Object.keys(itinerary[dayIndex])[0]
      itinerary[dayIndex][key].push(restaurant);
      // save to trip
      // id, start date, end date, itinerary, etc.
      // itinerary.setTrip(trip, {save: false});
      // itinerary.save();
      trip.itinerary = JSON.stringify(itinerary)
      trip.save().then(() => {
        Trip.findOne({where: {id: tripId}})
        .then(trip => {
          callback(trip.itinerary);
        })
      })
    })
  },

  //this will add new restaurants to a trip by id
  updateTripRestaurant: (tripId, newRestaurants) => {
    Trip.findOne({where: {id: tripId}}).then(trip => {
         if (newRestaurants.restaurantList !== undefined) {
          newRestaurants.restaurantList.forEach(restaurant => {
            var tempRest = Restaurant.build({
              name: restaurant.name,
              yelpURL: restaurant.url,
              review_count: restaurant.review_count,
              rating: restaurant.rating,
              price: restaurant.price,
              restLong: restaurant.coordinates.longitude,
              restLat: restaurant.coordinates.latitude,
              categories: restaurant.categories,
              display_address: restaurant.location.display_address,
              image_url: restaurant.image_url
            })
            tempRest.setTrip(trip, {save: false});
            tempRest.save();
          })
        }
    })
  },

  updateTripPOI: (tripId, newPOI) => {
    POI.findOne({where: {id: tripId}}).then(trip => {
      if (newPOI.poiList !== undefined) {
        newPOI.poiList.forEach(poi => {
          var tempPOI = POI.build({
            name: poi.results.name,
            latLng: poi.results.geometry.location,
            rating: poi.results.rating
          })
          tempPOI.setTrip(trip, {save: false});
          tempPOI.save();
        })
      }
    })
  },

  //this will delete a event by id and pass the remaining events for that trip to server
  deleteEventID: (tripId, eventId, cb) => {
    Event.findOne({where: {id: eventId}}).then(event => {
      return  event.destroy({
        where : {
          id : eventId
        }
      })
    }).then(deletedEvent => {
      return Event.findAll({ where : { tripId : tripId}})
    }).then(events => {
      cb(events);
    })
  },

  //this will delete a restaurant by id and pass the remaining restaurants for that trip to server
  deleteRestaurantID: (tripId, restaurantId, cb) => {
    Restaurant.findOne({where: {id: restaurantId}}).then(restaurant => {
      return  restaurant.destroy({
        where : {
          id : restaurantId
        }
      })
    }).then(deletedRestaurant => {
      return Restaurant.findAll({ where : { tripId : tripId}})
    }).then(restaurants => {
      cb(restaurants);
    })
  },



  //////////////////////////////////////////////////////////
  //                 Test data use Only                   //
  //////////////////////////////////////////////////////////

  createDummyData: () => {
    //create test user
    var testUser = User.build({
      email: 'ted.green@test.com',
      password: '$2a$10$flgD5OmkK2cwd/7CddCOW.Ujd30tqTb4r02bYVfYuI/GlwKw5gNt.',
      salt: '$2a$10$flgD5OmkK2cwd/7CddCOW.'
    });

    //save test user
    testUser.save().then(user => {

      //create test trip
      var testTrip = Trip.build({
          tripName: 'Cool Runnings',
          start_date: new Date(),
          end_date: new Date()
      });

      //associate with user
      testTrip.setUser(user, {save: false});

      // testTrip.getUser().then(user => console.log(user));

      //& save test Trip
      testTrip.save().then(trip => {

        testEvents.forEach(event => {

          //create test Events
          var trueEvent = Event.build({
            name: event.name,
            eventURL: event.url,
            eventImg: event.images[0].url,
            start_date: event.dates.start.dateTime,
            venueName: event._embedded.venues[0].name,
            venueLong: event._embedded.venues[0].location.longitude,
            venueLat: event._embedded.venues[0].location.latitude,
            venueAddress: `${event._embedded.venues[0].address.line1}, ${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].state.stateCode} ${event._embedded.venues[0].postalCode}`
          })

          //associate with trip
          trueEvent.setTrip(trip, {save: false});

          //save test events
          trueEvent.save();
        });

        testRests.forEach(restaurant => {

          //create test restaurants
          var trueRest = Restaurant.build({
            name: restaurant.name,
            yelpURL: restaurant.url,
            review_count: restaurant.review_count,
            rating: restaurant.rating,
            price: restaurant.price,
            restLong: restaurant.coordinates.longitude,
            restLat: restaurant.coordinates.latitude,
            categories: restaurant.categories,
            display_address: restaurant.location.display_address,
            image_url: restaurant.image_url
          })

          //associate with trip
          trueRest.setTrip(trip, {save: false});

          //save test restaurants
          trueRest.save();
        });
      });
    });
  },


  //////////////////////////////////////////////////////////
  //                       End                            //
  //////////////////////////////////////////////////////////

  // This function clears the contents of the Tables within
  // the Database without removing the schemas
  clearTables: () => {
    Event.findAll().then(events => events.forEach(event => event.destroy()));
    Restaurant.findAll().then(restaurants => restaurants.forEach(restaurant => restaurant.destroy()));
    Trip.findAll().then(trips => trips.forEach(trip => trip.destroy()));
    User.findAll().then(users => users.forEach(user => user.destroy()));
  },

  // This function Drops all tables. If used, server needs
  // to be restarted to recreate the database tables again
  dropTables: () => {
    return db.drop();
  },

  createDB: () => {
    User.sync().then(() => Trip.sync().then(() => Restaurant.sync().then(() => Event.sync())));
  }
}

module.exports = dbHelpers;
