import * as fs from 'fs'; // use this library to read the CSV file.
const file = fs.readFileSync('PSMrawdata.csv',{
  encoding : 'utf-8'
}).split('\n'); // split each raw by new line into array

let mappedFile = file.map((line) => { // map through each line and split it by (,) into array
  const row = line.split(','); 
  return row.slice(1,5).map(Number); // remove the sample numebr colmun by slice function
});

 mappedFile = mappedFile.slice(1) // remove the first row (sample number	高い	安い	高すぎる	安すぎる)
 mappedFile.pop(); // the function we used to read the CSV file keept reading one additional row, and this function is to remove it.
 let very_cheap : number[] =[] , cheap : number[] =[] , expensive : number[] =[] , very_exp : number[] =[];

 for (let i = 0 ; i < 700; i++){ // initializing hestograms with zeros
  very_cheap.push(0);
  cheap.push(0);
  expensive.push(0);
  very_exp.push(0);
}
function countOccurrences(): void { // counter function to check for each value how many times it appeared
  const counter: { [key: string]: number } = {};

  for (const value of mappedFile) {

    very_cheap[value[3]]++;
    cheap[value[1]]++;
    expensive[value[0]]++;
    very_exp[value[2]]++;

  }
}
countOccurrences() //calling the function 

for ( let i = 1 ; i < 700; i++){ //cumulative sum (prefixsum array)
  cheap[i]+=cheap[i-1]
  very_cheap[i]+=very_cheap[i-1]
  expensive[i]+=expensive[i-1]
  very_exp[i]+=very_exp[i-1]
}
for(let i = 0; i < 700; i++){ // finding the percentage
  cheap[i]/=36
  cheap[i]=1-cheap[i] //Inverse percentage
  very_cheap[i]/=36
  very_cheap[i]=1-very_cheap[i] //Inverse percentage
  expensive[i]/=36
  very_exp[i]/=36
}
function findInterSection (firstArray, secondArray): number { // finding intersection between each pair of function.
  let result ;
  for ( let i = 0 ; firstArray[i] > secondArray[i]; i++, result = i);
  return result
}

let intersec1 =findInterSection(cheap,expensive) , intersec2 = findInterSection(cheap,very_exp) , 
intersec3 = findInterSection (very_cheap,expensive)  , intersec4 = findInterSection(very_cheap,very_exp) ;

console.log(`最高価格：${intersec2}\n妥協価格 : ${intersec4}\n理想価格 : ${intersec1}\n最低品質保証価格 : ${intersec3}`); //final results
