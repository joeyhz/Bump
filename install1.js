// Set the configuration for your app
// TODO: Replace with your project's config object
//var SDK = document.firebase

var config = {
  apiKey: "AIzaSyCRcoJ5tRdbh5tFdGMWp_A1L_TKCFteZHI",
  authDomain: "bump-3b3fc.firebaseapp.com",
  databaseURL: "https://bump-3b3fc.firebaseio.com/",
  storageBucket: "gs://bump-3b3fc.appspot.com"
};
firebase.initializeApp(config);

// Get a reference to the database service
//var database = firebase.database();



document.getElementById("sendButton").onclick = readS;

var input = document.getElementById("uname");

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
    var newURef = firebase.database().ref('Usernames/');
    var entered = document.getElementById("uname").value
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
            goodUsername(entered,newURef);
            //alert('good');
        }else{
            badUsername();
            //alert('bad');
        }
    })
}

function goodUsername(enteredV,newRef){
    //alert('goodUsername')
    var final = newRef.push(enteredV).key;

    chrome.storage.sync.set({userid: String(final)}, function() {});
    window.open("install2.html", "_self")
}
function badUsername(){
        swal("This username is already taken."," Please try another one","error")
    }
