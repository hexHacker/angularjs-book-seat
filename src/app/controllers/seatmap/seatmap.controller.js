import 'jquery-ui-bundle/jquery-ui.css'
import './seatmap.css'
import 'jquery-ui-bundle'
import 'jquery-ui-touch-punch'

export default class SeatMapController {

    constructor($scope, $timeout) {
        this.rows = 5;
        this.seatsPerRow = 5;
        this.cssSeatsPerRow = 5;
        this.gapRows = [2, 4];
        this.seats = [];
        this.cssShowSeatmap = false;
        this.$timeout = $timeout;
        this.cssShowSeatmap = false;

        this.changeSeatMap();

        // initialize two handle slider on state load
        $scope.$on('$viewContentLoaded',
            function (event) {
                let scope = angular.element('.seatmap').scope().vm;

                $("#slider-range").slider({
                    range: true,
                    min: 1,
                    max: 7,
                    values: scope.gapRows,
                    stop: function (event, ui) {
                        $("#isleRows").val(ui.values[0] + " and " + ui.values[1]);
                        scope.gapRows = ui.values;
                        scope.changeSeatMap();
                    }
                });

                $("#isleRows").val($("#slider-range").slider("values", 0) + " and " + $("#slider-range").slider("values", 1));
            })
    }


    // build the seatmap model based on UI slider elements
    initSeatMap() {
        this.seats = [];
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.seatsPerRow; j++) {
                this.seats.push(
                    {
                        'booked': Math.random() >= 0.5,  // randomly assign booked seats!
                        'isGap': this.gapRows.find(e => (e === j)),
                        'newRow': j === this.seatsPerRow - 1
                    }
                )
            }
    }

    //checkKey($event) {
    //    let arrowKeys = [35, 36, 37, 38, 39, 40];
    //    if (arrowKeys.indexOf($event.keyCode) != -1) {
    //        this.changeSeatMap();
    //    }
    //}


    // reset seat map ui elements
    changeSeatMap() {
        this.cssShowSeatmap = false;
        this.msg = 'Drag to select seat';
        this.$timeout(() => (this.initSeatMap()), 200);
        this.$timeout(() => (this.cssSeatsPerRow = this.seatsPerRow, this.cssShowSeatmap = true), 200);
        this.$timeout(() => ($('.person').css('position', 'absolute').animate({ top: -125, left: 120 })), 200);
        this.$timeout(() => (this.initDragDrop()), 700);
    }

    // 
    initDragDrop() {

        let person = $('.person');
        let seats = $('.seat:not(.booked)');

        person.draggable({
            //containment: seats,
            //helper: 'clone',
            revert: 'invalid',
            start: function () {
                $('.person').css('opacity', 0.8)
            },
            stop: function () {
                $('.person').animate({ 'opacity': 1 }, 400)
            }
        });

        seats.droppable({
            //accept: person,
            hoverClass: 'activeDrop',

            // slide icon over seat placeholder
            drop: function (event, ui) {
                let scope = $(this).scope();
                angular.element('.message').scope().vm.msg = "Seat assigned: <span class='seat-number'>" + (scope.$index + 1) + "</span>";
                angular.element('.message').scope().$apply();

                let draggable = ui.draggable;
                let droppable = $(this);
                let dragPos = ui.draggable.position();
                let dropPos = droppable.position();

                let _left = dropPos.left - dragPos.left - parseInt(droppable.css('margin-right'));
                let _top = dropPos.top - dragPos.top;

                // adjust for offsets
                let absOffsetLeft = $('#draggable').position().left;
                let absOffsetTop = $('#draggable').position().top;
                _left = dragPos.left + _left + parseInt(droppable.css('margin-left')) - absOffsetLeft;
                _top = dragPos.top + _top - absOffsetTop;

                draggable.animate({ left: _left, top: _top });
            }
        });
    };

}

SeatMapController.$inject = ['$scope', '$timeout'];
