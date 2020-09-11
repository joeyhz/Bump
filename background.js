
var config = {
  apiKey: "AIzaSyCRcoJ5tRdbh5tFdGMWp_A1L_TKCFteZHI",
  authDomain: "bump-3b3fc.firebaseapp.com",
  databaseURL: "https://bump-3b3fc.firebaseio.com/",
  storageBucket: "gs://bump-3b3fc.appspot.com"
};
firebase.initializeApp(config);
var active;
var myUID;
var myYT;
var myTwitch;
var myFBwatch;
var myInvis
var myActiveAsk;
var myTitleGo;
var myPosterGo;

chrome.identity.getAuthToken({interactive: true}, function(token) {
  console.log('got the token', token);
})

chrome.storage.sync.get({active:false},function(act){active = act.active;})

var rule1 = {
    //set where the button is working
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
                hostContains: 'www.youtube.com',
                schemes: ['https']
            }
        }),
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
                hostContains: 'www.twitch.tv',
                schemes: ['https']
            }
        })
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
                hostContains: 'www.facebook.com',
                schemes: ['https']
            }
        })

    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
};
//Listens for other people's waves
chrome.storage.sync.get('userid', function(items){
    let id = items.userid
    firebase.database().ref('Connections/'+id+'/friend').on('value', function(friendID){
        console.log('wave');
        if (friendID.val()){
            firebase.database().ref('Connections/'+id).child('friend').set(false);//set user's connection status back to false
            let fName;
            console.log('friendID',friendID.val())
            firebase.database().ref('Usernames/'+friendID.val()).once('value', function(snap){
                fName = snap.val()
                //alert('fName: '+fName)
                if(confirm('Hey '+id+'!\n'+fName+' is giving you a wave!\nDo you want to respond?')){
                    hangoutAccepted()
                }
            })
        }
    })
});

//Listen for other people entering same content as you
chrome.storage.sync.get(['friendIDs','userid','title','poster'], function(items){
    var frList = items.friendIDs
    var uid = items.userid;
    var myP;
    var myT;
    var pAllow = items.poster
    var tAllow = items.title
    firebase.database().ref('Activity/'+uid).on('value',function(snap){
        snap.forEach(function(ch){
            if (ch.key == 'poster'){
                myP = ch.val()
            }else{
                myT = ch.val()
            }
        })
        frList.forEach(function(friend){
            firebase.database().ref('Activity/'+friend).on('value',
                function(snapshot){
                    if (tAllow && snapshot.child('title').val()==myT){
                        fPref(friend, myT, 'title')//check friend's settings for permission
                    }
                    else if (pAllow){
                        if(snapshot.child('poster').val()==myP){
                            fPref(friend, myP, 'poster')//check friend's settings for permission
                        }
                    }
                }
            );
        });
    });
});


chrome.runtime.onInstalled.addListener(function() {
    window.open("install1.html", "Username", "width=600, height=400");
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([rule1]);
    });
});//,'invisMode','title','poster','youtube','fb','twitch'
chrome.webNavigation.onCompleted.addListener(function(web) {
    //On entering website, sets up the user's database to be filled in
    // also handles the ask before activating setting
    if (active){
        chrome.storage.sync.get(['userid','actAsk'], function(items){
            myUID = items.userid
            myActiveAsk = items.actAsk
            firebase.database().ref('Activity/'+myUID).child('title').set(false);
            firebase.database().ref('Activity/'+myUID).child('poster').set(false);
            firebase.database().ref('Connections/'+myUID).child('friend').set(false);
            firebase.database().ref('Connections/'+myUID).child('accepted').set(null);
            if (myActiveAsk){
                if (!confirm("Do you want Bump to be active right now?")){
                    active = false;
                    alert('To reactivate Bump, click on the Bump logo in your Chrome Window')
                }
            }
        });
    }
},{
    url: [
        {hostContains: 'www.youtube.com'},
        {hostContains: 'www.facebook.com'},
        {hostContains: 'www.twitch.tv'}
    ]}
);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    //executes content.js when on appropriate tabs and with appropriate settings.
    // content.js will send a message with the info from the website
    if (active){
        if (changeInfo.status == 'complete'&& tab.status == 'complete' && tab.url != undefined) {
            //alert('tab: '+tab.url+'\n stat: '+changeInfo.status)
            setTimeout(function(){
                chrome.storage.sync.get(['youtube','twitch','fb'],function(items){
                    if (items.youtube){
                        if (tab.url.indexOf("youtube.com") != -1){
                            chrome.tabs.executeScript({
                                file: 'content.js',
                            });
                        }
                    }
                    if (items.twitch){
                        if (tab.url.indexOf("twitch.tv") != -1 ){
                            chrome.tabs.executeScript({
                                file: 'content.js',
                            });
                        }
                    }
                    if (items.fb){
                        if (tab.url.indexOf("facebook.com") != -1 && tab.url.indexOf("videos") != -1){
                            chrome.tabs.executeScript({
                                file: 'content.js'
                            });
                        }
                    }
                })
            },3000);
        }
    }
});

