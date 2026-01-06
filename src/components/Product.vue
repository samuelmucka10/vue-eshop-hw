<style>
    .tile, .tile * {
        user-select: none;
        overflow: visible;
    }
    .tile {
        --tile-unit: 180px;
        --bottom-height: 30px;
        height: calc(var(--tile-unit) * 2);
        width: var(--tile-unit);
        max-width: var(--tile-unit);
        min-width: var(--tile-unit);
        /* border: 1px solid black; */
        box-shadow: #000f;
        margin: 10px;
        padding: 10px;
        display: inline-block;
        overflow: hidden;

        box-shadow: 0px 0px 15px -5px #000f;
        transition: scale .2s;
    }

    .tile:hover {
        scale: 1.05;
        cursor: pointer;
    }

    .tile img {
        display: block; 
        margin: auto; 
        aspect-ratio: 1;
        object-fit: contain;
        height: auto;
        width: 300%;
        max-width: 100%;
    }
    
    .image-container {
        width: 100%;
        height: var(--tile-unit);
    }
    
    .rating-container {
        padding-top: 5px;
        --rating-value: 10%;
        overflow: visible;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1em;

    }
    
    .rating-container .stars {
        overflow: visible;
        display: block;
        line-height: 1;

        letter-spacing: -2px;
        text-align: right;

        /* https://stackoverflow.com/questions/8384751/css-text-gradient */
        /** i know this trick for progress bars, but i was unsure of how to apply a gradient to text */
        background: linear-gradient(to right, #000 var(--rating-value), #999 0%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .rating-count {
        text-align: left;
        font-size: xx-small;
        --rating-count-width: 30px;
        /* max-width: var(--rating-count-width);
        min-width: var(--rating-count-width);
        width: var(--rating-count-width); */
    }

    .rating-container span:not(.stars):not(.stars-container) {
        flex-grow: 1;
    }

    .rating-written {
        text-align: center;
        font-size: x-small;
        text-align: center;
        padding: 5px;
    }

    .rating-container.hide {
        color: #0000;
    }

    .title {
        font-size: small;
        line-height: 110%;
        padding-bottom: 5px;
        padding-top: 5px;
        text-align: center;
        overflow: visible;
    }
    
    .desc {
        font-size: xx-small;
        color: #aaa;
        line-height: 110%;
        overflow: hidden;
    }

    .top {
        max-height: calc(100% - var(--bottom-height));
        min-height: calc(100% - var(--bottom-height));
        height: calc(100% - var(--bottom-height));
        overflow: hidden;
        mask-image: linear-gradient(to bottom, #000f 0%, #000f 90%, #0000 100%);
    }

    .bottom {
        max-height: var(--bottom-height);
        min-height: var(--bottom-height);
        height: var(--bottom-height);
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
    }
    
    .add-to-cart {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        background-color: var(--green);
        color: #fff;
        border-radius: 4px;
        font-weight: bold;
    }

    .enable-counter .add-to-cart {
        grid-template-columns: 1fr auto;
    }
    .enable-counter .add-to-cart-icon {
        grid-column: 2;
    }
    .enable-counter .price {
        grid-column: 1;
    }

    .bottom > * {
        font-weight: bold;
        height: 100%;
        color: #fff;
        border: none;
        border-radius: 4px;
    }

    .add-to-cart:hover {
        background-color: var(--green-hover);
        cursor: pointer;
    }

    .add-to-cart-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        grid-column: 3;
        justify-self: right;
    }

    .enable-counter .remove-from-cart {
        aspect-ratio: 1/1;
        background-color: var(--red);
        display: block;
    }

    .enable-counter .counter {
        aspect-ratio: 1/1;
        color: #000;
        display: flex;
        justify-content: center;
        align-items: center;

        cursor: default;
        background-color: #fff;
    }

    .remove-from-cart, .counter {
        display: none
    }

    .remove-from-cart:hover {
        background-color: var(--red-hover);
        cursor: pointer;
    }


    .price {
        grid-column: 2;
        justify-self: center;
    }

    
    
    


</style>

<template>
    <div class="tile">
        <div class="top">
            <div class="image-container">
                <img :src="item.img"/>
            </div>
            <div :class='["rating-container",{"hide":!item.rating}]' :style="`--rating-value:${item.rating/5*100}%`">
                <span></span>
                <span class="stars-container"><span class="stars">{{ "★".repeat(5) }}</span></span>
                <span class="rating-written">{{ Math.floor(item.rating/1) }},{{ Math.floor(item.rating*10%10) }}</span><span class="rating-count">{{ item.rating_count?item.rating_count+"x":"" }}</span>
            </div>
            <div class="title">{{ item.title }}</div>
            <div class="desc">{{ item.desc }}</div>
        </div>
        <div :class="['bottom',{'enable-counter':item.cart_counter>0}]">
            <button class="remove-from-cart" @click="item.cart_counter-=item.cart_counter>0">
                <span class="add-to-cart-icon"><span class="pi pi-shopping-cart"></span>-</span>
            </button>
            <span class="counter">
                {{ item.cart_counter }}
            </span>
            <button class="add-to-cart" @click="item.cart_counter+=item.cart_counter<99">
                <span class="price">{{stringifyEur(item.eur)}}</span>
                <span class="add-to-cart-icon"><span class="pi pi-shopping-cart"></span>+</span>
            </button>
        </div>
    </div>

</template>

<script setup>
    import { stringifyEur } from "../utils"
</script>

<script>
    export default {
        name: "ProductTile", 
        props: {
            item: Object, 
        }
    };
</script>


