const remove_item = (result, id, all_items) => {
    let index;
    for(let i = 0; i<all_items.length; i++) {
        if(all_items[i][id] == result[0][id]) {
            index = i;
        }
    }
    all_items.splice(index,1);
    return all_items;
}

const remove_country = (result, id, all_items) => {
    let index;
    console.log(result);
    console.log(all_items);
    for(let i = 0; i<all_items.length; i++) {
        if(all_items[i] == result[0][id]) {
            index = i;
        }
    }
    all_items.splice(index,1);
    return all_items;
}

module.exports = {remove_item, remove_country};