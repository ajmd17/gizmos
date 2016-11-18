function Clock(date) {
    this.$clockElement = $("<div>")
        .addClass("clock");

    if (date == undefined) {
        this.date = new Date();
    } else {
        this.date = date;
    }

    this.updateData();
}

Clock.prototype.getElement = function() {
    return this.$clockElement;
};

Clock.prototype.updateData = function() {
    var clock      = this;
    var width      = 300;
    var halfWidth  = width / 2;
    var degStep    = 360 / 12;
    var degCounter = 0;

    var hour = this.date.getHours();
    var isPm = (hour >= 12);
    hour = hour % 12;
    hour = hour != 0 ? hour : 12;

    var $hours = $("<ul>")
        .addClass("hour-labels");

    var hoursList = [
        3, 4, 5, 6,
        7, 8, 9, 10,
        11, 12, 1, 2
    ];

    var $am = $("<div>")
        .append($("<a href=\"#\">")
        .append("AM"))
        .click(function() {
            clock.$clockElement.find(".am-pm>div").removeClass("active");
            $(this).addClass("active");
        });

    var $pm = $("<div>")
        .append($("<a href=\"#\">")
        .append("PM"))
        .click(function() {
            clock.$clockElement.find(".am-pm>div").removeClass("active");
            $(this).addClass("active");
        });

    if (isPm) {
        $pm.addClass("active");
    } else {
        $am.addClass("active");
    }

    this.$clockElement.empty();
    this.$clockElement.append($("<div>")
        .addClass("clock-controls")
        .append($("<div>")
            .addClass("hours-hand"))
        .append($("<div>")
            .addClass("center-cap"))
        .append($("<div>")
            .addClass("am-pm")
            .append($am)
            .append($pm)));

    

    for (var i = 0; i < 12; i++) {

        (function(hourIndex) {
            var deg = (hoursList[hourIndex] / 12) * 360;

            var $hourElement = $("<li>")
                .addClass("hour")
                .append($("<a href=\"#\">")
                    .append(hoursList[hourIndex]))
                .css({
                    "transform": "rotate(" + degCounter + "deg) translate(" + (halfWidth - 30) + "px) rotate(" + (-1 * degCounter) + "deg)"
                })
                .click(function() {
                    clock.$clockElement.find(".hour").removeClass("active");
                    $(this).addClass("active");

                    // rotate hour hand to face this
                    clock.$clockElement.find(".hours-hand").css({
                        "transform": "translateX(-50%) translateY(-50%) rotate(" + deg.toString() + "deg)"
                    });
                });

            if (hoursList[hourIndex] == hour) {
                $hourElement.addClass("active");
                console.log(clock.$clockElement.find(".hours-hand"));
                clock.$clockElement.find(".hours-hand").css({
                    "transform": "translateX(-50%) translateY(-50%) rotate(" + deg.toString() + "deg)"
                });
            }

            $hours.append($hourElement);
        })(i);
    
        degCounter += degStep;
    }

    this.$clockElement.append($hours);
};