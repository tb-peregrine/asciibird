/**
 * Base Chart class that all chart types extend from
 */
export class Chart {
    constructor(options = {}) {
        // Core chart options
        this.width = options.width || 80;
        this.height = options.height || 20;
        this._data = options.data || [];
        this.title = options.title || '';

        // Tinybird configuration
        this.tinybird = options.tinybird || null;

        // Rendering options
        this.character = options.character || '█';
        this.showLabels = options.showLabels !== false;
        this.showValues = options.showValues !== false;

        // Initialize the data adapter
        this.adapter = this.createDataAdapter();
    }

    set data(newData) {
        this._data = newData;
    }

    get data() {
        return this._data;
    }

    /**
     * Creates a data adapter for the specific chart type
     * Must be implemented by child classes
     */
    createDataAdapter() {
        throw new Error('createDataAdapter must be implemented by child class');
    }

    /**
     * Normalizes data to a consistent format
     */
    normalizeData() {
        return this.adapter.transform(this.data);
    }

    /**
     * Calculates chart dimensions based on data and options
     */
    calculateDimensions() {
        const normalizedData = this.normalizeData();
        return {
            width: this.width,
            height: this.height,
            maxValue: Math.max(...normalizedData.map(d => d.value)),
            minValue: Math.min(...normalizedData.map(d => d.value))
        };
    }

    /**
     * Fetches data from Tinybird if configured
     */
    async fetchData(params = {}) {
        if (!this.tinybird) {
            throw new Error('Tinybird configuration is required to fetch data');
        }

        const response = await fetch(`${this.tinybird.endpoint}?${new URLSearchParams(params)}`, {
            headers: {
                'Authorization': `Bearer ${this.tinybird.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from Tinybird');
        }

        const data = await response.json();
        this.data = data.data;
        return this.data;
    }

    /**
     * Renders the chart
     * Must be implemented by child classes
     */
    render() {
        throw new Error('render must be implemented by child class');
    }

    /**
     * Converts a value to a scaled length based on chart dimensions
     */
    scaleValue(value, dimensions) {
        return Math.round((value / dimensions.maxValue) * this.width);
    }
} 