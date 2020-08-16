var fs = require("fs");
const { resolve } = require("path");

var object = {
    'initValue': 0
}

var globalCommands = [];

checkIfRunOperationExists = () => {
    var tempVariable = 0;
    for (var command of globalCommands) {
        if (command.indexOf('run') !== -1) {
            runCommands(command[1], tempVariable);
            break;
        }
        tempVariable++;
    }
    return false;
}

runCommands = (fileName, indexOfConcat) => {
    return new Promise((resolve) => {
        fs.readFile(fileName, function (err, buf) {
            if (!buf) {
                globalCommands[indexOfConcat] = ['error'];
                checkIfRunOperationExists();
                return false
            };
            var fileCommands = [];
            var newCommandsArray = [];

            fileCommands = buf.toString().split('\n');

            fileCommands.forEach((command, index2) => {
                newCommandsArray.push([]);
                command.split(' ').forEach(element => {
                    newCommandsArray[index2].push(element.replace('\r', ''));
                });

                if (index2 === fileCommands.length - 1) {
                    var firstCommandsTempArray = globalCommands.slice(0, indexOfConcat);
                    var secondCommandsTempArray = globalCommands.slice(indexOfConcat + 1, globalCommands.length);
                    globalCommands = firstCommandsTempArray.concat(newCommandsArray.concat(secondCommandsTempArray));
                    if (!checkIfRunOperationExists()) resolve();
                }
            });
        });
    });
}

runCommands(process.argv[process.argv.length - 1], 0).then(() => {
    setTimeout(() => {
        var fileContent = '';
        globalCommands.forEach((command) => {
            {
                switch (command[0]) {
                    case 'add':
                        object.initValue = Number(returnValue(command[1])) + Number(returnValue(command[2]));
                        console.log('res: ' + object.initValue);
                        fileContent += 'res: ' + object.initValue + '\r'
                        break;
                    case 'sub':
                        object.initValue = Number(returnValue(command[1])) - Number(returnValue(command[2]));
                        console.log('res: ' + object.initValue);
                        fileContent += 'res: ' + object.initValue + '\r'
                        break;
                    case 'mul':
                        object.initValue = Number(returnValue(command[1])) * Number(returnValue(command[2]));
                        console.log('res: ' + object.initValue);
                        fileContent += 'res: ' + object.initValue + '\r'
                        break;
                    case 'div':
                        if (Number(returnValue(command[2])) !== 0) {
                            object.initValue = Math.floor(Number(returnValue(command[1])) / Number(returnValue(command[2])));
                            console.log('res: ' + object.initValue);
                            fileContent += 'res: ' + object.initValue + '\r'
                        } else {
                            console.log('error');
                            fileContent += 'error\r';
                        }
                        break;
                    case 'set':
                        object.initValue = object[command[1]] = Number(returnValue(command[2]));
                        object[command[1]] = Number(returnValue(command[2]));
                        console.log('res: ' + object.initValue);
                        fileContent += 'res: ' + object.initValue + '\r'
                        break;
                    case 'error':
                        console.log('error')
                        fileContent += 'error\r';
                        break;
                    default:
                        console.log('error');
                        fileContent += 'error\r';
                        break;
                }
            }
        });
        fs.writeFile('1.big.out', fileContent, function () {
            console.log('Result saved in 1.big.out');
        })
    }, 2000);
});

returnValue = (valueToCheck) => {
    if (valueToCheck === '$') {
        return object.initValue;
    }
    if (isNaN(valueToCheck)) {
        if (object[valueToCheck] === undefined) {
            object[valueToCheck] = 0;
            return object[valueToCheck];
        } else {
            return object[valueToCheck];
        }
    } else {
        return valueToCheck;
    }
}