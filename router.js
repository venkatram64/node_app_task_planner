const fs = require("fs");
const url = require("url");
var qs = require('querystring');//for parsing the url encoding data

const TaskPlanner = require('./model/taskPlanner'); //storing the data into file

function renderPage(path, res){
    fs.readFile(path, null, (err, data) => {
        if(err){
            res.writeHead(404);
            res.write('File not found!');
        }else{
            res.write(data);
        }
        res.end();
    });
}


function renderTaskPage(path, res){
    let fileContent = fs.readFileSync(path, 'utf-8');
    TaskPlanner.fetchAll(tpData => {
        if(tpData){
            let tableStart = '<table>';
            tableStart += '<tr><th> Task Id</th><th>Emp Id</th><th> Task </th><th> Deadline </th></tr>';
            let tableEnd = '</table>'
            let htmlStr = tableStart;
            for(tp of tpData){
                htmlStr += "<tr><td>" +  tp.taskId + "</td><td>" +  tp.empId +"</td><td>"+ tp.taskName + "</td><td>"+ tp.deadLine + "</td></tr>"     
            }
            htmlStr += tableEnd;
            fileContent = fileContent.replace("tableData", htmlStr);
        }else{
            fileContent = fileContent.replace("tableData", "No tasks available");    
        }
       
        res.write(fileContent);
        res.end();   
    });
    
}

const requestHandler = (req, res) =>{
    //const url = req.url;
    const method = req.method;
    const path = url.parse(req.url).pathname;
    res.writeHead(200, {'Content-Type': 'text/html'});
    switch(path){
        case '/':
            renderTaskPage('./views/show-tasks.html', res);
            break;
        case '/add-task': 
            if(method === 'POST'){
                const body = [];
                req.on('data', (chunk) => {
                    body.push(chunk);
                });
                req.on('end', () => {
                    const parseBody = Buffer.concat(body).toString();
                    const fdata = qs.parse(parseBody) //query string parser
                    console.log(fdata);  
                    const task = new TaskPlanner(fdata.empId, fdata.taskId, fdata.task, fdata.deadLine);
                    task.save();                   
                });               
            }           
            renderTaskPage('./views/show-tasks.html', res);
            break;
        case '/show-task':      //add task is shown      
            renderTaskPage('./views/add-task.html', res);
            break;
        default:
            renderPage('./views/404.html', res);
            break;
    }
}

//module.exports = requestHandler;

module.exports = {
    handler: requestHandler
}
