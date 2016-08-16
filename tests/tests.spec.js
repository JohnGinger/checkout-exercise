/* eslint-env mocha */

"use strict";

const supertest = require("supertest");
const expect = require("chai").expect;
const server = require("../server");
const db = require("../db");

describe("HTTP Server", () => {
    let app, request;

    before(() => app = server());
    before(() => request = supertest(app));

    describe("GET /list-of-items", () => {
        const URL = "/list-of-items";
        it("Returns a list of all the items", (done) => {
            request.get(URL)
                .expect(200)
                .expect((res) => {
                    expect(res.body).to.be.an("array");
                    expect(res.body).to.have.length(db.items.length);
                    expect(res.body).to.deep.equal(db.items);
                })
                .end(done)
        });
    });

    describe("GET /sum", () => {
        const URL = "/sum";
        it("Returns 400 if no items are supplied", (done) => {
            request.get(URL)
                .expect(400)
                .end(done)
        });

        it("Returns 404 if an object in the list is not recognised", (done) => {
            request.get(`${URL}?items=1,2,not-real`)
                .expect(404)
                .end(done)
        });

        it("Returns json in the correct format if valid items supplied", (done) => {
            let validIds = ["apples-id", "sauce-id"];
            let expectedResult = {
                "total": 300,
                "discount": 45,
                "totalAfterDiscount": 255,
            }
            request.get(`${URL}?items=${validIds.join()}`)
                .expect((res) => {
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.deep.equal(expectedResult);
                })
                .end(done)
        });

        it("Has no discount if no discounted items", (done) => {
            let validIds = ["bike-id", "boring-id"];
            let expectedResult = {
                "total": 11000,
                "discount": 0,
                "totalAfterDiscount": 11000,
            }
            request.get(`${URL}?items=${validIds.join()}`)
                .expect((res) => {
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.deep.equal(expectedResult);
                })
                .end(done)
        });

        it("Correctly applies a fixed discount", (done) => {
            let validIds = ["sauce-id"];
            let expectedResult = {
                "total": 100,
                "discount": 25,
                "totalAfterDiscount": 75,
            }
            request.get(`${URL}?items=${validIds.join()}`)
                .expect((res) => {
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.deep.equal(expectedResult);
                })
                .end(done)
        });

        it("Correctly applies a fixed discount with repeated items", (done) => {
            let validIds = ["sauce-id,sauce-id"];
            let expectedResult = {
                "total": 200,
                "discount": 50,
                "totalAfterDiscount": 150,
            }
            request.get(`${URL}?items=${validIds.join()}`)
                .expect((res) => {
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.deep.equal(expectedResult);
                })
                .end(done)
        });

        it("Correctly applies a percentage discount", (done) => {
            let validIds = ["apples-id"];
            let expectedResult = {
                "total": 200,
                "discount": 20,
                "totalAfterDiscount": 180,
            }
            request.get(`${URL}?items=${validIds.join()}`)
                .expect((res) => {
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.deep.equal(expectedResult);
                })
                .end(done)
        });

        it("Correctly applies an overall percentage discount", (done) => {
            let validIds = ["apples-id", "boring-id"];
            let expectedResult = {
                "total": 10200,
                "discount": 1040,
                "totalAfterDiscount": 9160,
            }
            request.get(`${URL}?items=${validIds.join()}`)
                .expect((res) => {
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.deep.equal(expectedResult);
                })
                .end(done)
        });

        it("Correctly applies an overall fixed discount", (done) => {
            let validIds = ["sauce-id", "boring-id"];
            let expectedResult = {
                "total": 10100,
                "discount": 225,
                "totalAfterDiscount": 9875,
            }
            request.get(`${URL}?items=${validIds.join()}`)
                .expect((res) => {
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.deep.equal(expectedResult);
                })
                .end(done)
        });

        it("Correctly applies multiple overall discounts", (done) => {
            let validIds = ["sauce-id", "boring-id", "apples-id"];
            let expectedResult = {
                "total": 10300,
                "discount": 1275,
                "totalAfterDiscount": 9025,
            }
            request.get(`${URL}?items=${validIds.join()}`)
                .expect((res) => {
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.deep.equal(expectedResult);
                })
                .end(done)
        });

        it("Correctly applies multiple overall discounts with repeated items", (done) => {
            let validIds = ["sauce-id", "boring-id", "apples-id", "sauce-id", "sauce-id"];
            let expectedResult = {
                "total": 10500,
                "discount": 1345,
                "totalAfterDiscount": 9155,
            }
            request.get(`${URL}?items=${validIds.join()}`)
                .expect((res) => {
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.deep.equal(expectedResult);
                })
                .end(done)
        });
    });

});
