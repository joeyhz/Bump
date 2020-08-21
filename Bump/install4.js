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
//var database = firebase.database()

var networkIDs = [];
var networkUs = [];
var allow = true;

window.resizeTo(600, 800);
document.getElementById("uButton").onclick = readSU;
document.getElementById("eButton").onclick = readSE;
document.getElementById("doneButton").onclick = saveFriends;

chrome.storage.sync.get(['friendUs','friendIDs'],function(items){
    networkUs = items.friendUs
    networkIDs = items.friendIDs
    if (networkUs){
        postToPage(checkRemove)
    }
})

function saveFriends(){
    chrome.storage.sync.set({friendIDs:networkIDs},function(){})
    chrome.storage.sync.set({friendUs:networkUs},function(){window.open("options.html", "_self");})
}

function readSU() {
    //alert(networkUs)
    var newURef = firebase.database().ref('Usernames/');
    var entered = document.getElementById("uname").value
    var exists = false;
    var friendKey;
    var have;

    newURef.once('value', function(snapshot) {
        //alert(snapshot.val())
        snapshot.forEach(function(childSnapshot) {
            //alert(childSnapshot.val());
            //alert('Entered: '+entered+' childSnapshot: '+String(grandchildSnapshot.val()));
            if (childSnapshot.val() == entered) {
                exists = true;
                friendKey = childSnapshot.key;
                if (networkIDs){
                    have = networkIDs.includes(friendKey)
                }else{
                    have = false;
                }

            }
        });
        if (exists && !have) {
            //alert('good');
            networkUs.push(entered);
            networkIDs.push(friendKey);
            //alert('nID: ' + networkIDs);
            postToPage(checkRemove);

            document.getElementById("uname").value = ""

        } else if (exists) {
            swal({
                icon: "error",
                text: "That user is already part of your network"
            });
        } else {
            badUsername();
        }
    })
}

function badUsername() {
    swal("That username doesn't exist.","Are you sure you spelled it right?","error")
}



function readSE() {
    var newURef = firebase.database().ref('Emails/');
    var entered = document.getElementById("email").value
    var exists = false;
    var friendKey;

    newURef.once('value', function(snapshot) {
        //alert(snapshot.val())
        snapshot.forEach(function(childSnapshot) {
            //alert(childSnapshot.val());
            //alert('Entered: '+entered+' childSnapshot: '+String(grandchildSnapshot.val()));
            if (childSnapshot.val() == entered) {
                exists = true;
                friendKey = childSnapshot.key;
                have = networkIDs.includes(friendKey);
            }
        })
        if (exists && !have) {
            //alert('good');
            networkIDs.push(friendKey);
            appendUName(friendKey);

        } else if (exists) {
            swal({
                icon: "error",
                text: "That user is already part of your network"
            });
        } else {
            badEmail();
            //alert('bad');
        }
    })
}

function appendUName(key) {
    firebase.database().ref('Usernames/' + key).once('value', function(snapshot) {
        networkUs.push(snapshot.val());
        postToPage(checkRemove);
        document.getElementById("email").value = ""
    });
}

function badEmail() {
    swal("That email isn't on Bump","Are you sure you spelled it right?","error")
}


function postToPage(callback) {
    var passBack = ""
    networkUs.forEach(function(item) {
        passBack += "<div class = friend id = " + item + ">" + item +
            "<button class = removeButton> Remove </button></div>"
    })
    document.getElementById('friend_location').innerHTML = passBack;
    allow = true;
    callback();
}

//document.getElementById('friend_location').addEventListener("mouseover", checkRemove);

function checkRemove() {
    networkUs.forEach(function(friend, index) {
        //alert(friend.lastChild.firstChild.nodeValue)
        document.getElementById(friend).lastChild.onclick = function() {
            //alert(friend)
            if (allow == true){
                allow = false;
                red(friend, index);
            }
        }
    });
}

function red(f, i){
    console.log('redding');
    document.getElementById(f).className += " removeF";
    setTimeout(function(){kill(i);}, 500);
}

function kill(ind){
        console.log('ind: '+ind);
        //console.log('u: '+f.lastChild.firstChild.nodeValue)
        //document.getElementById(f).remove();
        removedU = networkUs.splice(ind, 1);
        removedID = networkIDs.splice(ind, 1);
        postToPage(checkRemove);
}
