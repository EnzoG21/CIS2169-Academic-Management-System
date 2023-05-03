var pageCounter = 1;
var moduleContainer = document.getElementById('module-info');
var btn = document.getElementById("btn");

btn.addEventListener("click", function(){
  var ourRequest = new XMLHttpRequest();
  ourRequest.open('GET', 'module-'+ pageCounter +'.json'); // changed URL to local file path
  ourRequest.onload = function(){
    var ourData = JSON.parse(ourRequest.responseText);
    renderHTML(ourData);
  };
  ourRequest.send();
  
  pageCounter++;
  
  if (pageCounter > 3){
    btn.disabled = true;
  }
});

function renderHTML(data){
  var academics = {}; // object to store modules for each academic

  for (var i = 0; i < data.length; i++) {
    var academic = data[i].Academic;
    if (!academics[academic]) {
      academics[academic] = []; // create empty array if academic doesn't exist in object
    }
    academics[academic].push(data[i]); // push module into academic array
  }

  var moduleContainer = document.getElementById('module-info');
  var htmlString = "";

  for (var academic in academics) {
    htmlString += "<div class='row'>";
    htmlString += "<div class='col'><h2>" + academic + "</h2></div>";
    htmlString += "</div>";

    var academicModules = academics[academic];
    for (var j = 0; j < academicModules.length; j++) {
      var module = academicModules[j];
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
      htmlString += "</div>";
      htmlString += "</div>";
    }
  }

  moduleContainer.innerHTML = htmlString;
}

