import shop from '../../api'
import { CART, PRODUCTS } from '../mutation-types'
// import products from './products';

const state = {
    items: [],
    checkoutStatus: null
}

const getters = {
    //设置getters
    cartProdcuts: (state, getters, rootState) => {
        //获取state中的items并且进行遍历
        return state.items.map(({ id, quantity }) => {
            //找到rootState 公共store中products的all 是否有items中的id 如果有就直接返回一个新的对象，包含title,price,quantity三个字段
            const product = rootState.products.all.find(product => product.id == id)
            return {
                title: product.title,
                price: product.price,
                quantity
            }
        })
    },
    cartTotalPrice: (state, getters) => {
        //获取getters中cartProducts的数据并进行rescue方法计算总价格
        return getters.cartProdcuts.reduce((total, product) => {
            //单价*数量
            return total + product.price * product.quantity
        }, 0)
    }
}

const actions = {
    checkout({ commit, state }, procuts) {
        //暂存items数据
        const saveCartItems = [...state.items]
        //首先先去清空已经有的status
        commit(CART.SET_CHECKOUT_STATUS, null)
        //直接清空state中的items
        commit(CART.SET_CART_ITEMS, { items: [] })
        //调用接口中的购买接口，传入成功的cb以及失败的cb
        //如果成功了直接清空购物车的items
        //如果失败了返回错误信息，并且将暂存的数据重新赋值给items
        shop.buyProducts(
            procuts,
            () => commit(CART.SET_CHECKOUT_STATUS, 'successful'),
            () => {
                commit(CART.SET_CHECKOUT_STATUS, 'failed')
                commit(CART.SET_CART_ITEMS, { items: saveCartItems })
            }
        )
    },
    addProductToCart({ state, commit }, product) {
        //添加的时候先清空状态
        commit(CART.SET_CHECKOUT_STATUS, null)
        //判断添加的当前product的数量如果大于0
        if (product.inventory > 0) {
            //找到当前是否有这个产品的存在
            const cartItem = state.items.find(item => item.id == product.id)
            if (!cartItem) {
                //如果没有，就调用mutation中的存储方法。
                commit(CART.PUSH_PRODUCT_TO_CART, { id: product.id, canAdd: product.canAdd })
            } else {
                //如果有的话就增加items中对应数据的quantity数量就可以了
                commit(CART.INCREMENT_ITEM_QUANTITY, cartItem)
            }
            //跨modules调用products模块的减少产品的数量
            commit(`products/${PRODUCTS.DECREMENT_PRODUCT_INVENTORY}`, { id: product.id }, { root: true })
        }
    }
}

const mutations = {
    //添加购物车没有的数据
    [CART.PUSH_PRODUCT_TO_CART](state, { id, canAdd }) {
        //根据传来的总共添加的数量，直接赋值给quantity
        state.items.push({
            id,
            quantity: canAdd
        })
    },
    //重新赋值购物车items的数据
    [CART.SET_CART_ITEMS](state, { items }) {
        state.items = items
    },
    //添加items中数量quantity
    [CART.INCREMENT_ITEM_QUANTITY](state, { id }) {
        const cartItem = state.items.find(item => item.id == id)
        //这边如果是添加过的直接quantity + canAdd
        cartItem.quantity = cartItem.quantity + cartItem.canAdd
    },
    //修改当前订单的状态status
    [CART.SET_CHECKOUT_STATUS](state, status) {
        state.checkoutStatus = status
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}