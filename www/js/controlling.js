
var controlling = new Controlling();

function Controlling() {
    this.angle = 0.0;
    this.lift = 0.0;
}

Controlling.prototype.handleKeydownEvent = function(e) {
    var code = e.keyCode;
    switch (code) {
        case 87:
            this.lift = 1;
            break;
        case 83:
            this.lift = -0.001;
            break;
        case 65:
            this.angle = 1;
            break;
        case 68:
            this.angle = -1;
            break;
    	
        default:
    }
};

Controlling.prototype.handleKeyupEvent = function(e) {
    var code = e.keyCode;
    switch (code) {
        case 87:
            this.lift = 0;
            break;
        case 83:
            this.lift = 0;
            break;
        case 65:
            this.angle = 0;
            break;
        case 68:
            this.angle = 0;
            break;

        default:
    }
};