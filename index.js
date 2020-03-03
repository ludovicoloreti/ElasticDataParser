const fs = require('fs');
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("\nUSAGE:\n\tnode index.js [PEFRAME_JSON_FILE] [CUCKOO_JSON_FILE]\n")
  process.exit(0);
}

console.log('\nFiles to convert: ', args);

let json = []
let hash = '';

args.map(val => {
  let parsedJson = JSON.parse(fs.readFileSync(val).toString('utf8'));
  console.log()
  if (parsedJson['hashes'] !== undefined && parsedJson['hashes']['sha256'] !== undefined) hash = parsedJson['hashes']['sha256']
  json.push(JSON.stringify(parsedJson, null, 0));
})


const peframe = json[0]
const cuckoo = json[1]

formatDate = (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

const resultJSON = {
  "data_inserimento": formatDate(new Date()),
  "static_peframe": peframe,
  "dinamic_cuckoo": cuckoo,
  "filename": hash
}

const file = __dirname + '/dist/elastic_' + String(+new Date) + '.txt'


fs.writeFile(file, JSON.stringify(resultJSON, null, 0), function (err) {
  if (err) throw err;
  console.log("\tFile correctly saved => " + file + '\n');
});
