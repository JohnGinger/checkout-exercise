"use strict";

const express = require('express');
const db = require('./db');
const app = express();
const serveStatic = require('serve-static');
const discountCalculator = require('./discountCalculator');
app.use(serveStatic(__dirname + '/public'))

app.get('/list-of-items', function (req, res) {
    res.send(db.items);
});

app.get('/sum', function (req, res) {
    let itemIds = req.query.items;
    if (itemIds == undefined || itemIds.split(",").length === 0) { // Using == to also test for null
        res.status(400).send();
        return;
    }

    let itemsIdList = itemIds.split(",");

    let items = itemsIdList.map(id => {
        return db.items.find(item => {
            return item.id === id
        })
    });

    if (items.some(item => item === undefined)) {
        res.status(404).send();
        return;
    }

    let summedDiscounts = discountCalculator.sumIndividualDiscounts(items);
    let total = summedDiscounts.total;
    let discount = summedDiscounts.discount;
    // This would be nicer to do as let {total, discount} = discountCalculator..., but that
    // doesn't work in all node versions

    // Any percentage discounts are applied to the total before any discounts are applied
    discount = discount + discountCalculator.getOverallDiscount(itemsIdList, total)

    res.send({
        "total": total,
        "discount": discount,
        "totalAfterDiscount": total - discount,
    });
});

module.exports = () => app;