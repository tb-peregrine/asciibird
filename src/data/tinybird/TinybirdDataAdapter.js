export class TinybirdDataAdapter {
    /**
     * @param {Array} data - The Tinybird API response (array of objects)
     * @param {Object} options - Adapter options
     * @param {string} options.labelField - The field to use as the label
     */
    constructor(rawData, options = {}) {
        this.rawData = rawData;
        this.labelField = options.labelField || 'label';
    }

    /**
     * Transforms the Tinybird API response to [{ label, value }, ...]
     * @returns {Array<{label: string, value: number}>}
     */
    transform() {
        if (!Array.isArray(this.rawData)) {
            return [];
        }

        return this.rawData.map(row => {
            const label = row[this.labelField] || 'Unknown';
            const value = Number(row.value);
            return {
                label,
                value: isNaN(value) ? 0 : value
            };
        });
    }
} 