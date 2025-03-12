function expandTextarea(){
  while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
      $(this).height($(this).height()+1);
  }
}

function isHexColor(color){
  if (color[0] !== '#'){
    color = '#' + color;
  }
  if (typeof color === 'string' &&
      color.length == 7 &&
      !isNaN(parseInt(color.slice(1,7), 16))) {
        return color;
  }
  return false;
}

function isEmptyObj(obj){
  return (Object.getOwnPropertyNames(obj).length === 0);
}

function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = decodeURIComponent(tmparr[1]);
    }
    return params;
}

function substringMatcher(strs) {
  return function findMatches(q, cb) {
    var matches = [];
    startswithRegex = new RegExp('^' + q, 'i');
    
    $.each(strs, function(i, str) {
      if (startswithRegex.test(str)) {
        matches.push({ value: str });
      }
    });

    substrRegex = new RegExp(q, 'i');
    
    $.each(strs, function(i, str) {
      if (substrRegex.test(str) && !startswithRegex.test(str)) {
        matches.push({ value: str });
      }
    });
    
    cb(matches);
  };
};

function getActiveCountries(){
  var country_list = $("#active_countries").val();
  return country_list === "" ? [] : country_list.split('\n');
}

var default_active_color = "#009dd9";
var default_inactive_color = "#b3b3b3";
var hover_color = "#ffcc00"; // Highlight color when hovered

var params = getSearchParameters();

if (isEmptyObj(params)){
  document.getElementById('form_container').style.display = 'block';
  var country_to_id = {};
  var id_to_country = {};
  var country_list = [];
  
  d3.tsv("world-country-names.tsv").get(function(error, rows){
    for(var ix=0; ix < rows.length; ix++){
      country_to_id[rows[ix].name] = rows[ix].id;
      id_to_country[rows[ix].id] = rows[ix].name;
      country_list.push(rows[ix].name);
    }

    $('#add_country.typeahead').typeahead({
      hint:true,
      highlight:true,
      minLength:1
    },
    {
      name: 'countries',
      displayKey: 'value',
      source: substringMatcher(country_list)
    }).on('typeahead:selected', function($e, country){
      var current_countries = getActiveCountries();
      current_countries.push(country.value);
      $("#active_countries").val(current_countries.join('\n'));
      $("#add_country").val('');
      expandTextarea.call(document.getElementById('active_countries'));
    });

    $("#map_form").submit(function($e){
      $("#active_countries").val($.map(getActiveCountries(), function(country){
        return country_to_id[country];
      }).join(','));
    });

    var ac = $('#active_countries');
    if (ac.val() !== ""){
      ac.val($.map(ac.val().split(','), function(val){
        return id_to_country[val];
      }).join('\n'));
    }
    
    expandTextarea.call(document.getElementById('active_countries'));
  });

} else {
  var sheet = (function() {
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return style.sheet;
  })();

  active_country_style = "fill: " + (isHexColor(params.active_color) || default_active_color) + ";";
  sheet.insertRule(".active_country {" + active_country_style + "}", 0);

  inactive_country_style = "fill: " + (isHexColor(params.inactive_color) || default_inactive_color) + ";";
  sheet.insertRule(".inactive_country {" + inactive_country_style + "}", 0);

  var active_countries = params.active_countries ? params.active_countries.split(',') : [];

  var width = 960, height = 500;

  var projection = d3.geo.robinson()
      .scale(150)
      .translate([width / 2, height / 2])
      .precision(.1);

  var path = d3.geo.path().projection(projection);

  var graticule = d3.geo.graticule();

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("defs").append("path")
      .datum({type: "Sphere"})
      .attr("id", "sphere")
      .attr("d", path);

  svg.append("use").attr("class", "stroke").attr("xlink:href", "#sphere");
  svg.append("use").attr("class", "fill").attr("xlink:href", "#sphere");

  d3.json("world-50m.json", function(error, world) {
    svg.selectAll(".country")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("path")
        .attr("class", function(d) {
          return active_countries.includes(d.id) ? "active_country" : "inactive_country";
        })
        .attr("d", path)
        .on("mouseover", function(d) { // Hover effect
          d3.select(this).style("fill", hover_color);
        })
        .on("mouseout", function(d) { // Restore original color on mouse out
          if (active_countries.includes(d.id)) {
            d3.select(this).style("fill", isHexColor(params.active_color) || default_active_color);
          } else {
            d3.select(this).style("fill", isHexColor(params.inactive_color) || default_inactive_color);
          }
        });

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
  });

  d3.select(self.frameElement).style("height", height + "px");
}