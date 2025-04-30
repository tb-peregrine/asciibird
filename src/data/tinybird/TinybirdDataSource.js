import { TinybirdDataAdapter } from './TinybirdDataAdapter.js';

export class TinybirdDataSource {
    /**
     * @param {Object} options
     * @param {string} options.url - The Tinybird API endpoint URL
     * @param {string} options.token - The Tinybird API token
     * @param {Object} [options.params] - Query parameters for the API
     * @param {string} [options.labelField] - Field to use as label
     */
    constructor({ url, token, params = {}, labelField = 'label' }) {
        this.url = url;
        this.token = token;
        this.params = params;
        this.labelField = labelField;
    }

    /**
     * Fetches and normalizes data from Tinybird
     * @returns {Promise<Array<{label: string, value: number}>>}
     */
    async getData() {
        const query = new URLSearchParams(this.params).toString();
        const fetchUrl = query ? `${this.url}?${query}` : this.url;
        const response = await fetch(fetchUrl, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Tinybird API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Tinybird returns data in a 'data' property
        const adapter = new TinybirdDataAdapter(data.data, {
            labelField: this.labelField
        });
        return adapter.transform();
    }
} 