chrome.runtime.onMessage.addListener(
    //listens for message from content.js, updates database with web info and
    //starts checking for a match with friends
    function(mess, send, sendResponse){
        alert('user: '+mess.user+'\ntitle: '+mess.title)
        chrome.storage.sync.get('userid',function(my){
            myUID = my.userid
            firebase.database().ref('Activity/'+myUID).child('poster').set(mess.user);
            firebase.database().ref('Activity/'+myUID).child('title').set(mess.title);
        });
        checkMatch(mess.user, mess.title);
        sendResponse({got:'got it'})
    }
)

function resetConnections(uid){
    firebase.database().ref('Connections/'+uid).child('friend').set(false);
}

function checkMatch(poster, title){
    //Sees if any of your friends are watching the content that you just entered
    console.log('checking')
    chrome.storage.sync.get(['friendIDs', 'poster', 'title'],
        function(friend){
            let pAllow = friend.poster//my poster allow, not the friend'switch
            let tAllow = friend.title//also mine
            let fList = friend.friendIDs
            fList.forEach(function(id){
                firebase.database().ref('Activity/'+id).once('value',
                    function(snapshot){
                        console.log('1: '+snapshot.child('title').val()+' allows: '+pAllow+tAllow)
                        //alert('key: '+childS.key+'\nval: '+childS.val()+'allows: '+pAllow+tAllow)
                        if (tAllow && snapshot.child('title').val()==title){
                            fPref(id, title, 'title')//check friend's settings for permission
                        }
                        else if (pAllow){
                            if(snapshot.child('poster').val()==poster){
                                fPref(id, poster, 'poster')//check friend's settings for permission
                            }
                        }
                    }
                );
            });
        }
    );
}

function fPref(fid, info, type){
    alert('fPref')
    var inv = true;
    var medium = false;
    firebase.database().ref('Settings/'+fid).once('value',function(snapshot){
        snapshot.forEach(function(child){
            console.log('setting: ',child.key)
            if (child.key == type){
                console.log("inMed:",child.val())
                medium = child.val();
            }else if(child.key == 'invisMode'){
                console.log("inInv:",child.val())
                inv = child.val()
            }
        });
        console.log("inv:",inv)
        console.log("med:",medium)
        if (!inv && medium){
            //the friend is not on invisible mode and wants to be bumped into on this platform
            console.log('match!',info)
            match(fid, info, type);
        }
    })

}

function match(fid, info, type){
    //Found a suitable match, giving option to reaach out
    var accept;
    firebase.database().ref('Usernames/'+fid).once('value',
        function(name){
            let fName = name.val()
            console.log('type:',type)
            if (type == 'title'){
                console.log('same title')
                accept = confirm('You and '+fName+ ' are both watching '+info+'!\n'+
                'Do you want to say Hi?')
            }else{
                console.log('same poster')
                accept = confirm('You and '+fName+ ' are both watching content posted by '+info+'!\n'+
                'Do you want to say Hi?')
            }
            if (accept){
                startChat(fid, info)
            }
        }
        )

}



function startChat(id, info){
    alert(id+info)
    //set friend's connection status to your own id.
    //This will trigger a wave on her device from you
    chrome.storage.sync.get('userid', function(item){
        firebase.database().ref('Connections/'+id).child('friend').set(item.userid);
    });
}

function hangoutAccepted(){
    console.log('hangoutAccepted');
    chrome.storage.sync.get('userid', function(item){
        firebase.database().ref('Connections/'+id).child('friend').set(item.userid);
    });
}

/*    chrome.notifications.create('not',opt,function(id){
        alert(opt.iconUrl);
        console.log("Last error:", chrome.runtime.lastError);
    });
}*/


/*
chrome.webNavigation.onHistoryStateUpdated.addListener(function(e) {
    chrome.tabs.executeScript({
        file: 'content.js'
    });
},{
    url: [
        {hostContains: 'www.youtube.com'},
        {hostContains: 'www.twitch.tv'}
    ]
});
}, {
url: [
    {hostContains: 'www.youtube.com'},
    {hostContains: 'www.twitch.tv'}
]
});
*/
