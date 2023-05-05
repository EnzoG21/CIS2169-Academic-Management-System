const pageNum = 1;
const moduleContainer = document.getElementById('module-info');
const info = document.getElementById("info");

info.addEventListener("click", function() {
    const allData = [];
    let requestCount = 0;

    function requestJSON(url) {
        const ourRequest = new XMLHttpRequest();
        ourRequest.open('GET', url);
        ourRequest.onload = function() {
            const ourData = JSON.parse(ourRequest.responseText);
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
//the code above is used to pull all 3 JSON files locally when the button is clicked


function renderHTML(data) {
    data.sort(function(a, b) {
        const nameA = a.Name.toUpperCase();
        const nameB = b.Name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
//code above is used to sort the name category of the JSON so they appear correctly on the page
    const modulesByName = {};

    for (const element of data) {
        const name = element.Name;
        if (!modulesByName[name]) {
            modulesByName[name] = [];
        }
        modulesByName[name].push(element);
    }

    const htmlString = Object.keys(modulesByName).map(name => {
        let nameModules = modulesByName[name];
        let modulesHtmlString = nameModules.map(module => {
            let moduleHtmlString = `
                <div class='col-md-7'>
                    <div class='card mb-3'>
                        <div class='card-body wider'>
                            <h5 class='card-title'>${module.Name}</h5>
                            <p class='card-text'>Course: ${module.Course}</p>
                            <p class='card-text'>Academic: ${module.Academic}</p>
                            <p class='card-text'>Programme Code: ${module.ProgrammeCode}</p>
                            <p class='card-text'>Assessments: ${module.Module.Assignment.join(", ")}</p>
                            <p class='card-text'>Learning Outcomes: ${module.Module.Learning_outcomes.join(", ")}</p>
                            <p class='card-text'>Volume: ${module.Module.Volume.join(", ")}</p>
                            <p class='card-text'>Weights: ${module.Module.weights.join(", ")}</p>
                            <table class='table'>
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>Time</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${module.Timetable.map(event => `
                                        <tr>
                                            <td>${event.Day}</td>
                                            <td>${event.Time}</td>
                                            <td>${event.Location}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            return moduleHtmlString;
        }).join('');

        let nameHtmlString = `
            <div class='row'>
                <div class='col'>
                    <h2>${name}</h2>
                </div>
            </div>
            <div class='row'>
                ${modulesHtmlString}
            </div>
        `;
        return nameHtmlString;
    }).join('');

    moduleContainer.innerHTML = htmlString;
}
//this code is used to display the data from the json in HTML using integrated bootstrap for stylling




const formContainer = document.getElementById('form-container');
const form = document.getElementById('module-form');
const addModuleBtn = document.getElementById('add-module-btn');

// this shows the form when button is clicked
addModuleBtn.addEventListener("click", function() {
    formContainer.style.display = 'block';
});

// this submits the form data 
form.addEventListener("submit", function(e) {
    e.preventDefault(); // prevent form from refreshing the page

    // we create constants to get the data from the form
    const name = document.getElementById('name-input').value;
    const course = document.getElementById('course-input').value;
    const academic = document.getElementById('academic-input').value;
    const programmeCode = document.getElementById('programme-code-input').value;
    const assignments = document.getElementById('assignment-input').value.split(',');
    const learningOutcomes = document.getElementById('learning-outcomes-input').value.split(',');
    const volume = document.getElementById('volume-input').value.split(',');
    const weights = document.getElementById('weights-input').value.split(',');

    // here we create a object of what needs to be added in the json
    const module = {
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

    // this is used to sort so that each name is then saved to the correct json such as Undergraduate
    let fileName;
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

    // save the data we got locally into the json files
    const fileUrl = `/Volumes/1TB\ DRIVE/Repositories/CIS2169-Academic-Management-System/ ${fileName}`;
    const file = new File([JSON.stringify(module)], fileUrl, {
        type: "application/json"
    });
    const fileWriter = new fileWriter();
    fileWriter.write(file);
    fileWriter.onerror = function(e) {
        console.error("Failed to save created module:", e);
    };
    fileWriter.onwriteend = function() {
        console.log("Module has been saved successfully!");
    };

    form.reset();
    formContainer.style.display = 'none';
});



const modules = ["module-1.json", "module-2.json", "module-3.json"];

const createTimeBtn = document.getElementById("create-timetable-btn");
const timetable = document.getElementById("timetable");

createTimeBtn.addEventListener("click", () => {
    timetable.innerHTML = "";
//this is used for when we click on the button it displays the html
    for (const module of modules) {
        fetch(module)
            .then(response => response.json())
            .then(data => {
                for (const item of data) {
                    const {
                        ProgrammeCode,
                        Name,
                        Course,
                        Timetable
                    } = item;
                    //in the code above we fetch a specific type of data from the json
                    const table = document.createElement("table");
                    table.classList.add("table", "table-bordered", "table-striped", "mt-5");
                    const caption = document.createElement("caption");
                    caption.classList.add("text-center", "mb-5");
                    caption.textContent = `${ProgrammeCode} - ${Name} - ${Course}`;
                    table.appendChild(caption);
// here we create the table with a title
                    const headerRow = document.createElement("tr");
                    headerRow.classList.add("table-dark");
                    const header1 = document.createElement("th");
                    header1.scope = "col";
                    header1.textContent = "Day";
                    headerRow.appendChild(header1);
                    const header2 = document.createElement("th");
                    header2.scope = "col";
                    header2.textContent = "Time";
                    headerRow.appendChild(header2);
                    const header3 = document.createElement("th");
                    header3.scope = "col";
                    header3.textContent = "Location";
                    headerRow.appendChild(header3);
                    table.appendChild(headerRow);
//here we create the different rows of data
                    for (const timetableItem of Timetable) {
                        const row = document.createElement("tr");
                        const cell1 = document.createElement("td");
                        cell1.textContent = timetableItem.Day;
                        row.appendChild(cell1);
                        const cell2 = document.createElement("td");
                        cell2.textContent = timetableItem.Time;
                        row.appendChild(cell2);
                        const cell3 = document.createElement("td");
                        cell3.textContent = timetableItem.Location;
                        row.appendChild(cell3);
                        table.appendChild(row);
                    }
                    timetable.appendChild(table);
                    //and not we add the json data into the cells
                }
            })
            .catch(error => console.log(`Failed to fetch ${module}: ${error}`));
    }//error message in case it fails
});