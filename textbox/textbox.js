function Textbox(placeholderText, callbacks) {
    if (placeholderText !== undefined) {
        this.placeholderText = placeholderText;
    } else {
        this.placeholderText = "";
    }

    if (callbacks !== undefined) {
        this.callbacks = callbacks;
    } else {
        this.callbacks = {};
    }

    this.$textboxElement = $("<input type=\"text\" placeholder=\"" + this.placeholderText + "\">")
        .addClass("textbox");
}

Textbox.prototype.getElement = function() {
    return this.$textboxElement;
};