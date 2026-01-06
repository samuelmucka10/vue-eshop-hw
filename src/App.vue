
<template>
    
    <div class="container">
        <header class="topbar">
            <span class="topbar-name"><span>aazl</span>.sk</span>

            <span style="flex-grow: 1;"></span>

            <button class="topbar-cart" @click="show_cart=true">
                <i class="pi pi-shopping-cart"></i>
                <span class="cart-counter-container"><span :class='["cart-counter",{"cart-above-99":total_cart_count>99},{"cart-above-9":total_cart_count>9},{"cart-empty":total_cart_count==0}]'>{{total_cart_count>99?"+":""}} {{Math.min(total_cart_count,99)}}</span></span>
            </button>
            
        </header>
        <div :class='["main",{"show-all-products":show_all_products}]'>
            <main>

                <h1 class="all-products-link hide-on-all" @click="show_all_products=true">Všetky produkty <i class="pi pi-arrow-right"></i></h1>
                <h1 class="all-products-link hide-on-not-all" @click="show_all_products=false"><i class="pi pi-arrow-left"></i> Naspäť</h1>


                <Dialog v-model:visible="show_thankyou" header="Ďakujeme" modal style="min-width: 400px;">
                    <p>Ďakujeme za nákup :)</p>
                    <i v-if="show_thankyou>3000">Dokopy to bude {{ show_thankyou }} €</i>
                </Dialog>


                <span class="hide-on-all" v-if="!show_all_products">
                    <ProductRow v-for="(item,index) in product_data.categories.filter(v=>v.type=='main_page'||v.main_page)" :key="item.id"
                        :category_title = item.title
                        :category = index
                        :products = "product_data.products.filter(v=>(v.category).includes(index))"
                    />
                </span>
                


                
                <div class="all-products hide-on-not-all" v-if="show_all_products">
                    <div class="filter-pane">
                        <div class="filter-tile">
                            <span>Rozsah ceny</span>
                            <span><Slider v-model="filtering.price_range" range :min="filtering.limit_price_range[0]" :max="filtering.limit_price_range[1]"/></span>
                            <span>{{ filtering.price_range.map(v=>v+" €").join(" - ") }}</span>

                            <!-- 
                            <span>{{ filtering.price_range[0] }} € - {{ filtering.price_range[1] }} €</span> 
                             one is easier, and the other is prettier :)
                            -->
                        </div>

                        <div class="filter-tile" style="--tile-width-mul: 2">
                            <span>Kategória produktu</span>
                            <span>
                                <Select v-model="filtering.selected_category" style="width: 100%; text-align: left" :options="filtering.categories" optionLabel="title" placeholder="Vyberte kategóriu..."></Select>
                            </span>
                        </div>

                        <div class="filter-tile">
                            <span>Značky</span>
                            <span class="checkmark-list">
                                <span v-for="brand in filtering.brands" :key="brand.vue_id">
                                    <input v-model="brand.selected" :id="'checkmark-brand-'+brand.id" type="checkbox">
                                    <label :for="'checkmark-brand-'+brand.id">{{ brand.title }}</label> 
                                    <br>
                                </span>
                            </span>
                        </div>
                    </div>

                    <input class="filter-pane search-bar" v-model="filtering.search" :placeholder="String.fromCharCode(0xe908)+' Hladať...'">

                    <div class="all-products-container">
                        <ProductTile 
                            v-for="item in search_results"
                            :key="item.id"
                            :item = item
                        />
                    </div>
                    <i class="empty-search-results" v-if="search_results.length==0">Nech hľadám ako hľadám, čo chete som nenašiel...</i>
                </div>
        
                
                <div style="display:flex">
                    <Drawer v-model:visible="show_cart" header="Váš košík" position="left">
                        <span :class="[{'cart-empty':total_cart_count==0}]">
                            <CartEntry v-for="item in product_data.products.filter(v=>v.cart_counter>0)" :key="item.cart_id"
                                :item = item
                            />
                            <button class="add-to-cart cart-buy" 
                                @click="
                                    show_thankyou=product_data.products.reduce((a,b)=>a+b.cart_counter*b.eur,0);
                                    product_data.products.forEach(v=>v.cart_counter=0);
                                    show_cart=false
                                ">Kúpiť</button>
                            <span class="empty-message">Som taký prázdny...</span>
                        </span>
                    </Drawer>
                </div>
            </main>
            <footer>
                
            </footer>
        </div>
    </div>
</template>

