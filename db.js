"use strict";
// In a real example this would be fetched from a database
module.exports.items = [
    {
        "id": "sauce-id",
        "name": "Awesome Sauce",
        "price": 100,
        "discountPercentage": 0,
        "discountAmount": 25,
    },
    {
        "id": "apples-id",
        "name": "Apples",
        "price": 200,
        "discountPercentage": 0.1,
        "discountAmount": 0,
    },
    {
        "id": "bike-id",
        "name": "A bike",
        "price": 1000,
        "discountPercentage": 0,
        "discountAmount": 0,
    },
        {
        "id": "boring-id",
        "name": "Something dull",
        "price": 10000,
        "discountPercentage": 0,
        "discountAmount": 0,
    },
]

module.exports.discounts = [
    {
        "idsNeeded" : ["boring-id","sauce-id"],
        "discountPercentage": 0,
        "discountAmount": 200,
    },
    {
        "idsNeeded" : ["boring-id","apples-id"],
        "discountPercentage": 0.1,
        "discountAmount": 0,
    },
]