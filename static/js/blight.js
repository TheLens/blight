$('#carousel').elastislide({
    minItems: 2
});

$("#details").dialog({
    autoOpen: false
});


function setTitleBarColor(color) {
    $(".ui-dialog-titlebar").css("background-color", color);
    $(".ui-dialog-titlebar").css("opacity", 0.75);
    $("span").css("opacity", 1);
}

$(function() {
    $("#dialog").dialog({
        autoOpen: false,
        resizable: false,
        width: $(window).width() / 3,
        buttons: {
            Close: function() {
                var isd = "#" + $(".ui-dialog-title")[1].innerHTML.replace(/ /g, '_');
                highlight(isd);
                $(this).dialog("close");
                $("#map").unbind('click');
            }
        }
    });
});

var zooms = new Object();
zooms[11] = 0.7;
zooms[12] = 1.5;
zooms[13] = 2;
zooms[14] = 4;
zooms[15] = 6;
zooms[16] = 7;
zooms[17] = 8;

function pan(id) {
    // console.log("pan");
    var part_id = "#" + id.split("**")[0];
    var lat = $(part_id).attr("lat");
    var long = $(part_id).attr("long");
    if (typeof lat != 'undefined' && typeof long != 'undefined') {
        map.setView(new L.LatLng(lat, "-" + long), 15);
        highlight(part_id);
    }
}

function muckwithJqueryUI() {
    $('.ui-dialog').attr('style', function(i, style) {
        return style.replace(/left[^;]+;?/g, 'left: 10%;');
    });

    $('.ui-dialog').attr('style', function(i, style) {
        return style.replace(/top[^;]+;?/g, 'top: 10%;');
    });

}

function showDialog(pth, cls) {

    var colors = {};
    colors['Demolished'] = $($(".Demolished")[0]).css("fill");
    colors['Sheriff'] = $($(".Sheriffs_Sale")[0]).css("fill");
    colors['Multiple'] = $($(".Multiple")[0]).css("fill");
    colors['Repaired'] = $($(".Repaired")[0]).css("fill");
    colors['Nora_Sale'] = $($(".Nora_Sale")[0]).css("fill");

    var base = "pic";
    if (($(window).width() < 600) || ($(window).height() < 550)) {
        base = "mobile";
    } else {
        base = "big";
    }

    var newsrc= "http://s3-us-west-2.amazonaws.com/lensnola/blight/static/images/" + base + pth + ".jpg";
    $("#dialog").html('<img src="' + newsrc + '"><div id="caption"></div>');
    jQuery("#dialog").prev('.ui-dialog-titlebar').css("background", "white");
    if ($(window).width() < 600) {
        $("#dialog").dialog("option", "position", {
            my: "center",
            at: "center",
            of: "#map"
        });
    }
    if ($(window).width() > 599) {
        $("#dialog").dialog("option", "position", {
            my: "center",
            at: "center",
            of: "#mapholder"
        });
    }

    url = "https://s3-us-west-2.amazonaws.com/lensnola/blight/static/captions" + pth;
    $.get(url, function(data) {
        $("#caption").html(data);
        $("#map").on("click", function() {
            $('#dialog').dialog("close");
            $("#map").unbind('click');
        });
        if ($(window).height() < 600) {
            $(".captionsection").remove();
        }
    });

    if ($("#dialog").dialog("isOpen") === false) {
        $("#dialog").dialog("open");
    }
    $(".ui-dialog").attr('top', '50px');
    if (($(window).width() < 600) || ($(window).height() < 550)) {
        $(".ui-dialog").css({
            width: 300
        });
        $(".ui-dialog").css({
            top: ($(window).height() * (1.5 / 10))
        });
        muckwithJqueryUI();
    } else {
        $(".ui-dialog").css({
            top: 50
        });
        $(".ui-dialog").css({
            left: 125
        });
        $(".ui-dialog").css({
            width: 500
        });
    }

    $("#dialog").dialog('option', 'title', pth.replace(/_/g, " ").replace("/", ""));
    setTitleBarColor(colors[cls]);
}

var show = true;

$("#switch").click(function() {
    if (show) {
        $("#switch").html("Show");
        show = false;
    } else {
        show = true;
        $("#switch").html("Hide");
    }
    $("#toggle").toggle("slide");
});

$(function() {
    $("input[type=submit], a, button")
        .button()
        .click(function(event) {
            event.preventDefault();
        });
});

// New
L.mapbox.accessToken = 'pk.eyJ1IjoidHRob3JlbiIsImEiOiJEbnRCdmlrIn0.hX5nW5GQ-J4ayOS-3UQl5w';
var mapboxLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/tthoren.i7m70bek/{z}/{x}/{y}.png', {
  attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
  // scrollWheelZoom: false,
  detectRetina: true,
  minZoom: 11,
  maxZoom: 17
});
// End new

var map = new L.Map("map");
map.setView(new L.LatLng(29.95, -90), 12);
map.addLayer(mapboxLayer);

var legend = L.control({
    position: 'topright'
});

function showLegend() {
    // console.log("here");
    $(function() {
        $("#details").dialog({
            height: 'auto',
            width: $('#map').width(),
            modal: true,
            autoOpen: true,
            buttons: {
                Close: function() {
                    $(this).dialog("close");
                }
            }
        });
    });
    $('.ui-dialog').attr('style', function(i, style) {
        return style.replace(/left[^;]+;?/g, '');
    });
    $("a").on("click", function() {
        window.open(this.href);
    });
}

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["Repaired", "Demolished", "Sheriff Sale", "NORA Sale", "Multiple", "Investigation"],
        labels = ["fixed_label", "demo_label", "sheriff_label", "nora_label", "multiple_label", "lens_label"];

    div.innerHTML += "<div><div>The Lens Investigates<br>City's Blight Fixes</div><ul>";

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<li><div><span class="square" id="' + labels[i] + '"></span><div class="legend_text">' + grades[i] + '</div></div></li>';
    }
    div.innerHTML += '</ul><div>Sources: The Lens, City of New Orleans</div><img onclick=showLegend(); style="float:right" width="15px" height="15px" src="http://s3-us-west-2.amazonaws.com/lensnola/blight/static/images/info.svg"></img></div>';

    return div;
};

