var GraphSize = (function(c, r, l, kl, kr) {
        this.cols = c;
        this.rows = r;
        this.lays = l;
        this.KL = kl;
        this.KR = kr;
});

var GraphDescr = (function() {
    this.size = new GraphSize(0,0,0,0,0);

    this.set = function(_t, _c, _r, _l, _kl, _kr) {
        this.setType(_t);
        this.setSize(_c, _r, _l, _kl, _kr);
    };
    
    this.setType = function(_t) {
        this.type = _t;
    };

    this.setSize = function(_c, _r, _l, _kl, _kr) {
        this.size = new GraphSize( _c, _r, _l, _kl, _kr );
    };
});

