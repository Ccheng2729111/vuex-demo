import shop from '../../api'
import { PRODUCTS } from '../mutation-types'

const state = {
    all: []
}

const getters = {}

const actions = {
    getAllProducts({ commit }) {
        //模拟异步操作 放在actions里面然后调用commit来调用mutations里面的方法来改变state中的数据
        shop.getProducts(products => {
            commit(PRODUCTS.SET_PRODUCTS, products)
        })
    }
}

const mutations = {
    //mutations中的将参数直接赋值给state中的all变量
    [PRODUCTS.SET_PRODUCTS](state, products) {
        state.all = products
    },
    //根据参数来判断当前的all数据中是否有该id的数据，如果有的话直接将当前的产品的inventory数量减1
    [PRODUCTS.DECREMENT_PRODUCT_INVENTORY](state, { id }) {
        const product = state.all.find(product => product.id == id)
        product.inventory = product.inventory - product.canAdd
        product.canAdd = 0
    },
    //减一的时候调用的mutation
    [PRODUCTS.PRODUCT_ADDCANNUMBER](state, id) {
        const product = state.all.find(product => product.id == id)
        product.canAdd++
    },
    //加一的时候调用的mutation
    [PRODUCTS.PRODUCT_DESCANNUMBER](state, id) {
        const product = state.all.find(product => product.id == id)
        product.canAdd--
    }
}

//将所有集合成一个对象返回出去，并且加上参数namespaced 是true 
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}