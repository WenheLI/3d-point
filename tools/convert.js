const fs = require('fs');

const data = require('../data/pca_umap_outputs_with_metadata_Edgar')

data.map(it => {
    it['umap1'] = parseFloat(it['umap1'])
    it['umap2'] = parseFloat(it['umap2'])
})

dest = '../data/pca_umap_outputs_with_metadata_Edgar.json';
fs.writeFileSync(dest, JSON.stringify(data));