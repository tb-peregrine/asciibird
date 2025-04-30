export class TinybirdDataAdapter {
    /**
     * @param {Array} data - The Tinybird API response (array of objects)
     * @param {Object} options - Adapter options
     * @param {string} options.labelField - The field to use as the label
     * @param {string} options.valueField - The field to use as the value
     */
    constructor(data, { labelField = 'label', valueField = 'value' } = {}) {
        this.rawData = data;
        this.labelField = labelField;
        this.valueField = valueField;
    }

    /**
     * Transforms the Tinybird API response to [{ label, value }, ...]
     * @returns {Array<{label: string, value: number}>}
     */
    transform() {
        if (!Array.isArray(this.rawData)) return [];
        return this.rawData.map(row => ({
            label: String(row[this.labelField]),
            value: Number(row[this.valueField])
        }));
    }
} 