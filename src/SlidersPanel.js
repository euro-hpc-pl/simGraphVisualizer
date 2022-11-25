/* 
 * Copyright 2022 pojdulos.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global sgv, UI */

const SlidersPanel = (function() {
    var sliderRedLimit, sliderGreenLimit;
    var spanRed, spanGreen;

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

