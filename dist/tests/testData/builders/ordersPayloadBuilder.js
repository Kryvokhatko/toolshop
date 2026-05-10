"use strict";
//Test Data Builder design pattern
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersPayloadBuilder = void 0;
class OrdersPayloadBuilder {
    payload = {
        current_page: 1,
        data: [],
        from: 1,
        last_page: 1,
        per_page: 15,
        to: 15,
        total: 0
    };
    withData(data) {
        this.payload.data = data;
        this.payload.total = data.length;
        //If there are no items (data.length === 0), set "to" to 0. Otherwise, set "to" to the number of items (data.length).
        this.payload.to = data.length === 0 ? 0 : data.length;
        this.payload.last_page = 1;
        return this;
    }
    ;
    withPage(page) {
        this.payload.current_page = page;
        return this;
    }
    ;
    withPerPage(perPage) {
        this.payload.per_page = perPage;
        return this;
    }
    ;
    build() {
        //...this.payload - creates a new object with all top-level fields copied from this.payload.
        //data: [...this.payload.data] - replaces data with a new array copy (so returned array is not the same array reference as internal one)
        return { ...this.payload, data: [...this.payload.data] };
    }
    ;
}
exports.OrdersPayloadBuilder = OrdersPayloadBuilder;
;
