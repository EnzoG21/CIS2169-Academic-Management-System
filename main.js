var pageCounter = 1;
var moduleContainer = document.getElementById('module-info');
var btn = document.getElementById("btn");

btn.addEventListener("click", function(){
  var allData = [];
  var requestCount = 0;

  function requestJSON(url) {
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', url);
    ourRequest.onload = function(){
      var ourData = JSON.parse(ourRequest.responseText);
      allData.push(...ourData);
      requestCount++;

      if (requestCount === 3) {
        renderHTML(allData);
      }
    };
    ourRequest.send();
  }

  requestJSON('module-1.json');
  requestJSON('module-2.json');
  requestJSON('module-3.json');
});

function renderHTML(data) {
  data.sort(function(a, b) {
    var nameA = a.Name.toUpperCase();
    var nameB = b.Name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  var modulesByName = {};

  for (var i = 0; i < data.length; i++) {
    var name = data[i].Name;
    if (!modulesByName[name]) {
      modulesByName[name] = [];
    }
    modulesByName[name].push(data[i]);
  }

  var moduleContainer = document.getElementById('module-info');
  var htmlString = "";

  for (var name in modulesByName) {
    htmlString += "<div class='row'>";
    htmlString += "<div class='col'><h2>" + name + "</h2></div>";
    htmlString += "</div>";

    var nameModules = modulesByName[name];
    htmlString += "<div class='row'>";
    for (var j = 0; j < nameModules.length; j++) {
      var module = nameModules[j];
      htmlString += "<div class='col-md-4'>";
      htmlString += "<div class='card mb-3'>";
      htmlString += "<div class='card-body'>";
      htmlString += "<h5 class='card-title'>" + module.Name + "</h5>";
      htmlString += "<p class='card-text'>Course: " + module.Course + "</p>";
      htmlString += "<p class='card-text'>Academic: " + module.Academic + "</p>";
      htmlString += "<p class='card-text'>Programme Code: " + module.ProgrammeCode + "</p>";
      htmlString += "<p class='card-text'>Assessments: " + module.Module.Assignment.join(", ") + "</p>";
      htmlString += "<p class='card-text'>Learning Outcomes: " + module.Module.Learning_outcomes.join(", ") + "</p>";
      htmlString += "<p class='card-text'>Volume: " + module.Module.Volume.join(", ") + "</p>";
      htmlString += "<p class='card-text'>Weights: " + module.Module.weights.join(", ") + "</p>";
      htmlString += "<table class='table'>";
      htmlString += "<thead><tr><th>Day</th><th>Time</th><th>Location</th></tr></thead>";
      htmlString += "<tbody>";
      for (var k = 0; k < module.Timetable.length; k++) {
        var event = module.Timetable[k];
        htmlString += "<tr><td>" + event.Day + "</td><td>" + event.Time + "</td><td>" + event.Location + "</td></tr>";
      }
      htmlString += "</tbody>";
      htmlString += "</table>";
      htmlString += "</div>";
      htmlString += "</div>";
      htmlString += "</div>";
    }
    htmlString += "</div>";
  }

  moduleContainer.innerHTML = htmlString;
}



var formContainer = document.getElementById('form-container');
var form = document.getElementById('module-form');
var addModuleBtn = document.getElementById('add-module-btn');

// Show form when button is clicked
addModuleBtn.addEventListener("click", function(){
  formContainer.style.display = 'block';
});

// Submit form data
form.addEventListener("submit", function(e) {
  e.preventDefault(); // prevent form from refreshing the page

  // Get form data
  var name = document.getElementById('name-input').value;
  var course = document.getElementById('course-input').value;
  var academic = document.getElementById('academic-input').value;
  var programmeCode = document.getElementById('programme-code-input').value;
  var assignments = document.getElementById('assignment-input').value.split(',');
  var learningOutcomes = document.getElementById('learning-outcomes-input').value.split(',');
  var volume = document.getElementById('volume-input').value.split(',');
  var weights = document.getElementById('weights-input').value.split(',');

  // Create module object
  var module = {
    "Name": name,
    "Course": course,
    "Academic": academic,
    "ProgrammeCode": programmeCode,
    "Module": {
      "Assignment": assignments,
      "Learning_outcomes": learningOutcomes,
      "Volume": volume,
      "weights": weights
    }
  };

  // Save module object to file

   // Determine file name based on module name
  var fileName;
  if (name === "Undergraduate") {
    fileName = "module-1.json";
  } else if (name === "Research") {
    fileName = "module-2.json";
  } else if (name === "Post-Graduate") {
    fileName = "module-3.json";
  } else {
    console.error("Invalid module name");
    return;
  }

  // Save module object to file
  var fileUrl = "/Volumes/1TB\ DRIVE/Repositories/CIS2169-Academic-Management-System/ " + fileName;
  var file = new File([JSON.stringify(module)], fileUrl, {type: "application/json"});
  var fileWriter = new FileWriter();
  fileWriter.write(file);
  fileWriter.onerror = function(e) {
    console.error("Failed to save module:", e);
  };
  fileWriter.onwriteend = function() {
    console.log("Module saved successfully!");
  };

  // Clear form fields
  form.reset();
  formContainer.style.display = 'none';
});
