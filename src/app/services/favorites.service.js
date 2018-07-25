
export default class FavoritesService {

    constructor($window) {
        this.items = [];
        this.openPanel = false;
        this.$window = $window;

        // load items from storage if available
        if (this.$window.localStorage.getItem('myFavorite'))
            this.items = JSON.parse(this.$window.localStorage.getItem('myFavorite'));
    }

    // Method: check if favorite already exists by id
    favoriteExists(item) {
        return (this.items.find(e => e.id == item.id) !== undefined);
    }

    // Method: remove a favorite
    removeFavorite(item) {
        this.items = this.items.filter(e => (e.id !== item.id))
        if (this.items.length == 0)
            this.openPanel = false;
    }

    // Method: add or remove favorite
    toggleFavorite(item) {
        // add item if unique
        if (!this.favoriteExists(item)) {
            // only allow 10 items for now 
            if (this.items.length < 10)
                this.items.push(item);
        }
        else
            this.removeFavorite(item);

        if (!this.openPanel && this.items.length > 0 && this.items.length < 10) {
            $('.favorites').stop().effect("bounce", { direction: 'up', times: 3 }, 700);
        }

        // persist changes 
        this.$window.localStorage.setItem('myFavorite', JSON.stringify(this.items));
    }

}

FavoritesService.$inject = ['$window'];
