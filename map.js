// var selected_country = "Malaysia";

// var visa_free_countries = [];
// var visa_on_arrival_countries = [];
// var visa_eta_countries = [];
// var visa_required_countries = [];

// var visa_categories = {
//     "visa-free": new Set(),
//     "visa-on-arrival": new Set(),
//     "visa-eta": new Set(),
//     "visa-required": new Set()
// };

// var country_id = {};
// var id_country = {};

// const csv_name = "passport-index-matrix.csv";
// const csv_country_id_name = "world-country-names.tsv";
// var country_data = {};

// var data_array = [];
// var data_array_size = 0;

// // CSV Parsing Function (Same as before)
// function parseCSV(str) {
//     var arr = [];
//     var quote = false;
//     for (var row = col = c = 0; c < str.length; c++) {
//         var cc = str[c], nc = str[c+1];
//         arr[row] = arr[row] || [];
//         arr[row][col] = arr[row][col] || '';

//         if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
//         if (cc == '"') { quote = !quote; continue; }
//         if (cc == ',' && !quote) { ++col; continue; }
//         if (cc == '\n' && !quote) { ++row; col = 0; continue; }

//         arr[row][col] += cc;
//     }
//     return arr;
// }

// function parseTSV(tsvText) {
//     let lines = tsvText.split("\n"); // Split by line
//     let countryIDToName = {}; // Create an empty dictionary

//     for (let line of lines) {
//         let [id, name] = line.trim().split("\t"); // Split by tab

//         if (id && name) {
//             countryIDToName[id] = name; // Store in dictionary
//         }
//     }
//     return countryIDToName;
// }

// // Load and Structure CSV Data Efficiently
// async function loadAndProcessCSV() {
//     try {
//         const response = await fetch(csv_name);
//         const csv_text = await response.text();
//         const data_array = parseCSV(csv_text);

//         const response_ids = await fetch(csv_country_id_name);
//         const csv_text_id = await response_ids.text();
//         country_id = parseTSV(csv_text_id);
//         console.log(country_id["Malaysia"]);

//         if (data_array.length < 2) {
//             console.error("CSV file appears to be empty or invalid.");
//             return;
//         }

//         // Extract headers (country names)
//         const headers = data_array[0].slice(1); // Exclude "Passport" column

//         // Convert CSV into structured object
//         for (let i = 1; i < data_array.length; i++) {
//             let passportCountry = data_array[i][0]; // First column is passport country
//             country_data[passportCountry] = {};

//             for (let j = 1; j < data_array[i].length; j++) {
//                 let destinationCountry = headers[j - 1]; // Column name
//                 let visaStatus = data_array[i][j]; // Visa status value

//                 country_data[passportCountry][destinationCountry] = visaStatus;
//             }
//         }

//         console.log("Structured Data Loaded Successfully:", country_data);

//         // Categorize visa types for the selected country
//         categorizeVisaData(selected_country);

//     } catch (err) {
//         console.error("An error occurred while loading CSV:", err);
//     }
// }

// // Categorize Countries Based on Visa Requirements
// function categorizeVisaData(passportCountry) {
//     if (!country_data[passportCountry]) {
//         console.warn(`No data found for ${passportCountry}`);
//         return;
//     }

//     // Reset sets
//     visa_categories["visa-free"].clear();
//     visa_categories["visa-on-arrival"].clear();
//     visa_categories["visa-eta"].clear();
//     visa_categories["visa-required"].clear();

//     // Categorize based on visa requirements
//     for (let [destination, visaStatus] of Object.entries(country_data[passportCountry])) {
//         if (!visaStatus || visaStatus === "-1") continue; // Skip invalid entries

//         if (!isNaN(visaStatus) && visaStatus > 0) {
//             visa_categories["visa-free"].add(destination);
//         } else if (visaStatus.toLowerCase().includes("visa on arrival")) {
//             visa_categories["visa-on-arrival"].add(destination);
//         } else if (visaStatus.toLowerCase().includes("e-visa") || visaStatus.toLowerCase().includes("eta")) {
//             visa_categories["visa-eta"].add(destination);
//         } else if (visaStatus.toLowerCase().includes("visa required")) {
//             visa_categories["visa-required"].add(destination);
//         }
//     }

//     console.log("Visa Categories for", passportCountry, visa_categories);
// }

// // loadAndProcessCSV();

// // Define colours
// var selected_country_colour = "#009dd9";
// var visa_free_country_colour = "#1D8348";
// var visa_on_arrival_country_colour = "#58D68D";
// var visa_eta_country_colour = "#D5F5E3";
// var visa_required_country_colour = "#E74C3C";

// var uncat_country_colour = "#a9a8a8";

// // Define active countries by their IDs (from world-50m.json)
// var active_countries = []; // Example: USA, Canada, India



// // Define colors
// var default_active_color = "#009dd9"; // Blue for active countries
// var default_inactive_color = "#b3b3b3"; // Gray for inactive countries
// var hover_color = "#ffcc00"; // Yellow for hover effect

// // Set up map dimensions
// var width = 960, height = 500;

// // Set up map projection
// var projection = d3.geo.robinson()
//     .scale(150)
//     .translate([width / 2, height / 2])
//     .precision(.1);

// // Set up path generator
// var path = d3.geo.path().projection(projection);



// // Create SVG container
// var svg = d3.select("#map-container").append("svg")
//     .attr("viewBox", "0 0 " + width + " " + height)
//     .attr("preserveAspectRatio", "xMidYMid meet")
//     .attr("width", "100%")
//     .attr("height", "100%");

