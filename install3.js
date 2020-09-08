// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
    apiKey: "AIzaSyCRcoJ5tRdbh5tFdGMWp_A1L_TKCFteZHI",
    authDomain: "bump-3b3fc.firebaseapp.com",
    databaseURL: "https://bump-3b3fc.firebaseio.com/",
    storageBucket: "gs://bump-3b3fc.appspot.com"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
var provider = new firebase.auth.FacebookAuthProvider();

/*chrome.storage.sync.get('email', function(items){
    document.getElementById("info").innerHTML += "Email: "+items.email;
});

chrome.storage.sync.get('userid', function(items){
    document.getElementById("info").innerHTML += " ID: "+items.userid;
});*/

var networkUs = [];
var networkIDs = [];
var allow = true;

document.getElementById("FBbutton").onclick = function() {
    launchFB(provider);
}
document.getElementById("nextButton").onclick = function() {
    chrome.storage.sync.set({friendIDs:networkIDs},function(){})
    chrome.storage.sync.set({friendUs:networkUs},function(){window.open("install4.html", "_self");})
}
document.getElementById("doneButton").onclick = function() {
    chrome.storage.sync.set({friendIDs:networkIDs},function(){})
    chrome.storage.sync.set({friendUs:networkUs},function(){window.open("install4.html", "_self");})
}


function launchFB(provider) {
    // FirebaseUI config.
    provider.addScope('user_friends');

    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        window.resizeTo(600, 800);
        document.getElementById("title").innerHTML = "Here are your Facebook friends who have Bump:";
        document.getElementById("doneButton").className = "sendButton tm"
        document.getElementById("FBbutton").style.display = "none"
        document.getElementById("nextButton").style.display = "none"
        startF(token)
    }).catch(function(error) {

        // Handle Errors here.

        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        alert('catch: ' + errorMessage)
        // ...
    });

}

function startF(tok) {
    var url = "https://graph.facebook.com/me?fields=id,friends&access_token=" + tok
    // Set up our HTTP request
    var xhr = new XMLHttpRequest();
    // Setup our listener to process completed requests
    xhr.onload = function() {
        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
            // What do when the request is successful
            console.log('success!', xhr);
            saveFBid(xhr)
            saveFriends(xhr);
        } else {
            // What do when the request fails
            console.log('The request failed!');
        }

        // Code that should run regardless of the request status
        console.log('This always runs...');
    }
    // Create and send a GET request
    // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
    // The second argument is the endpoint URL
    xhr.open('GET', url);
    xhr.send();
}

function saveFBid(xhr){
    let obj = JSON.parse(xhr.responseText)
    let fabID = obj.id
    alert(fabID)
    chrome.storage.sync.get('userid',function(item){
        let id = item.userid
        firebase.database().ref("Facebook IDs").child(fabID).set(id)//facebook is reverse
    });
}

function saveFriends(xhr){
    let obj = JSON.parse(xhr.responseText)
    let fData = obj.friends.data
    fData.forEach(function(friend){
        let fFBid = friend.id
        firebase.database().ref("Facebook IDs/"+fFBid).once('value',function(snapshot){
            let fBumpID = snapshot.val()
            networkIDs.push(fBumpID);
            findU(fBumpID)
        });//.... ADD Username lookup from id
    });
}

function findU(bid){
    firebase.database().ref("Usernames/"+bid).once('value',function(snap){
        networkUs.push(snap.val())
        postToPage()
    })
}

function postToPage(){
    //alert('posting: '+ networkUs)
    var pb = ""
    networkUs.forEach(function(u){
        pb += "<div class = friend id = " + u + ">" + u +
            "<button class = removeButton> Remove </button></div>"
    });
    //alert('pb: '+pb)
    document.getElementById('friend_location').innerHTML = pb;
    checkRemove();
}

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
        postToPage();
}

/*
startF = function() {
    FB.init({
        appId: '689579945150808',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v7.0'
    });
    friendFunc();
}

function friendFunc() {
    window.resizeTo(600, 800);
    document.getElementById("banner").innerHTML = "Here are your Facebook friends who have Bump:";
    FB.login(function(response) {
        // handle the response
        if (response.status === 'connected') {
            // Logged into your webpage and Facebook.
            console.log("da")
            getData();
        };

    }, {
        scope: 'user_friends'
    });

    var getData = function() {
        alert("getting")
        FB.api(
            '/100051588606588/friends',
            'GET', {},
            function(response) {
                // Insert your code here
                document.getElementById("friend_location").innerHTML = response.friends;
            }
        );
    }
}*/