<style>
    body,html,.container,#app {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
        overflow: hidden;

        --green: #4a4;
        --green-hover: #7b7;
        --red: #c66;
        --red-hover: #e88;
    }

    button {
        transition: background-color .2s;
    }

    .topbar {
        --top-bar-height: 50px;
        height: var(--top-bar-height);
        max-height: var(--top-bar-height);
        min-height: var(--top-bar-height);
        background-color: white;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .topbar-name {
        font-size: xx-large;
        font-weight: 900;
        font-style: italic;
        padding-left: 10px;
        user-select: none;
    }

    .topbar-cart {
        height: 50px;
        width: 50px;
        display: grid;
        justify-items: center;
        align-content: center;
        background: none;
        border: none;

        cursor: pointer;
    }

    .topbar-cart>i {
        font-size: 2em;
    }

    .topbar-name>span {
        font-size: 1.2em;
        color: #093266;
    }

    .container {
        display: flex;
        flex-direction: column;
    }

    .main {
        overflow: scroll;
        flex-direction: column;
        height: 100%;
    }

    .main>* {
        flex: 0 0 auto
    }

    .cart-buy {
        display: block;
        border: none;
        width: 100%;
        height: 32px; /* for some reason this wasnt neccessary for firefox, but it was for chrome */
    }

    .cart-empty .cart-buy {
        display: none
    }

    .empty-message {
        text-align: center;
        font-style: italic;
        color: grey;
        height: 100%;
        align-items: center;
        display: none;
        user-select: none;
    }
    
    .cart-empty .empty-message {
        display: grid;
    }

    .all-products-link {
        margin-bottom: .5em;
        display: inline-block
    }

    .all-products-link > i {
        font-size: .8em;
    }

    .all-products-link:hover {
        color: #00a;
        text-decoration: underline;
        user-select: none;
        cursor: pointer;
    }

    .show-all-products > * > .hide-on-all {
        display: none
    }

    :not(.show-all-products) > * > .hide-on-not-all {
        display: none
    }

    .cart-counter {
        --badge-diameter: 14px;
        

        --badge-radius: calc(var(--badge-diameter) / 2);

        display: grid;
        justify-items: center;
        align-content: center;
        white-space: nowrap;
        word-spacing: -3px;

        width: var(--badge-diameter); 
        max-width: var(--badge-diameter);
        min-width: var(--badge-diameter);
        height: var(--badge-diameter);
        max-height: var(--badge-diameter);
        min-height: var(--badge-diameter);

        border-radius: var(--badge-radius);

        background-color: var(--red);
        color: #fff;
        font-weight: 900;
        font-size: calc(var(--badge-diameter) * 0.8);        
    }

    .cart-counter-container {
        display: block;
        max-width: 0px;
        max-height: 0px;
        margin-left: 10px;
        align-self: start;
        grid-row: 1;
    }

    .cart-counter-container .cart-empty {
        display: none
    }


    .cart-counter-container .cart-above-9 {
        font-size: calc(var(--badge-radius) * 1.2);
        padding-left: 1px;
    }

    .cart-counter-container .cart-above-99 {
        font-size: var(--badge-radius);
    }

    @supports (-moz-appearance: meterbar) {
        .cart-counter {
            padding-top: 2px;
            padding-left: 2px !important;
        }    
        .cart-counter-container .cart-above-99 {
            padding-right: 1px;
        }
    }

    .all-products-container {
        display: grid;
        /* https://www.geeksforgeeks.org/css/how-to-create-a-responsive-css-grid-layout/ */
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 200px is perfect actually- */
        width: 100%;
        justify-items: center;
    }
    
    .all-products {
        --max-all-container-width: 1000px;
        max-width: var(--max-all-container-width);
        margin-left: calc( max(0px, 50% - var(--max-all-container-width) / 2) ); /* im not creating another flex container-- */
    }

    .filter-pane {
        --pane-height: 150px;

        height: var(--pane-height);
        max-height: var(--pane-height);
        min-height: var(--pane-height);

        margin: 8px;
        box-shadow: 0px 0px 15px -5px #000f;
        border-radius: 10px;
        display: flex;
        justify-content: space-evenly;
    }

    .filter-tile {
        --tile-width-mul: 1;
        width: calc(var(--pane-height) * var(--tile-width-mul));
        min-width: calc(var(--pane-height) * var(--tile-width-mul));
        max-width: calc(var(--pane-height) * var(--tile-width-mul));
        height: 100%;
        /* border: 1px solid red; */
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .filter-label, .filter-tile>span {
        width: 100%;
        text-align: center;
        padding: 5px 8px;
    }

    .checkmark-list {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        user-select: none;
    }

    .checkmark-list > span {
        width: 100%;
        display: block;
        text-align: left;
    }

    .search-bar {
        --pane-height: 45px;
        font-size: larger;
        border-width: 0px;
        width: calc(100% - 16px);
        margin: 8px;
        display: inline;
        padding-left: 10px;
        font-family: Arial, Helvetica, sans-serif, primeicons;
    }

    .empty-search-results {
        width: 100%;
        display: block;
        text-align: center;
        margin-top: 50px;
        color: grey;
    }

</style>
<script setup>
    import { ref, computed, watch, reactive } from "vue"
    

    import Drawer from 'primevue/drawer';
    import Slider from 'primevue/slider'
    import Select from 'primevue/select'
    import Dialog from 'primevue/dialog'

    import ProductRow from "./components/Row.vue"
    import CartEntry from "./components/CartProductEntry.vue"
    import ProductTile from "./components/Product.vue"

    import data from "./data.json";

    let show_cart = ref(false);
    let show_thankyou = ref(false);
    let show_all_products = ref(false);

    let id_counter = 10
    let newID = () => id_counter++

    for (const key in data) data[key] = data[key].map(v=>({...v,id:newID()}))
    data.products = data.products.map(v=>({...v,cart_counter:0,filter_score:0,cart_id:newID()}))

    let min_max_prices = [Infinity,-Infinity]
    data.products.forEach(v=>{
        min_max_prices = [Math.min(min_max_prices[0],v.eur),Math.max(min_max_prices[1],v.eur)]
    })

    const product_data = ref(data) 

    let total_cart_count = computed(() => {
        let result = product_data.value.products.reduce((a,b)=>Number(a)+b.cart_counter,0)
        show_cart.value ||= result>total_cart_count.value
        return result
    })

    let filtering = reactive({
        limit_price_range: min_max_prices,
        categories: [{id:-1,title:"Všetko"},...data.categories.filter(v=>v.type=="category").map(v=>({
            title: v.title,
            id: data.categories.findIndex(w=>v.title==w.title)
        })).sort((a,b)=>a.title>b.title)],

        price_range: min_max_prices,
        selected_category: 0,

        brands: data.categories.filter(v=>v.type=="brand").map(v=>({
            title: v.title,
            id: data.categories.findIndex(w=>v.title==w.title),
            selected: false,
            vue_id: newID()
        })).sort((a,b)=>a.title>b.title),

        any_brand: false,
        search: ""
    })

    filtering.selected_category = filtering.categories[0];
    

    let checks = [
        (product,filter) => {
            if (product.eur>filter.price_range[1] || product.eur<filter.price_range[0]) return -1
            return 1
        },
        (product,filter) => {
            if (filter.selected_category.id == -1 || product.category.includes(filter.selected_category.id)) return 1;
            return -1;
        },
        (product,filter) => {
            if (!filtering.any_brand) return 1;
            for (let brand of filter.brands.filter(v=>v.selected)) {
                if (product.category.includes(brand.id)) return 1;
            }
            return -1;
        },
        (product,filter) => {
            let keywords = filter.search.trim().replace("\\s+","\s").split(" ")
            if (keywords.length==0) return 1;

            let texts = [product.title,product.desc]
            texts = texts.map(v=>v.toLowerCase())

            let score = 0
            let i = 0
            for (const text of texts) {                
                for (const word of keywords) {
                    score += text.includes(word)*(texts.length-i)
                }
                i++
            }
            return score - (score==0)
        }
    ]

    let update_filter_scores = new_filter => {
        filtering.any_brand = filtering.brands.reduce((a,b)=>a||b.selected,false)
        new_filter.any_brand = filtering.any_brand;

        if (new_filter.price_range[1]<new_filter.price_range[0]) 
            new_filter.price_range = [new_filter.price_range[1],new_filter.price_range[0]]

        
        product_data.value.products.forEach(v=>{
            v.filter_score = 0;
            for (let check of checks) {   
                let result = check(v,new_filter)
                if (result == -1) {
                    v.filter_score = 0;
                    return;
                }
                v.filter_score += result;
            }
        })

    }

    let search_results = computed(()=>{
        return product_data.value.products.filter(v=>v.filter_score>0).sort((a,b)=>{
            if (a.filter_score!=b.filter_score) return b.filter_score - a.filter_score
            return a.title.localeCompare(b.title)
        })
    })


    watch(filtering,update_filter_scores)

    update_filter_scores(filtering)

</script>