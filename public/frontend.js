"use strict";

let makeRequest = function(url, cb) {
    let httpRequest;
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                cb(httpRequest.responseText)
            } else {
                alert('There was a problem with the request.');
            }
        }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
}

let getIds = function () {
    return viewModel.basket().map(item => item.id).join();
}

let updateTotals = function () {
    if (viewModel.basket().length > 0) {
        makeRequest('/sum?items=' + getIds(), function (data) {
            var result = JSON.parse(data);
            viewModel.total(formatCurrency(result.total));
            viewModel.discount(formatCurrency(result.discount));
            viewModel.totalAfterDiscount(formatCurrency(result.totalAfterDiscount))
        })
    } else {
        viewModel.total('');
        viewModel.discount('');
        viewModel.totalAfterDiscount('')
    }
}

let formatCurrency = function(value) {
    return "£" + (value / 100).toFixed(2);
}

let viewModel = new function AppViewModel() {
    var self = this;

    self.items = ko.observableArray([]);
    self.total = ko.observable();
    self.discount = ko.observable()
    self.totalAfterDiscount = ko.observable();

    self.addItemToBasket = function () {
        self.basket.push({
            "id": this.id,
            "name": this.name,
            "price": this.price,
        });
        updateTotals();
    }

    self.removeItemFromBasket = function () {
        self.basket.remove(this);
        updateTotals();
    }

    self.basket = ko.observableArray([]);

} ()

ko.applyBindings(viewModel);

makeRequest('/list-of-items', function (data) {
    viewModel.items(JSON.parse(data))
})