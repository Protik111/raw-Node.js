//dependencies
const fs = require('fs');
const path = require('path');

//scafolding
const lib = {};

//base directory of the data folder
lib.basedir = path.join(__dirname, '../.data/');

//creating file
lib.create = (dir, file, data, callback) => {
    //opening file for writing
    fs.open(lib.basedir+dir+'/'+file+'.json', 'wx', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
            //convert data to string
            const stringData = JSON.stringify(data);

            //write data to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) =>{
                if(!err){
                    fs.close(fileDescriptor, (err) =>{
                        if(!err){
                            callback('empty');
                        }else{
                            callback('Error closing the new file');
                        }
                    });
                }else{
                    callback('error occured writing to new file');
                }
            })
        }else{
            callback('There is an error, file may exists');
        }
    })
};

//reading file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.basedir+dir+'/'+file+'.json', 'utf8', (err, data) => {
        callback(err, data);
    })
};

//updating file
lib.update = (dir, file, data, callback) => {
    //opening file
    fs.open(lib.basedir+dir+'/'+file+'.json', 'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
            //converting data to string
            const stringData = JSON.stringify(data);

            //truncating the file
            fs.ftruncate(fileDescriptor, (err) => {
                if(!err){
                    //write the file
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if(!err){
                            fs.close(fileDescriptor, (err) => {
                                if(!err){
                                    callback(false);
                                }else{
                                    callback('Error of closing file');
                                }
                            });
                        }else{
                            callback('Error writing file');
                        }
                    })
                }else{
                    callback('Error occured of truncating the file');
                }
            })
        }else{
            callback('Error occured updating file, it may not exists');
        }
    })
};

//deleting file
lib.delete = (dir, file, callback) => {
    //unling the file
    fs.unlink(lib.basedir+dir+'/'+file+'.json', (err) => {
        if(!err){
            callback(false);
        }else{
            callback('Error of deleting file');
        }
    });
};

//exporting 
module.exports = lib;