// d3.tsv(csv_country_id_name, function(data) {
//     console.log(data);
// }); 
// d3.csv(csv_name, function (data) {
//     console.log(data);
//     console.log(data[0]["Albania"]);
// })
// // Load world map data
// d3.json("world-50m.json", function(error, world) {
//   if (error) throw error;

//   // Draw countries
//   svg.selectAll(".country")
//     .data(topojson.feature(world, world.objects.countries).features)
//     .enter().append("path")
//     .attr("class", function(d) {
//         if (d.id == selected_country) {
//             return "selected_country_colour";
//         } else if (visa_categories["visa-free"].has()) {
//             return "visa_free_country_colour";
//         } else if (visa_on_arrival_countries.includes(d.id)) {
//             return "visa_on_arrival_country_colour";
//         } else if (visa_eta_countries.includes(d.id)) {
//             return "visa_eta_country_colour";
//         } else if (visa_required_countries.includes(d.id)) {
//             return "visa_required_country_colour";
//         } else {
//             return "hover_color";
//         }
//         return active_countries.includes(d.id) ? "active_country" : "inactive_country";
//     })
//     .attr("d", path)
//     .on("mouseover", function(d) {
//         d3.select(this).style("fill", hover_color); // Highlight on hover
//     })
//     .on("mouseout", function(d) {
//         d3.select(this).style("fill", null); // Remove inline style to revert to CSS class color
//     });

//   // Draw country boundaries
//   svg.append("path")
//       .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
//       .attr("class", "border")
//       .attr("d", path);
// });

const csv_passport_index_matrix = "passport-index-matrix.csv";
const json_world_50m = "world-50m.json";
const tsv_world_country_names = "world-country-names.tsv";

// string consts
const visa_on_arrival = "visa on arrival";
const visa_required = "visa required";
const e_visa = "e-visa";
const eta = "eta";
const visa_free = "visa free";


var hover_color = "#ffcc00";
// Set up map dimensions
var width = 960, height = 500;

// Set up map projection
var projection = d3.geo.robinson()
    .scale(150)
    .translate([width / 2, height / 2])
    .precision(.1);

// Set up path generator
var path = d3.geo.path().projection(projection);

// Create SVG container
var svg = d3.select("#map-container").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("width", "100%")
    .attr("height", "100%");

var selected_country = "Canada";

function isNumeric(x) {
    return !isNaN(x);
}

d3.tsv(tsv_world_country_names, function (error_tsv, world_country_names) {
    if (error_tsv) throw error_tsv;

    var id_country_dict = {};
    world_country_names.forEach(row => {
        id_country_dict[row["id"]] = row["name"];
    });

    // Populate dropdown
    let dropdown = d3.select("#country-selector");
    dropdown.selectAll("option")
    .data(Object.values(id_country_dict)) 
    .enter()
    .append("option")
    .attr("value", d => d)
    .attr("selected", d => d === "Canada" ? true : null)
    .text(d => d);
});

document.getElementById("country-selector").addEventListener("change", function () {
    selected_country = this.value;
    updateData();
});

function updateData() {
    // Parse data and make map
d3.csv(csv_passport_index_matrix, function (error_csv, passport_index_matrix) {
    if (error_csv) throw error_csv;

    var passport_index_dict = {};
    passport_index_matrix.forEach((row, index) => {
        passport_index_dict[row["Passport"]] = index;
    });

    // console.log(passport_index_dict);
    d3.tsv(tsv_world_country_names, function (error_tsv, world_contry_names) {
        if (error_tsv) throw error_tsv;

        var id_country_dict = {};
        world_contry_names.forEach((row, index) => {
            id_country_dict[row["id"]] = row["name"];
        });

        // console.log(id_country_dict);

        // console.log(id_country_dict);
    
        d3.json(json_world_50m, function (error_json, world) {
            if (error_json) throw error_json;
            console.log(passport_index_matrix);
            // console.log(world_contry_names);

            // Draw countries
            svg.selectAll(".country")
                .data(topojson.feature(world, world.objects.countries).features)
                .enter().append("path")
                .attr("class", function (d) {
                    var cur_country = id_country_dict[d.id];

                    if (d.id == "732") {
                        cur_country = "Morocco";
                    } else if (d.id == "304") {
                        cur_country = "Denmark";
                    }

                    if (cur_country == selected_country) {
                        return "selected-country";
                    }

                    const country_index = passport_index_dict[selected_country];
                    console.log(passport_index_matrix[country_index]);
                    const policies = passport_index_matrix[country_index];
                    const policy = policies[cur_country];

                    
                    if (isNumeric(policy)) {
                        const days = Number(policy);
                        if (days > 0) {
                            return "visa-free-country";
                        } else {
                            return "inactive_country";
                        }
                    }

                    if (policy == visa_free) {
                        return "visa-free-country";
                    } else if (policy == visa_required) {
                        return "visa-required-country ";
                    } else if (policy == visa_on_arrival) {
                        return "visa-on-arrival-country";
                    } else if (policy == e_visa) {
                        return "e-visa-country";
                    } else if (policy == eta) {
                        return "visa-eta-country";
                    } else {
                        return "inactive_country"
                    }
                })
                .attr("d", path)
                .on("mouseover", function (d) {
                    d3.select(this).style("fill", hover_color); // Highlight on hover
                })
                .on("mouseout", function (d) {
                    d3.select(this).style("fill", null); // Remove inline style to revert to CSS class color
                });

            // Draw borders
            svg.append("path")
                .datum(topojson.mesh(world, world.objects.countries, function (a, b) { return a !== b; }))
                .attr("class", "border")
                .attr("d", path);
        });
    });
});
}



updateData()