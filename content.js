var t = document.title
var u = document.URL
var ytL;
var twL;
var fbL;


var config = {
  apiKey: "AIzaSyCRcoJ5tRdbh5tFdGMWp_A1L_TKCFteZHI",
  authDomain: "bump-3b3fc.firebaseapp.com",
  databaseURL: "https://bump-3b3fc.firebaseio.com/",
  storageBucket: "gs://bump-3b3fc.appspot.com"
};
//firebase.initializeApp(config);

//alert('title: '+t+'\nurl: '+u+'\nready: '+document.readyState)
if (u.indexOf("youtube.com") != -1 && ytL != u){
    ytL = goYT()
}else if (u.indexOf("twitch") != -1 && twL != u) {
    twL = goTwitch()
}else if (u.indexOf("facebook") != -1&& fbL != u){
    fbL = goFB()
}

function goYT(){
    if (u.indexOf('watch')!=-1){
        let domTitle =
            document.getElementById('info-contents').firstChild.lastChild.childNodes[3].firstChild.innerHTML;
        //alert('dom: '+domTitle)
        let user =
            document.getElementById("text").innerText;
        console.log('user: '+user)
        chrome.runtime.sendMessage(
            {
                user:user,
                title:domTitle
            },
            function(response){
                console.log(response.got)
            }
        )
        user = ""
        domTitle = ""
        return u
    }
}

function goTwitch(){
    if (u.length > 22){
        let title =
            document.getElementsByClassName('channel-info-content')[0].firstChild.firstChild.firstChild.firstChild.lastChild.lastChild.firstChild.firstChild.firstChild.firstChild.innerText
        let user =
            t.slice(0,-9)
        //alert('title: '+title+' poster: '+poster)
        chrome.runtime.sendMessage(
            {
                user:user,
                title:title
            },
            function(response){
                console.log(response.got)
            }
        )
        return u
    }
}

function goFB(){
    let title = t
    //alert(title)
    let first = u.indexOf('/',8)+1
    let last = u.indexOf('/', first)
    let user = u.slice(first,last)
    //alert(u.length+'url: '+u+'\nfirst: '+first +'\nlast: '+ last+'\nuser: '+user)
    chrome.runtime.sendMessage(
        {
            user:user,
            title:title
        },
        function(response){
            console.log(response.got)
        }
    )
    return u
}
