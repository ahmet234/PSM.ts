"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs"); // use this library to read the CSV file.
var file = fs.readFileSync('PSMrawdata.csv', {
    encoding: 'utf-8'
}).split('\n'); // split each raw by new line into array
var mappedFile = file.map(function (line) {
    var row = line.split(',');
    return row.slice(1, 5).map(Number); // remove the sample numebr colmun by slice function
});
mappedFile = mappedFile.slice(1); // remove the first row (sample number	高い	安い	高すぎる	安すぎる)
mappedFile.pop(); // the function we used to read the CSV file keept reading one additional row, and this function is to remove it.
var very_cheap = [], cheap = [], expensive = [], very_exp = [];
for (var i = 0; i < 700; i++) { // initializing hestograms with zeros
    very_cheap.push(0);
    cheap.push(0);
    expensive.push(0);
    very_exp.push(0);
}
function countOccurrences() {
    var counter = {};
    for (var _i = 0, mappedFile_1 = mappedFile; _i < mappedFile_1.length; _i++) {
        var value = mappedFile_1[_i];
        very_cheap[value[3]]++;
        cheap[value[1]]++;
        expensive[value[0]]++;
        very_exp[value[2]]++;
    }
}
countOccurrences(); //calling the function 
for (var i = 1; i < 700; i++) { //cumulative sum (prefixsum array)
    cheap[i] += cheap[i - 1];
    very_cheap[i] += very_cheap[i - 1];
    expensive[i] += expensive[i - 1];
    very_exp[i] += very_exp[i - 1];
}
for (var i = 0; i < 700; i++) { // finding the percentage
    cheap[i] /= 36;
    cheap[i] = 1 - cheap[i]; //Inverse percentage
    very_cheap[i] /= 36;
    very_cheap[i] = 1 - very_cheap[i]; //Inverse percentage
    expensive[i] /= 36;
    very_exp[i] /= 36;
}
function findInterSection(firstArray, secondArray) {
    var result;
    for (var i = 0; firstArray[i] > secondArray[i]; i++, result = i)
        ;
    return result;
}
var intersec1 = findInterSection(cheap, expensive), intersec2 = findInterSection(cheap, very_exp), intersec3 = findInterSection(very_cheap, expensive), intersec4 = findInterSection(very_cheap, very_exp);
console.log("\u6700\u9AD8\u4FA1\u683C\uFF1A".concat(intersec2, "\n\u59A5\u5354\u4FA1\u683C : ").concat(intersec4, "\n\u7406\u60F3\u4FA1\u683C : ").concat(intersec1, "\n\u6700\u4F4E\u54C1\u8CEA\u4FDD\u8A3C\u4FA1\u683C : ").concat(intersec3)); //final results
