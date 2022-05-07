const fs = require('fs');

const raw_data = JSON.parse(fs.readFileSync('2d-data.json').toString());
let results = raw_data.map((it) => {
    return {
        'id': it['id'],
        'num_raw': parseFloat(it['PC1']),
        'cat_raw': it['gender']
    }
});


const cat_unique = new Set(results.map((it) => {
    return it['cat_raw']
}));

const cat_mapper = {}

let step = 0;
cat_unique.forEach((it) => {
    cat_mapper[it] = step;
    cat_mapper[step] = it;
    step += 1;
});

const num_arr = results.map((it) => it['num_raw']);
const num_max = Math.max(...num_arr);
const num_min = Math.min(...num_arr);

const scale = (num) => {
    return (num - num_min) / (num_max - num_min)
}

results = results.map((it) => {
    return {
        'num': scale(it['num_raw']),
        'cat': cat_mapper[it['cat_raw']],
        'id': it['id'],
    }
});

results = {
    'data': results,
    'cat_mapper': cat_mapper,
}

fs.writeFileSync('./processed_data.json', JSON.stringify(results));