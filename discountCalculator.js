"use strict";

const db = require('./db');

let listContainsId = function (list, idNeeded) {
    return list.find(id => idNeeded === id) !== undefined
}

module.exports.sumIndividualDiscounts = function(items){
    let total = 0;
    let discount = 0;

    items.forEach(item => {
        total += item.price;
        discount += item.discountAmount + item.discountPercentage * item.price;
    })
    
    return {
        total: total,
        discount: discount,
    }
}

module.exports.getOverallDiscount = function (itemsIdList, total) {
    let discountAmount = 0;
    db.discounts.forEach(discount => {
        if (discount.idsNeeded.every(idNeededForDiscount => 
        listContainsId(itemsIdList, idNeededForDiscount))) {
            discountAmount += discount.discountAmount
                + discount.discountPercentage * total
        }
    })
    return discountAmount;
}



