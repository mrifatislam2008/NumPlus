const inputBox =
document.getElementById("inputBox");

const outputBox =
document.getElementById("outputBox");

const count =
document.getElementById("count");

function updateCount(){

count.innerText =
outputBox.value
.split(/\r?\n/)
.filter(Boolean)
.length;

}

async function pasteClipboard(){

try{

const text =
await navigator.clipboard.readText();

inputBox.value = text;

}catch{

alert("Clipboard permission denied");

}

}

function addPrefix(){

const result =
inputBox.value
.split(/\r?\n/)
.map(x=>x.trim())
.filter(Boolean)
.map(x=>x.startsWith("+")?x:"+"+x)
.join("\n");

outputBox.value = result;

updateCount();

}

function removeDuplicates(){

const unique =
[...new Set(
outputBox.value
.split(/\r?\n/)
.filter(Boolean)
)];

outputBox.value =
unique.join("\n");

updateCount();

}

function copyOutput(){

navigator.clipboard.writeText(
outputBox.value
);

alert("Output copied");

}

function download(content,name,type){

const blob =
new Blob([content],{type});

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download = name;

a.click();

}

function downloadTXT(){

download(
outputBox.value,
"numbers.txt",
"text/plain"
);

}

function downloadCSV(){

download(
outputBox.value.replace(/\n/g,","),
"numbers.csv",
"text/csv"
);

}

function downloadJSON(){

const data =
outputBox.value
.split(/\r?\n/)
.filter(Boolean);

download(
JSON.stringify(data,null,2),
"numbers.json",
"application/json"
);

}

function downloadXLSX(){

const rows =
outputBox.value
.split(/\r?\n/)
.filter(Boolean)
.map(x=>[x]);

const ws =
XLSX.utils.aoa_to_sheet(rows);

const wb =
XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
wb,
ws,
"Numbers"
);

XLSX.writeFile(
wb,
"numbers.xlsx"
);

}

document
.getElementById("fileInput")
.addEventListener("change",e=>{

const file =
e.target.files[0];

if(!file) return;

if(file.name.endsWith(".xlsx")){

const reader =
new FileReader();

reader.onload = evt=>{

const data =
new Uint8Array(
evt.target.result
);

const wb =
XLSX.read(
data,
{type:"array"}
);

const sheet =
wb.Sheets[
wb.SheetNames[0]
];

const rows =
XLSX.utils.sheet_to_json(
sheet,
{header:1}
);

inputBox.value =
rows.flat().join("\n");

};

reader.readAsArrayBuffer(file);

}else{

const reader =
new FileReader();

reader.onload =
e=>inputBox.value =
e.target.result;

reader.readAsText(file);

}

});

const canvas =
document.getElementById("matrix");

const ctx =
canvas.getContext("2d");

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;

const chars =
"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const fontSize = 14;

const columns =
canvas.width/fontSize;

const drops = [];

for(let i=0;i<columns;i++)
drops[i]=1;

function draw(){

ctx.fillStyle =
"rgba(0,0,0,0.05)";

ctx.fillRect(
0,0,
canvas.width,
canvas.height
);

ctx.fillStyle =
"#00ff66";

ctx.font =
fontSize+"px monospace";

for(let i=0;i<drops.length;i++){

const text =
chars[Math.floor(
Math.random()*chars.length
)];

ctx.fillText(
text,
i*fontSize,
drops[i]*fontSize
);

if(
drops[i]*fontSize>
canvas.height &&
Math.random()>0.975
){
drops[i]=0;
}

drops[i]++;

}

}

setInterval(draw,35);
