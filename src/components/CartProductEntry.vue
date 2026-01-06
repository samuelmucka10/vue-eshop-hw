<style>
    .cart-entry, .cart-entry * {
        user-select: none;
        overflow: visible;
    }

    .cart-entry {
        border: 0px solid grey;
        border-top-width: 1px;
        padding: 6px 0px
    }

    .cart-entry:first-child {
        border-top-width: 0px
    }

    .cart-entry-title {
        font-size: small;
        margin: auto 0px;
        margin-left: 10px;
        flex-grow: 1;
    }

    .cart-entry-top {
        height: 50px;
        display: flex;
        justify-content: center;
    }

    .cart-entry-top > img {
        display: block; 
        aspect-ratio: 1;
        object-fit: contain;
        height: auto;
        height: 300%;
        max-height: 100%;
    }

    .cart-entry-bottom {
        margin-top: 6px;
        height: 24px;
        display: flex;
        align-items: center;
    }

    .cart-entry-bottom > input {
        height: 100%;
        width: 50px;
        border: 1px gray solid;
        border-width: 1px 0px;
        border-radius: 0px;
        text-align: center;
    }

    .cart-entry-bottom > button {
        height: 100%;
        padding: 0px;
        margin: 0px;
        aspect-ratio: 1;
        line-height: 0px;
        text-align: center;
        border: 1px gray solid ;
        border-radius: 4px;
        cursor: pointer;
    }

    .cart-entry-bottom > .counter-increase {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
    }

    .cart-entry-bottom > .counter-decrease {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
    }

    .cart-entry-bottom > .pi-trash {
        margin-left: 4px;
        color: #fff;
        border-width: 0px;
        background-color: var(--red);
    }

    .cart-entry-bottom > .pi-trash:hover {
        background-color: var(--red-hover);
    }
    
    .cart-entry-price {
        text-align: right;
        flex-grow: 1;
    }



</style>

<template>
    <div class="cart-entry">
        <div class="cart-entry-top">
            <img :src="item.img"/>
            <div class="cart-entry-title">{{ item.title }}</div>
        </div>
        <div class="cart-entry-bottom">
            <button @click="item.cart_counter+=item.cart_counter<99" class="counter-increase">+</button>
            <input type="text" inputmode="numeric" :value="item.cart_counter" 
                @blur="event => {
                    console.log(event.target.value)
                    if (event.target.value==='') event.target.value = 0;
                    let match = String(event.target.value).match('\\d+')
                    console.log(match)
                    let n = Number(match && match[0] || item.cart_counter)
                    if (n<100 && n>=0)
                        item.cart_counter = n
                    event.target.value = item.cart_counter
                }"
            />
            <button @click="item.cart_counter--" class="counter-decrease">-</button>
            <button @click="item.cart_counter=0" class="pi pi-trash remove-from-cart"></button>
            <span class="cart-entry-price"> {{ stringifyEur(item.eur) }} </span>
        </div>
    </div>

</template>

<script setup>
    import { stringifyEur } from "../utils"
</script>


<script>
    export default {
        name: "CartProductEntry",
        props: {
            item: Object,
        }
    };
</script>