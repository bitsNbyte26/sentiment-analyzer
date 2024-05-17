const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const User = require('./models/User'); // Ensure this path is correct

const app = express();
app.use(express.json());

// MongoDB connection
const mongoString = 'mongodb+srv://Saiyam:SAIYAMcluster@cluster0.e08jnvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Session configuration
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: mongoString })
}));

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// Registration route
const register = (req, res, next) => {
  User.register(
    new User({ 
      email: req.body.email, 
      username: req.body.username 
    }), req.body.password, function (err, msg) {
      if (err) {
        res.send(err);
      } else {
        res.send({ message: "Successful" });
      }
    }
  );
};

app.post('/register', register);

// Login route
app.post('/login', passport.authenticate('local', { 
  failureRedirect: '/login-failure', 
  successRedirect: '/login-success'
}), (err, req, res, next) => {
  if (err) next(err);
});

app.get('/login-failure', (req, res, next) => {
  console.log(req.session);
  res.send('Login Attempt Failed.');
});

app.get('/login-success', (req, res, next) => {
  console.log(req.session);
  res.send('Login Attempt was successful.');
});

app.get('/profile', (req, res) => {
  console.log(req.session);
  if (req.isAuthenticated()) {
    res.json({ message: 'You made it to the secured profile' });
  } else {
    res.json({ message: 'You are not authenticated' });
  }
});

// Sentiment Analysis route
app.post('/analyze', (req, res) => {
  const sentiment = require('sentiment');
  const Sentiment = new sentiment();
  const result = Sentiment.analyze(req.body.text);
  res.json({
    sentiment: result.score > 0 ? 'positive' : result.score < 0 ? 'negative' : 'neutral',
    scores: result
  });
});

// File upload route using multer
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), (req, res) => {
  // File handling logic
});

app.listen(8000, () => { console.log('Server started on port 8000'); });

module.exports = {
  passport
};
