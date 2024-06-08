const remove_object_item = (result, id, all_items) => {
    let index;
    let all_items_copy = [...all_items];
    for(let i = 0; i<all_items_copy.length; i++) {
        if(all_items_copy[i][id] == result[0][id]) {
            index = i;
        }
    }
    all_items_copy.splice(index,1);
    return all_items_copy;
}

const remove_array_item = (result, id, all_items) => {
    let index;
    let all_items_copy = [...all_items];
    for(let i = 0; i<all_items_copy.length; i++) {
        if(all_items_copy[i] == result[0][id]) {
            index = i;
        }
    }
    all_items_copy.splice(index,1);
    return all_items_copy;
}

module.exports = {remove_object_item, remove_array_item};