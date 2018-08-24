import './books.css'

export default class BooksController {

    constructor($scope, $http, $timeout, favoritesService) {
        this.search = '';
        this.message = '';
        this.cssShowResults = false;
        this.cssShowMessage = false;
        this.books = [];
        this.filterResults = '';
        this.$http = $http;
        this.$timeout = $timeout;
        this.favorites = favoritesService;
        this.favorites.openPanel = false;
        this.ajaxPending = () => { return $http.pendingRequests.length !== 0; };

        $scope.$on('$viewContentLoaded',
            function (event) {
                console.log('loaded bookscope')
            })
    }


    showMessage(msg, optFade = true) {
        this.message = msg;
        this.cssShowMessage = true;
        if (optFade)
            this.$timeout(() => (this.cssShowMessage = false), 3000);
    }

    capitalize(str) {
        return str.toLowerCase().replace(/\b\w/g, function (m) {
            return m.toUpperCase();
        });
    };


    // Method: fetch new book data
    updatebooks() {
        if (this.ajaxPending()) return;

        if (this.search === '') {
            this.showMessage('Nothing? Really?!')
            return;
        }

        // clean up UI
        this.books = [];
        this.filterResults = '';
        this.cssShowResults = false;
        this.favorites.openPanel = false;
        this.showMessage('Searching..', false);

        const apiURL = 'https://www.googleapis.com/books/v1/volumes?q=' + this.search + '&maxResults=30';
        console.log('calling ' + apiURL);

        const vm = this;

        this.$http({
            method: 'GET',
            url: apiURL

        }).then(function successCallback(response) {
            if (response.data.totalItems > 0) {

                // google books object is rather large, so lets extract just the properties we need for the model
                var booksArr = [];

                for (let i = 0; i < response.data.items.length; i++) {

                    var item = response.data.items[i];

                    try {
                        let objBook = {};

                        objBook.id = item.id;
                        objBook.title = vm.capitalize(item.volumeInfo.title);
                        objBook.previewLink = item.volumeInfo.previewLink;

                        if (item.volumeInfo.imageLinks)
                            objBook.thumbnail = item.volumeInfo.imageLinks.thumbnail;
                        else
                            objBook.thumbnail = 'https://www.cooneybrothers.com/ASSETS/WEB_THEMES//COONEY_BROTHERS_INC/images/NoImage.png';

                        // reformat dates
                        var pDate = item.volumeInfo.publishedDate;
                        if (!pDate)
                            objBook.publishedDate = 'n/a';
                        else
                            if (pDate.indexOf('-') !== -1)
                                objBook.publishedDate = pDate.substring(0, pDate.indexOf('-'));
                            else
                                objBook.publishedDate = pDate;

                        booksArr.push(objBook);
                    }
                    catch (err) {
                        console.error('Error: ' + err.message + ', item skipped.');
                    }
                }
                vm.books = booksArr;
                vm.cssShowResults = true;
                vm.showMessage('Showing ' + vm.books.length + ' of ' + response.data.totalItems + ' matching books found!');
            }
            else
                vm.showMessage('No books found!', false);

        }, function errorCallback(response) {
            vm.books = [];
            vm.showMessage('ooppss something went wrong!', false);
        })
    }
}

BooksController.$inject = ['$scope', '$http', '$timeout', 'favoritesService'];
