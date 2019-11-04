const _products = [
    { "id": 1, "title": "华为 mate 20", "price": 3999, "inventory": 2, "canAdd": 0 },
    { "id": 2, "title": "小米9", "price": 2999, "inventory": 0, "canAdd": 0 },
    { "id": 3, "title": "OPPO R17", "price": 2999, "inventory": 5, "canAdd": 0 },
]

export default {
    getProducts(cb) {
        setTimeout(() => cb(_products), 100)
    },

    buyProducts(prodducts, cb, errcb) {
        setTimeout(() => {
            Math.random() > 0.5 ? cb() : errcb()
        }, 100)
    }
}