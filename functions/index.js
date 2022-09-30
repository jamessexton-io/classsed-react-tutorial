const firebase = require('firebase/app')
const functions = require("firebase-functions");
const admin = require("firebase-admin")
const auth = require("firebase-auth")

const app = require('express')() 

admin.initializeApp()

const firebaseConfig = {
    key: "REDACTED"
  };

firebase.initializeApp(firebaseConfig)

//Sign-up route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        userHandle: req.body.userHandle,
    }

    //TODO Validate Data
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        console.log("tried to create email")
        
        .then(data => {
            return res.status(201).json({message: `user ${data.user.uid} signed up successfully`})
        })
        .catch((err) => {
            console.log(err.error)
            return res.status(500).json({error: err.code})
        })

        return res.status(201) 

 })


//Scream routes
app.get('/screams', (req, res) => {
    admin.firestore()
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let screams = []
        data.forEach(doc => {
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            })
        })
        return res.json(screams)
    })
    .catch((err) => {
        console.log(err)
    })
})

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString
    }

    admin.firestore()
        .collection('screams')
        .add(newScream)
        .then(doc => {
            res.json({message: `document ${doc.id} created sucessfully`})
        })
        .catch((err) => {
            res.status(500).json({error: "something went wrong"})
            console.log(err)
        })

 }) 

 

 exports.api = functions.region('europe-west1').https.onRequest(app)
