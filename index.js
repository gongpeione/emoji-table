import Vue from 'vue';
import App from './main.vue';

const vm = new Vue({
    el: '#app',
    render: h => h(App)
});