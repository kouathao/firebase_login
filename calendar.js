//index
$(document).ready(function() {
  $("#addEventoForm").submit(function(e) {
    e.preventDefault();
  });
  $("#editEventoForm").submit(function(e) {
    e.preventDefault();
  });
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
    // User is signed in.
  } else {
    // No user is signed in.
    window.location = "/";
  }
});

//Firebase
var eventActions = firebase.database().ref("events");

eventActions.on("child_added", function(data) {
  populateData();
});
eventActions.on("child_changed", function(data) {
  populateData();
});
eventActions.on("child_removed", function(data) {
  populateData();
});

function saveData() {
  var form = {};
  $("#addEventoForm")
    .serializeArray()
    .map(function(x) {
      form[x.name] = x.value;
    });

  firebase
    .database()
    .ref("events")
    .push({
      allDay: form.time,
      time: form.time,
      event: form.event,
      start: form.data
    });

  $("#resetFormAdd").click();
  $("#closeFormAdd").click();
}

function updateData(event = null) {
  if (event != null) {
    firebase
      .database()
      .ref("events/" + event.id)
      .update({
        allDay: "true",
        time: event.title.split(": ")[0],
        event: event.title.split(": ")[1],
        start: event.start.format()
      });
    return false;
  }
  var form = {};
  $("#editEventoForm")
    .serializeArray()
    .map(function(x) {
      form[x.name] = x.value;
    });

  firebase
    .database()
    .ref("events/" + form.key)
    .update({
      allDay: form.time,
      time: form.time,
      event: form.event,
      start: form.data
    });

  $("#resetFormEdit").click();
  $("#closeFormEdit").click();
}

function deleteData() {
  var form = {};
  $("#editEventoForm")
    .serializeArray()
    .map(function(x) {
      form[x.name] = x.value;
    });

  firebase
    .database()
    .ref("events/" + form.key)
    .remove();

  $("#resetFormEdit").click();
  $("#closeFormEdit").click();
}

function populateData() {
  var events = new Array();
  firebase
    .database()
    .ref("/events")
    .once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var evento = childSnapshot.val();
        events.push({
          id: childSnapshot.key,
          title: evento.time + ": " + evento.event,
          start: evento.start
        });
      });
    })
    .then(function() {
      $("#calendar").fullCalendar("removeEventSources");
      $("#calendar").fullCalendar("addEventSource", events);
    });
}

//fullCalendar

$(document).ready(function() {
  moment.locale("en");
  $("#calendar").fullCalendar({
    height: "auto",
    customButtons: {
      newEntry: {
        text: "New Entry",
        click: function() {
          $("#addModal").modal("show");
        }
      }
    },
    header: {
      left: "title,",
      center: "newEntry",
      right: "month,today,prev,next,listMonth,listYear"
    },
    locale: "en",
    buttonText: {
      today: "Current Month",
      year: "Year",
      month: "Month",
      week: "Week",
      day: "Day"
    },
    allDayText: "The whole day",
    view: {
      name: "listMonth"
    },
    editable: true,
    // eventStartEditable:false,
    eventDurationEditable: false,
    // defaultView: 'listMonth',
    // hiddenDays: [0, 1, 2, 3, 4, 5],
    eventClick: function(calEvent, jsEvent, view) {
      var form = $("#editModal");
      form.find('input[name="key"]').attr("value", calEvent.id);
      form
        .find('input[name="time"]')
        .attr("value", calEvent.title.split(": ")[0]);
      form.find('textarea[name="event"]').val(calEvent.title.split(": ")[1]);
      form.find('input[name="data"]').attr("value", calEvent.start.format());
      form.modal("show");
    },
    eventMouseover: function(event, jsEvent, view) {
      document.getElementById("calendar").style.cursor = "pointer";
    },
    eventMouseout: function(event, jsEvent, view) {
      document.getElementById("calendar").style.cursor = "auto";
    },
    eventDrop: function(event, jsEvent, ui, view) {
      updateData(event);
    }
  });
});

populateData();

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
