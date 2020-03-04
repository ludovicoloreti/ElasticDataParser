const fs = require("fs");
const args = process.argv.slice(2);
const path = require("path");

if (args.length === 0) {
  console.log(
    "\nUSAGE:\n\tnode index.js [PEFRAME_JSON_FILE] [CUCKOO_JSON_FILE]\n"
  );
  process.exit(0);
}

console.log("\nFiles to convert: ", args);

let json = [];
let hash = "";
let filename = "";

args.map(val => {
  let parsedJson = JSON.parse(fs.readFileSync(val).toString("utf8"));
  if (parsedJson["hashes"] !== undefined) {
    if (parsedJson["hashes"]["sha256"] !== undefined) {
      hash = parsedJson["hashes"]["sha256"];
      console.log("\n\t∞∞ HASH (sha256):\t" + hash);
    }
    if (parsedJson["filename"] !== undefined) {
      filename = path.basename(String(parsedJson["filename"]).trim());
      console.log("\t∞∞ FILENAME:\t\t" + filename);
    }
  }
  json.push(JSON.stringify(parsedJson, null, 0));
});

const peframe = json[0];
const cuckoo = json[1];

getDate = () => {
  return new Date().toISOString();
};

const resultJSON = {
  data_inserimento: getDate(),
  static_peframe: peframe,
  dinamic_cuckoo: cuckoo,
  filename: hash
};

const file = __dirname + "/dist/elastic_" + String(+new Date()) + ".txt";

fs.writeFile(file, JSON.stringify(resultJSON, null, 0), function(err) {
  if (err) throw err;
  console.log("\nFile correctly saved => " + file + "\n");
});
