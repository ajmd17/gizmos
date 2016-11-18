var ClockPickMode = {
    HOUR:   0,
    MINUTE: 1
};

var hoursList = [
    3, 4, 5, 6,
    7, 8, 9, 10,
    11, 12, 1, 2
];

var hourElementIndex = [
    9, 10, 11, 0,
    1, 2, 3, 4,
    5, 6, 7, 8
];

function Clock(date, timeChangedCallback) {
    this.$clockElement = $("<div>")
        .addClass("clock");

    if (date == undefined) {
        this.date = new Date();
    } else {
        this.date = date;
    }

    this.timeChangedCallback = timeChangedCallback;
    this.pickingMode = ClockPickMode.HOUR;

    var clock = this;
    
    var $am = $("<div>")
        .addClass("clock-am")
        .append($("<a href=\"#\">")
        .append("AM"))
        .click(function() {
            var $this = $(this);
            if (!$this.hasClass("active")) {
                clock.$clockElement.find(".am-pm>div").removeClass("active");
                $(this).addClass("active");

                var hour = clock.date.getHours();
                if (hour >= 12) {
                    clock.date.setHours(hour - 12);
                    // trigger callback
                    if (clock.timeChangedCallback != undefined) {
                        clock.timeChangedCallback(clock.date, ClockPickMode.HOUR);
                    }
                }
            }
        });

    var $pm = $("<div>")
        .addClass("clock-pm")
        .append($("<a href=\"#\">")
        .append("PM"))
        .click(function() {
            var $this = $(this);
            if (!$this.hasClass("active")) {
                clock.$clockElement.find(".am-pm>div").removeClass("active");
                $(this).addClass("active");

                var hour = clock.date.getHours();
                if (hour < 12) {
                    clock.date.setHours(hour + 12);
                    // trigger callback
                    if (clock.timeChangedCallback != undefined) {
                        clock.timeChangedCallback(clock.date, ClockPickMode.HOUR);
                    }
                }
            }
        });

    this.$clockElement.append($("<div>")
        .addClass("clock-controls")
        /*.append($("<div>")
            .addClass("hours-hand"))
        .append($("<div>")
            .addClass("center-cap"))*/
        .append($("<div>")
            .addClass("selected-time"))
        .append($("<div>")
            .addClass("am-pm")
            .append($am)
            .append($pm)));

    this.updateData();
}

Clock.prototype.getHours = function() {
    return this.date.getHours();
};

Clock.prototype.getMinutes = function() {
    return this.date.getMinutes();
};

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
    var isPm = hour >= 12;
    hour = hour % 12;
    hour = hour != 0 ? hour : 12;

    var minute     = this.date.getMinutes();
    var minuteStep = 5;

    // remove old hour labels
    this.$clockElement.find(".hour-labels").remove();
    var $hours = $("<ul>")
        .addClass("hour-labels");
    this.$clockElement.find(".selected-time")
        .html(hour + ":" + ("0" + minute).slice(-2));

    var $am = clock.$clockElement.find(".clock-am");
    var $pm = clock.$clockElement.find(".clock-pm");
    
    if (isPm) {
        $pm.addClass("active");
        $am.removeClass("active");
    } else {
        $am.addClass("active");
        $pm.removeClass("active");
    }

    for (var i = 0; i < 12; i++) {
        (function(hourIndex) {
            var itemHour   = hoursList[hourIndex];
            var itemMinute = (itemHour * minuteStep) % 60;

            var deg = (itemHour / 12) * 360;

            var $hourElement = $("<li>")
                .addClass("hour")
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

                    clock.$clockElement.find(".hour-labels").animate({
                        "opacity": 0
                    }, 500, function() {
                        if (clock.pickingMode == ClockPickMode.HOUR) {
                            // set clock.date's hour
                            var pmSelected = $pm.hasClass("active");
                            if (pmSelected) {
                                clock.date.setHours(itemHour + 12);
                            } else {
                                clock.date.setHours(itemHour);
                            }

                            // trigger callback
                            if (clock.timeChangedCallback != undefined) {
                                clock.timeChangedCallback(clock.date, clock.pickingMode);
                            }

                            // set clock pick mode to minute
                            clock.pickingMode = ClockPickMode.MINUTE;
                            clock.updateData();
                        } else if (clock.pickingMode == ClockPickMode.MINUTE) {
                            // set clock.date's minutes
                            clock.date.setMinutes(itemMinute);

                            // trigger callback
                            if (clock.timeChangedCallback != undefined) {
                                clock.timeChangedCallback(clock.date, clock.pickingMode);
                            }

                            // go back to hour mode
                            clock.pickingMode = ClockPickMode.HOUR;
                            clock.updateData();
                        }
                    });
                });

            var $hourText = $("<a href=\"#\">");

            if (clock.pickingMode == ClockPickMode.HOUR) {
                if (hour == itemHour) {
                    $hourElement.addClass("active");
                    clock.$clockElement.find(".hours-hand").css({
                        "transform": "translateX(-50%) translateY(-50%) rotate(" + deg.toString() + "deg)"
                    });
                }
                $hourText.append(itemHour);
            } else if (clock.pickingMode == ClockPickMode.MINUTE) {
                (function(minuteRounded) {
                    if (minuteRounded == itemMinute) {
                        $hourElement.addClass("active");
                        clock.$clockElement.find(".hours-hand").css({
                            "transform": "translateX(-50%) translateY(-50%) rotate(" + deg.toString() + "deg)"
                        });
                    }
                })(Math.floor(clock.date.getMinutes() / minuteStep) * minuteStep);
                $hourText.append(("0" + itemMinute).slice(-2));
            }

            $hourElement.append($hourText);
            $hours.append($hourElement);
        })(i);
    
        degCounter += degStep;
    }

    $hours.css("opacity", 0);
    this.$clockElement.append($hours);
    $hours.animate({
        "opacity": 1
    }, 250);
};