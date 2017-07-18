

var Tag = (function() {

    function Tag( text, style ) {
        var text = text;

        this._elem = document.createElement('div');
        this.style = style;

        this.getText = () => {
            return text;
        };

        this.setText = ( text ) => {
            text = text;
        };

        Tag.liveInstances++;
    };

    Tag.liveInstances = 0;

    return Tag;

})();





var TagInput = (function() {

    var TagInput = function TagInput(max) {
        const MAX_TAGS = max || 10;

    };

    return TagInput;

})();
//
//Tag.prototype.setStyle = ( style ) => {
//    this.style = style;
//    return this;
//};
//
//Tag.prototype.getStyle = () => {
//    return this.style;
//};
//
//Tag.count = 0;
//
//
//var SelectedTag = function( text ) {
//    Tag.call(this, text, 'selected-tag-item' );
//    this.selected = true;
//};
//
//SelectedTag.prototype = new Tag;
//
//
//var AvailableTag = function( text ) {
//    Tag.call(this, text, 'tag-item');
//    this.selected = false;
//};
//
//AvailableTag.prototype = new Tag;
//
//var TagInput = function( taglist ) {
//
//    this.tags = [];
//    var selection = taglist || [];
//
//};
//
