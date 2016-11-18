function Clock() {
    this.$clockElement = $("<div>")
        .addClass("clock");

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

    var $hours = $("<ul>")
        .addClass("hour-labels");

    var hoursList = [
        3, 4, 5, 6,
        7, 8, 9, 10,
        11, 12, 1, 2
    ];

    this.$clockElement.empty();
    for (var i = 0; i < 12; i++) {
        $hours.append($("<li>")
            .append(hoursList[i])
            .css({
                "transform": "rotate(" + degCounter + "deg) translate(" + (halfWidth - 20) + "px) rotate(" + (-1 * degCounter) + "deg)"
            }));

        degCounter += degStep;
    }

    this.$clockElement.append($hours);
    this.$clockElement.append($("<div>")
        .addClass("clock-controls")
        .append($("<div>")
            .addClass("hours-hand")
            /*.css({
                "transform": "rotate(" + 260 + "deg) translateX(" + (halfWidth - 130) + "px) translateY(" + (halfWidth - 130) + "px)"
            })*/)
        .append($("<div>")
            .addClass("minutes-hand"))
        .append($("<div>")
            .addClass("center-cap")));
};