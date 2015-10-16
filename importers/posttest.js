var http = require("http");
var qs = require("querystring");

var port = 9000;

function getCalcHtml(req, resp, data) {
	console.log(JSON.stringify(data,null,3));
    var sb = '';
    sb += "<html> \n";
    sb += " <body>\n";
    sb += "     <form method='post'>\n";
    sb += "         <table>\n";
    sb += "             <tr>\n";
    sb += "                 <td>Enter First No: </td>\n";

    if (data && data.txtFirstNo) {
        sb += "                 <td><input type='text' id='txtFirstNo' name='txtFirstNo' value='" + data.txtFirstNo + "'/></td>\n";
    }
    else {
        sb += "                 <td><input type='text' id='txtFirstNo' name='txtFirstNo' /></td>\n";
    }

    sb += "             </tr>\n";
    sb += "             <tr>\n";
    sb += "                 <td>Enter Second No: </td>\n";

    if (data && data.txtSecondNo) {
        sb += "                 <td><input type='text' id='txtSecondNo' name='txtSecondNo' value='"+ data.txtSecondNo + "'/></td>\n";
    }
    else {
        sb += "                 <td><input type='text' id='txtSecondNo' name='txtSecondNo' /></td> \n";
    }

    sb += "             </tr>\n";
    sb += "             <tr>\n";
    sb += "                 <td><input type='submit' value='Calculate' /></td>\n";
    sb += "             </tr>\n";

    if (data && data.txtFirstNo && data.txtSecondNo) {
        var sum = parseInt(data.txtFirstNo) + parseInt(data.txtSecondNo);
        sb += "             <tr>\n";
        sb += "                 <td>Sum: "+ sum + "</td>\n";
        sb += "             </tr>\n";
    }

    sb += "         </table>\n";
    sb += "     </form>\n";
    sb += " </body> \n";
    sb += "</html>";
    
    resp.write(sb);
    resp.end();
   
}

function getCalcForm(req, resp, data) {
    resp.writeHead(200, { "Content-Type": "text/html" });
    getCalcHtml(req, resp, data);
}

function getHome(req, resp) {
    resp.writeHead(200, { "Content-Type": "text/html" });
    resp.write("<html><html><head><title>Home</title></head><body>Want to some calculation? Click <a href='/calc'>here</a></body></html>");
    resp.end();
}

function get404(req, resp) {
    resp.writeHead(404, "Resource Not Found", { "Content-Type": "text/html" });
    resp.write("<html><html><head><title>404</title></head><body>404: Resource not found. Go to <a href='/'>Home</a></body></html>");
    resp.end();
}

function get405(req, resp) {
    resp.writeHead(405, "Method not supported", { "Content-Type": "text/html" });
    resp.write("<html><html><head><title>405</title></head><body>405: Method not supported</body></html>");
    resp.end();
}

http.createServer(function (req, resp) {
    switch (req.method) {
        case "GET":
            if (req.url === "/") {
                getHome(req, resp);
            }
            else if (req.url === "/calc") {
                getCalcForm(req, resp);
            }
            else {
                get404(req, resp);
            }
            break;
        case "POST":
            if (req.url === "/calc") {
                var reqBody = '';
                req.on('data', function (data) {
                    reqBody += data;
                    if (reqBody.length > 1e7) { //10MB
                        resp.writeHead(413, 'Request Entity Too Large', { 'Content-Type': 'text/html' });
                        resp.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
                    }
                });
                req.on('end', function () {
                    var formData = qs.parse(reqBody);
                    getCalcForm(req, resp, formData);
                });
            }
            else {
                get404(req, resp);
            }
            break;
        default:
            get405(req, resp);
            break;
    }
}).listen(port);