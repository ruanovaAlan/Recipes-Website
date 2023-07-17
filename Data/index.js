const XLSX = require('xlsx');
const fs = require('fs');

const excel_json = () => {
    const file = XLSX.readFile("Data/recetas.xlsx");
    const fileData = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
    const data = JSON.stringify(fileData);
    //const data = JSON.stringify(info, null, 4); // stringify with tabs inserted at each level

    fs.writeFile('recetas.json', data, (err) => {
        if (err) throw err;
        console.log("File create successfully!");
    })
}

excel_json();