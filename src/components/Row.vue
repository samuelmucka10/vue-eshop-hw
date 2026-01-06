<style>
    .product-scroll {
        display: flex;
        padding: 24px;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .product-scroll>* {
        flex-grow: 0;
        flex-shrink: 0;
    }

    h1 {
        padding: 0;
        margin: 0;
        padding-top: 20px;
        padding-left: 24px;
        margin-bottom: -20px;
    }
</style>

<template>
    <h1>{{ category_title }}</h1>
    <div class="product-scroll">
        <ProductTile v-for="item in products" :key="item.id"
            :item = item
        />
    </div>
</template>

<script setup>
    import ProductTile from "/src/components/Product.vue";
</script>

<script>
    export default {
        name: "ProductRow",
        props: {
            category: Number,
            category_title: String,
            products: Array,
        }
    };
</script>