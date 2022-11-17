var GraphDescr = (function() {
    //this.type = '';
    this.size = {
        cols: 0,
        rows: 0,
        lays: 0,
        KL: 0,
        KR: 0
    };

    this.set = function(_t, _c, _r, _l, _kl, _kr) {
        this.setType(_t);
        this.setSize(_c, _r, _l, _kl, _kr);
    };
    
    this.setType = function(_t) {
        this.type = _t;
    };

    this.setSize = function(_c, _r, _l, _kl, _kr) {
        this.size = {
            cols: _c,
            rows: _r,
            lays: _l,
            KL: _kl,
            KR: _kr
        };
    };
});

