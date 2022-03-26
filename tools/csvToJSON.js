const csv = require('csv-parser');
const fs = require('fs');

const convertFile = (fileName, dest, process) => {
    return new Promise((resolve, reject) => {
        let data = [];
        fs.createReadStream(fileName)
        .pipe(csv())
        .on('data', (it) => process(it, data))
        .on('end', () => {
            fs.writeFileSync(dest, JSON.stringify(data));
            resolve(data);
        });
    });
}

const main = () => {
    convertFile('./raw_data/cytof_data.csv', './data/cytof_data.json', (it, data) => {
        const keys = Object.keys(it).filter(key => key !== '');
        const temp = {}
        temp['id'] = it[''];
        for (const key of keys) {
                temp[key] = parseFloat(it[key]);
        }
        data.push(temp);
    }).then(() => {
        convertFile('./raw_data/pca_3dumap_outputs_with_metadata.csv', './data/pca_3dumap_outputs_with_metadata.json', (it, data) => {
            const temp = {}
            temp['id'] = it['File_Name'];
            temp['umap1'] = parseFloat(it['umap1']);
            temp['umap2'] = parseFloat(it['umap2']);
            temp['umap3'] = parseFloat(it['umap3']);
            data.push(temp);
        })
    });
}

main();