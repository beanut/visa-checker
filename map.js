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