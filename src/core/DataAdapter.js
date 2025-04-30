/**
 * Base DataAdapter class that handles data transformation
 */
export class DataAdapter {
    constructor(data, options = {}) {
        this.rawData = data;
        this.options = options;
    }

    /**
     * Validates the data structure
     * @returns {boolean} true if data is valid
     */
    validate() {
        if (!Array.isArray(this.rawData)) {
            throw new Error('Data must be an array');
        }
        return true;
    }

    /**
     * Transforms raw data into a normalized format
     * Must be implemented by child classes
     */
    transform() {
        throw new Error('transform must be implemented by child class');
    }

    /**
     * Extracts value from a data point
     * @param {Object} point - Data point
     * @returns {number} The value
     */
    getValue(point) {
        return point.value || 0;
    }

    /**
     * Extracts label from a data point
     * @param {Object} point - Data point
     * @returns {string} The label
     */
    getLabel(point) {
        return point.label || '';
    }

    /**
     * Normalizes a single data point
     * @param {Object} point - Data point to normalize
     * @returns {Object} Normalized data point
     */
    normalizePoint(point) {
        return {
            value: this.getValue(point),
            label: this.getLabel(point),
            ...point
        };
    }
} 