legend.addTo(map);

map.on('moveend', function() {
    // console.log("moveend");
    loadThumbs();
    highlight(highlight_id);
});

/* Initialize the SVG layer */
map._initPathRoot();

/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg"),
    g = svg.append("g");

/* Define the d3 projection */
var path = d3.geo.path().projection(function project(x) {
    var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
    return [point.x, point.y];
}).pointRadius(function(d) {
    var zoom = map.getZoom();
    var radiuslevel = zooms[zoom];
    return radiuslevel;
});

function adjustPreview() {
    var width = $(window).width();
    if (width < 600) {
        $("#photopane").remove();
        $("#photopane_label").remove();
        $(".leaflet-right").css("width", "35%");
    }
}

var prezoom;

map.on('zoomstart', function(e) {
    prezoom = map.getZoom();
});

map.on('zoomend', function(e) {
    // console.log("zoomend");
    if (map.getZoom() > prezoom) {
        // console.log("zoomin");
        // console.log(map.getZoom());
        // console.log(zooms[map.getZoom()]);
        $("path").css("stroke-width", zooms[map.getZoom()]);
        highlight(highlight_id);
    } else {
        // console.log("zoomout");
        // console.log(map.getZoom());
        // console.log(zooms[map.getZoom()]);
        $("path").css("stroke-width", zooms[map.getZoom()]);
        highlight(highlight_id);
    }
});

$(window).resize(function() {
    adjustPreview();
});

/* Load and project/redraw on zoom */
d3.json("https://s3-us-west-2.amazonaws.com/lensnola/blight/static/data.json", function(collection) {
    console.log(collection);
    var feature = g.selectAll("circle")
        .data(collection.features)
        .enter().append("path")
        .attr("class", function(d) {
            return d.properties.category + " " + d.properties.investigates + " " + d.properties.thumbnail;
        }).attr("id", function(d) {
            return d.properties.address;
        }).attr("lat", function(d) {
            return Math.abs(d.geometry.coordinates[1]);
        }).attr("long", function(d) {
            return Math.abs(d.geometry.coordinates[0]);
        }).attr("date", function(d) {
            return d.properties.date;
        })
        .attr("circle", path);
    $(".t").on("click", function(e) {
        var adr = "/" + this.id;
        showDialog(adr, document.getElementById(this.id).className['baseVal'].split(" ")[0]);
    });
    feature.attr("d", path);
    map.on("viewreset", function reset() {
        feature.attr("d", path);
        // console.log("reset");
    });
    loadThumbs();

    $(function() {
        $('.t').tipsy({
            gravity: 's',
            title: function(s) {
                var re = /\|$/;
                var capt = this.id.replace(/_/g, " ") + "<br>" + this.attributes.class.nodeValue.split(" ")[0].replace("Sheriffs", "Sheriff's").toUpperCase().replace("_", " ").replace("MULTIPLE", "MULTIPLE ACTIONS") + "<br>" + this.attributes.date.nodeValue;
                return capt.replace(re, "");
            },
            html: true
        });
        $('.f').tipsy({
            gravity: 's',
            title: function() {
                var re = /\|$/;
                var capt = this.id.replace(/_/g, " ") + "<br>" + this.attributes.class.nodeValue.split(" ")[0].replace("Sheriffs", "Sheriff's").toUpperCase().replace("_", " ").replace("MULTIPLE", "MULTIPLE ACTIONS") + "<br>" + this.attributes.date.nodeValue;
                return capt.replace(re, "");
            },
            html: true
        });
    });
});

function highlight(id) {
    $(".highlight").attr("style", "stroke-width:3px; stroke: black;");
    $(id).attr("style", "stroke-width: 30px; stroke: red !important; stroke-opacity: 1;");
    var newclass = $(id).attr("class") + " " + "highlight";
    $(id).attr("class", newclass);
}

var highlight_id;

function loadThumbs() {
    // console.log("loadthumbs");
    var bounds = map.getBounds();
    // console.log(bounds);
    var f = $("path.yesthumbnail");

    var newpics = f.slice(0, f.length);

    for (var i = 0; i < newpics.length; i++) {
        var inner = '<span class="ui-button-text"><img id="' + f[i].id + '**thumbnail" class="thumbnail" src="http://s3-us-west-2.amazonaws.com/lensnola/blight/static/images/thumb/' + f[i].id + '.jpg"></span><p class="caption"><span id="' + i + '_caption">' + f[i].id.replace(/_/g, " ") + '</span></p>';
        $("#" + i).html(inner);
        $("#" + i).attr("href", f[i].id);
    }
    $(".thumbnail").on("click", function(e) {
        var id = "";
        if (this.id.indexOf("**") > -1) {
            id = "#" + this.id.split("**")[0];
        } else {
            id = "#" + $("#" + this.id).find("img")[0].id.split("**")[0];
        }
        if ((typeof this.id != 'undefined')) {
            pan(this.id);
            var adr = "/" + $(id)[0].id;
            pan($(id)[0].id);
            showDialog(adr, document.getElementById($(id)[0].id).className['baseVal'].split(" ")[0]);
        }
    });
}

$(document).ready(function() {
  adjustPreview();
  // map.zoomIn();
});
