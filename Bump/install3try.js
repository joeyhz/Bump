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

var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: "www.google.com",
  signInOptions: [
    {
        provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      scopes: [
        'user_friends'
      ]
  }
],

  // Terms of service url.
tosUrl: "_blank",
// Privacy policy url.
privacyPolicyUrl: '_blank'
})
alert(user.uid)
