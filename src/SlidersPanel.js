
/* global sgv, UI */

/**
 * @class
 * @classdesc Represents a panel for controlling sliders.
 */
const SlidersPanel = (function() {
    /**  Represents the red limit slider. 
     * @type {HTMLElement}
     */
    var sliderRedLimit;

    /** Represents the green limit slider.
     *  @type {HTMLElement}
     */
    var sliderGreenLimit;

    /** Represents the display span for red limit.
     * @type {HTMLElement}
     */
    var spanRed;

    /** Represents the display span for green limit.
     * @type {HTMLElement}
     */
    var spanGreen;

    /**
     * The UI for the sliders panel.
     * @type {HTMLElement}
     */
    this.ui = UI.tag('div', {'id': 'LimitSlidersPanel'});

    this.ui.appendChild(spanRed = UI.tag("span", {'id': 'spanRed'}, {'textContent': '-1.0'}));

    sliderRedLimit = UI.tag('input', {
        'type': 'range',
        'class': 'graphLimit',
        'id': 'redLimit',
        'value': '-1.0',
        'min': '-1.0',
        'max': '0.0',
        'step': '0.01'
    });
    sliderRedLimit.addEventListener('input', async (e) => {
        if (sgv.graf !== null) {
            sgv.graf.redLimit = e.target.value;

            spanRed.textContent = '' + sgv.graf.redLimit + ' ';

            sgv.graf.displayValues();
        }
    });

    this.ui.appendChild(sliderRedLimit);

    this.ui.appendChild(UI.tag("span", {'id': 'spanZero'}, {'textContent': ' 0 '}));

    sliderGreenLimit = UI.tag('input', {
        'type': 'range',
        'class': 'graphLimit',
        'id': 'greenLimit',
        'value': '1.0',
        'min': '0.0',
        'max': '1.0',
        'step': '0.01'
    });
    sliderGreenLimit.addEventListener('input', async (e) => {
        if (sgv.graf !== null) {
            sgv.graf.greenLimit = e.target.value;

            spanGreen.textContent = ' ' + sgv.graf.greenLimit;

            sgv.graf.displayValues();

        }
    });

    this.ui.appendChild(sliderGreenLimit);

    this.ui.appendChild(spanGreen = UI.tag("span", {'id': 'spanGreen'}, {'textContent': '1.0'}));
    
    /**
     * Refreshes the sliders panel based on the current graph data.
     */
    this.refresh = () => {
        if (sgv.graf === null)
            return;

        let r = sgv.graf.getMinMaxVal();

        // min should to bee negative or :
        if (r.min > 0)
            r.min = Number.NaN;

        // max should to bee positive:
        if (r.max < 0)
            r.max = Number.NaN;


        updateRed(r.min);
        updateGreen(r.max);

        function updateRed(min) {
            if (isNaN(min)) {
                sliderRedLimit.disabled = 'disabled';
                spanRed.textContent = 'NaN';
            } else {
                min = Math.floor(min * 100) / 100;

                if (sgv.graf.redLimit < min) {
                    sgv.graf.redLimit = min;
                }

                sliderRedLimit.min = min;
                sliderRedLimit.value = sgv.graf.redLimit;

                spanRed.textContent = sgv.graf.redLimit + ' ';
                sliderRedLimit.disabled = '';
            }
        }

        function updateGreen(max) {
            if (isNaN(max)) {
                sliderGreenLimit.disabled = 'disabled';
                spanGreen.textContent = 'NaN';
            } else {
                max = Math.ceil(max * 100) / 100;

                if (sgv.graf.greenLimit > max) {
                    sgv.graf.greenLimit = max;
                }

                sliderGreenLimit.max = max;
                sliderGreenLimit.value = sgv.graf.greenLimit;

                spanGreen.textContent = ' ' + sgv.graf.greenLimit;
                sliderGreenLimit.disabled = '';
            }
        }

    };
    
});

