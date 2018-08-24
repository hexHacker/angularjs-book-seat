import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import '../style/app.css'

import angular from 'angular'
import '@uirouter/angularjs'
import 'angular-sanitize';
import ngAnimate from 'angular-animate'

import BooksController from './controllers/books/books.controller'
import SeatMapController from './controllers/seatmap/seatmap.controller'
import favoritesService from './services/favorites.service'

function config($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('books');
     //test
    $stateProvider
        .state('books', {
            url: '/books',
            template: require('./controllers/books/books.html'),
            controller: BooksController,
            controllerAs: 'vm'
        })

        .state('cart', {
            url: '/cart',
            template: require('./controllers/books/cart.html'),
            controller: BooksController,
            controllerAs: 'vm'
        })

        .state('seatmap', {
            url: '/seatmap',
            template: require('./controllers/seatmap/seatmap.html'),
            controller: SeatMapController,
            controllerAs: 'vm'
        })
}

angular.module('app', ['ui.router', 'ngSanitize', ngAnimate])
    .service('favoritesService', favoritesService)
    .config(config)

