// Set the configuration for your app
// TODO: Replace with your project's config object
//var SDK = document.firebase

var firebaseConfig = {
  apiKey: "AIzaSyCRcoJ5tRdbh5tFdGMWp_A1L_TKCFteZHI",
  authDomain: "bump-3b3fc.firebaseapp.com",
  databaseURL: "https://bump-3b3fc.firebaseio.com",
  projectId: "bump-3b3fc",
  storageBucket: "bump-3b3fc.appspot.com",
  messagingSenderId: "1052737722401",
  appId: "1:1052737722401:web:f22e4fd6acce2cb00dab60",
  measurementId: "G-JXX80Z9CPC"
};

var config = {
  apiKey: "AIzaSyCRcoJ5tRdbh5tFdGMWp_A1L_TKCFteZHI",
  authDomain: "bump-3b3fc.firebaseapp.com",
  databaseURL: "https://bump-3b3fc.firebaseio.com/",
  storageBucket: "gs://bump-3b3fc.appspot.com"
};
firebase.initializeApp(config);

// Get a reference to the database service
//var database = firebase.database();

chrome.identity.getProfileUserInfo(function(info) {
    //alert(info.email);
    document.getElementById("email").value = info.email
})
document.getElementById("sendButton").onclick = readS;


var input = document.getElementById("email");

input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("sendButton").click();
  }
});


function readS() {
    var newURef = firebase.database().ref('Emails/');
    var entered = document.getElementById("email").value
    var submit = true;
    newURef.once('value',function(snapshot){
        snapshot.forEach(function(childSnapshot) {
                //alert(childSnapshot);
                //alert('Entered: '+entered+' childSnapshot: '+String(grandchildSnapshot.val()));
                if (childSnapshot.val() == entered){
                    submit = false;
                }
            })
        if (submit === true){
            goodEmail(entered,newURef);
            //alert('good');
        }else{
            badEmail();
            //alert('bad');
        }
    })
}

function goodEmail(enteredV,newRef){
    //alert('goodEmail')
    chrome.storage.sync.get('userid', function(items){
        newRef.child(items.userid).set(enteredV);
        chrome.storage.sync.set({email:enteredV}, function() {});
        window.open("install3.html", "_self")
    });
        //alert('UserID is set to ' + String(final));
}
function badEmail(){
        swal("This Email is already taken","Please try another one","error")
    }
