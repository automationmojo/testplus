
/*
    Author: "Myron Walker"
    Copyright: "Copyright 2024, Myron W Walker"
    Version: = "2.0.0"
    Email: myron.walker@gmail.com
*/

const DATETIME_FORMAT = "yyyy-MM-ddTHH:mm:ss.ssssss"

 async function fetch_http(url) {
    var promise = new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    resolve(this.responseText);
                } else {
                    reject(this.statusText);
                }
            }
        };

        xmlhttp.onerror = function () {
            reject(this.statusText);
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    });

    return promise;
}

async function fetch_json(url) {
    var promise = new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var robj = JSON.parse(this.responseText);
                    resolve(robj);
                } else {
                    reject(this.statusText);
                }
            }
        };

        xmlhttp.onerror = function () {
            reject(this.statusText);
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    });

    return promise;
}

async function fetch_json_stream(url) {
    var promise = new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var json_objects = [];

                    var split_responses = this.responseText.split("\x1e");
                    var srlength = split_responses.length;
                    while (srlength > 0) {
                        var ritem = split_responses.pop();
                        if (ritem.length > 0) {
                            var robj = JSON.parse(ritem);
                            json_objects.unshift(robj);
                        }
                        srlength = srlength - 1;
                    }

                    resolve(json_objects);
                } else {
                    reject(this.statusText);
                }
            }
        };

        xmlhttp.onerror = function () {
            reject(this.statusText);
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    });

    return promise;
}

function get_parent_directory(refurl) {
    return refurl.substring(0, refurl.lastIndexOf("/"));
}


function get_output_directory(tab_content_url) {
    var output_dir = get_parent_directory(get_parent_directory(tab_content_url));
    return output_dir;
}


function get_time_difference(start, stop) {
    var startTimeStamp = Date.parse(start, DATETIME_FORMAT) / 1000;
    var stopTimeStamp = Date.parse(stop, DATETIME_FORMAT) / 1000;
    
    var elapsedTime = stopTimeStamp - startTimeStamp;

    var diff = "";

    if (elapsedTime > 1) {
        var seconds = elapsedTime;
        var minutes = null;
        var hours = null;
        var days = null;

        if (seconds > 60) {
            var minutes = Math.floor(seconds / 60);
            seconds = seconds - (minutes * 60);
        
            if (minutes > 60) {
                var hours = Math.floor(minutes / 60);
                minutes = minutes % 60;

                if (hours > 24) {
                    var days = Math.floor(hours / 20);
                    hours = hours % 24;
                    diff = days.toString() + "d";
                }

                diff += hours.toString() + "h";
            }

            diff += minutes.toString() + "m";
        }

        diff += seconds.toFixed(4) + "s";
    } else {
        diff = elapsedTime.toFixed(4) + "s";
    }

    return diff;
}

async function include_html_templates() {
    var z, i, elmnt, file, xhttp;

    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
    
        /*search for elements with a certain atrribute:*/
        if (elmnt.hasAttribute("include-html-templates")) {
            file = elmnt.getAttribute("include-html-templates");
            if (file) {
        
                /* Make an HTTP request using the attribute value as the file name: */
                response = await fetch_http(file);
                elmnt.innerHTML = response;
                
            }

            elmnt.removeAttribute("include-html-templates");
        }
        
    }
    
    /* Exit the function: */
    return;
}

function tab_get_content_directory() {
    var iframe_pathname = window.location.pathname;
    var content_directory = get_parent_directory(iframe_pathname);
    return content_directory;
}


function isDict(value) {
    rtnval = false;
    if (value.constructor == Object) {
        rtnval = true;
    }
    return rtnval
}

function isString(value) {
    rtnval = false;
    if (value.constructor == String) {
        rtnval = true;
    }
    return rtnval
}
