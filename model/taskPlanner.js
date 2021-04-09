const fs = require('fs');
const path = require('path');

module.exports = class TaskPlanner {

    constructor(empId, taskId, taskName, deadLine){
        this.empId = empId;
        this.taskId = taskId;
        this.taskName = taskName;
        this.deadLine = deadLine;
    }

    save(){
        const p = path.join(path.dirname(process.mainModule.filename), 'data', 'taskPlanner.json');
        fs.readFile(p, (err, fileContent) => {
            //console.log(fileContent);
            let products = [];
            if(!err){
                products = JSON.parse(fileContent); //converting javascript object
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        })

    }

    static fetchAll(cb){
        const p = path.join(path.dirname(process.mainModule.filename), 'data', 'taskPlanner.json');
        fs.readFile(p, (err, fileContent) => {
            if(err){
                cb([]);
            }else{
                cb(JSON.parse(fileContent));
            }
        });
    }
}