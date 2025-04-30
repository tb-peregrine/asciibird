import { DataAdapter } from '../../core/DataAdapter.js';

export class BarDataAdapter extends DataAdapter {
    constructor(data, options = {}) {
        super(data, options);
        this.orientation = options.orientation || 'horizontal';
    }

    validate() {
        super.validate();

        // Ensure each data point has required properties
        this.rawData.forEach(point => {
            if (typeof this.getValue(point) !== 'number') {
                throw new Error('Each data point must have a numeric value');
            }
            if (typeof this.getLabel(point) !== 'string') {
                throw new Error('Each data point must have a string label');
            }
        });

        return true;
    }

    transform() {
        this.validate();
        return this.rawData.map(point => {
            const normalized = this.normalizePoint(point);
            return {
                ...normalized
            };
        });
    }

    // Override getValue to handle Tinybird data structure
    getValue(point) {
        if (this.options.tinybird) {
            return point.value || 0;
        }
        return super.getValue(point);
    }

    // Override getLabel to handle Tinybird data structure
    getLabel(point) {
        if (this.options.tinybird) {
            return point.label || point.time_bucket || '';
        }
        return super.getLabel(point);
    }
} 