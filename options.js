/*let page = document.getElementById('buttonDiv');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
function constructOptions(kButtonColors) {
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({color: item}, function() {
        console.log('color is ' + item);
      })
    });
    page.appendChild(button);
  }
}
constructOptions(kButtonColors);
*/

var config = {
  apiKey: "AIzaSyCRcoJ5tRdbh5tFdGMWp_A1L_TKCFteZHI",
  authDomain: "bump-3b3fc.firebaseapp.com",
  databaseURL: "wss://bump-3b3fc.firebaseio.com/",
  storageBucket: "gs://bump-3b3fc.appspot.com"
};
firebase.initializeApp(config);

var activeAsk = document.getElementById('actAsk')
var invis = document.getElementById('invisMode')
var title = document.getElementById('title')
var poster = document.getElementById('poster')
var youT = document.getElementById('youtube')
var fb = document.getElementById('fb')
var twitch = document.getElementById('twitch')

var setList = [activeAsk,invis,title,poster,youT,fb,twitch];
var finalList =[];

document.getElementById('sendButton').onclick = function(){
    fin(saveChrome);
}
document.getElementById('doneButton').onclick = function(){
    chrome.storage.sync.get('active', function(act){
        if (act.active == true){
            window.close();
        }else{
            alert('You must submit before exiting')
        }
    });
}

document.getElementById('lastButton').onclick = function(){
    window.open("install4.html", "_self")
}

function checkChecked(element){
    let ch = element.checked;
    let q = element.id
    //alert('ch: '+ch+' q: '+q)
    let eDict = {[q]: ch}
    return eDict
}

function fin(callback){
    setList.forEach(function(item, i){
        finalList.push(checkChecked(item));
        //alert(finalList)
    });
    callback(saveFirebase)//callback == saveChrome
}
function saveChrome(callback, ecallback){
    finalList.forEach(function(item){
        chrome.storage.sync.set(item,function(){
            console.log(item);
        });

    });
    callback()//callback = saveFirebase
}

function saveFirebase(callb){
    setList.forEach(function(item, i){
        let ch = item.checked;
        let q = item.id
        //alert(q)
        let setRef = firebase.database().ref('Settings/');
        chrome.storage.sync.get('userid', function(itemsU){
            //alert(itemsU.userid);
            setRef.child(itemsU.userid+'/').child(q).set(ch);
            chrome.storage.sync.set({active:true},function(){

            });
        });
    });
    swal({
        text: "submitted!",
        icon: "success"
    });
}

/*
function saveFirebase(i){
    let setRef = firebase.database().ref('Settings/');
    chrome.storage.sync.get('userid', function(itemsU){
        alert(itemsU.userid);
        setRef.child(itemsU.userid+'/').set(i);
        chrome.storage.sync.set({active:true},function(){
            alert('activated!');
            //window.close();
    })
    });
}*/
