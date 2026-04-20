//Test Data Builder design pattern

type InvoiceListPayload = {
    current_page: number;
    data: Array<Record<string, unknown>>;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
};

export class OrdersPayloadBuilder {
    private payload: InvoiceListPayload = {
        current_page: 1,
        data: [],
        from: 1,
        last_page: 1,
        per_page: 15,
        to: 15,
        total: 0
    };

    withData(data: Array<Record<string, unknown>>) {
        this.payload.data = data;
        this.payload.total = data.length;
        //If there are no items (data.length === 0), set "to" to 0. Otherwise, set "to" to the number of items (data.length).
        this.payload.to = data.length === 0 ? 0 : data.length;
        this.payload.last_page = 1;
        return this;
    };

    withPage(page: number) {
        this.payload.current_page = page;
        return this;
    };

    withPerPage(perPage: number) {
        this.payload.per_page = perPage;
        return this;
    };

    build(): InvoiceListPayload {
        //...this.payload - creates a new object with all top-level fields copied from this.payload.
        //data: [...this.payload.data] - replaces data with a new array copy (so returned array is not the same array reference as internal one)
        return { ...this.payload, data: [...this.payload.data]};
    };    
};