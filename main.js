$(document).ready(function() {
  $(".sidenav").sidenav();
});

var signInandSignOutBtn = $("#signInToggle");
var welcomeMessageId = $("#welcomeMessage");

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    window.location = "/calendar.html";
    console.log("User is signed in");

    var user = firebase.auth().currentUser;
    var loggedInEmail = user.email;

    if (user != null) {
      welcomeMessageId.text("Welcome, ");
      $("#navLogin").text(loggedInEmail);
      signInandSignOutBtn.text("Sign Out");
      signInandSignOutBtn.attr("onclick", "logout()");
    }
  } else {
    // No user is signed in.
    welcomeMessageId.text("Please Sign In");
    console.log("user not signed in");
    signInandSignOutBtn.hide();
  }
});

function login() {
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPass)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      Swal.fire({
        type: "error",
        title: "Access Denied",
        text: errorMessage,
        footer:
          "<a href='https://google.com' target='_blank'>Contact Support</a>"
      });

      // ...
    });
}

function logout() {
  firebase.auth().signOut();
  Swal.fire({
    type: "success",
    title: "Successfully logged out",
    showConfirmButton: false,
    timer: 4000
  });

  setTimeout(function() {
    window.location = "/";
  }, 7000);
}
