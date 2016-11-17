var WEEKDAY_NAMES = [
    "Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"
];
var MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function updateCalSize($cal) {
    var calWidth = $cal.width();
    var eltSize = (calWidth / 7);

    var $weekdays = $cal.find(".weekdays");
    var $days = $cal.find(".days");

    $weekdays.find("li").css("width", eltSize.toString() + "px");
    $days.find("li").css({
        "width" : eltSize.toString() + "px",
        "height": eltSize.toString() + "px",
        "line-height": eltSize.toString() + "px"
    });
}

function updateCalData($cal, date) {
    $cal[0].selectedDate = date;

    var $banner    = $cal.find(".banner");
    var $weekdays  = $cal.find(".weekdays");
    var $days      = $cal.find(".days");

    var year  = date.getFullYear();
    var month = date.getMonth();

    var firstDay    = new Date(year, month, 1);
    var startingDay = firstDay.getDay();
    var daysInMonth = getDaysInMonth(year, month);

    console.log("# days in : ", month, daysInMonth);

    // day of the month to be output
    var dayNumber = 1;
    var counter = 0;

    if ($days.length > 0) {
        $days.empty();
    }

    if ($banner.length > 0) {
        $banner.empty();
        
        $banner.append($("<div>")
            .append("<i class=\"fa fa-chevron-left\">")
            .addClass("month-back")
            .click(function() {
                // go back a month
                var newDate = $cal[0].selectedDate;
                var day = newDate.getDate();
                var daysInMonth = getDaysInMonth(newDate.getFullYear(), newDate.getMonth() - 1);
                if (day > daysInMonth) {
                    newDate.setDate(daysInMonth);
                }
                newDate.setMonth(newDate.getMonth() - 1);
                updateCalData($cal, newDate);
                updateCalSize($cal);
            }));
        $banner.append($("<div>")
            .append(MONTH_NAMES[$cal[0].selectedDate.getMonth()])
            .append(" " + $cal[0].selectedDate.getFullYear().toString()));
        $banner.append($("<div>")
        .append("<i class=\"fa fa-chevron-right\">")
            .addClass("month-forward")
            .click(function() {
                // go forward a month
                var newDate = $cal[0].selectedDate;
                var day = newDate.getDate();
                var daysInMonth = getDaysInMonth(newDate.getFullYear(), newDate.getMonth() + 1);
                if (day > daysInMonth) {
                    newDate.setDate(daysInMonth);
                }
                newDate.setMonth(newDate.getMonth() + 1);
                updateCalData($cal, newDate);
                updateCalSize($cal);
            }));
    }
    
    if (daysInMonth != 0) {
        counter = 7 * Math.ceil((daysInMonth + startingDay) / 7);
    }

    var $dayElement  = null;
    var $weekElement = null;
    var atEnd = false;

    for (var i = 0; i <= counter; i++) {
        $dayElement = $("<li>");

        atEnd = i == counter;

        if (i % 7 == 0 || atEnd) {
            if ($weekElement != null) {
                // append old week
                $days.append($weekElement);
            }

            // create new week object
            $weekElement = $("<ul>")
                .addClass("week");
        }

        if (!atEnd) {
            if (i >= startingDay && dayNumber <= daysInMonth) {
                (function(day) {
                    var $elt = $("<div>")
                        .addClass("day")
                        .append(day.toString())
                        .click(function() {
                            // set new day, but do not re-create element.
                            if ($cal[0].selectedDate.getDate() != day) {
                                $cal[0].selectedDate.setDate(day);

                                $(".day").removeClass("active");
                                $(this).addClass("active");
                            }
                        });

                    if ($cal[0].selectedDate.getDate() == day) {
                        $elt.addClass("active");
                    }

                    $dayElement.append($elt);
                })(dayNumber++);
            } else if (i < startingDay) {
                $dayElement.append(new Date(year, month, -1 * (startingDay - i) + 1).getDate())
                    .addClass("next-month");
            } else if (dayNumber > daysInMonth) {
                $dayElement.append(new Date(year, month, dayNumber++).getDate())
                    .addClass("next-month");
            }

            $weekElement.append($dayElement);
        }
    }
}


$(document).ready(function() {
    $(".cal").each(function() {
        this.getSelectedDate = function() {
            return this.selectedDate;
        };

        var $this = $(this);

        var $banner = $("<div>")
            .addClass("banner");
        
        var $weekdays = $("<ul>")
            .addClass("weekdays");

        WEEKDAY_NAMES.forEach(function(element) {
            $weekdays.append($("<li>")
                .append(element));
        });

        var $weekdaysWrapper = $("<div>")
            .addClass("weekdays-wrapper")
            .append($weekdays);

        var $daysWrapper = $("<div>")
            .addClass("days-wrapper")
            .append($("<div>")
                .addClass("days"));

        $this.html("");
        $this.append($banner)
             .append($weekdaysWrapper)
             .append($daysWrapper);

        updateCalData($this, new Date());
        updateCalSize($this);
    });

    $(window).resize(function() {
        $(".cal").each(function() {
            updateCalSize($(this));
        });
    });
});

