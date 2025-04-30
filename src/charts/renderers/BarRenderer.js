import { Renderer } from '../../core/Renderer.js';

export class BarRenderer extends Renderer {
    constructor(options = {}) {
        super(options);
        this.orientation = options.orientation || 'horizontal';
        this.barSpacing = options.barSpacing || 1;
        this.showAxis = options.showAxis !== false;
    }

    /**
     * Renders a horizontal bar
     * @param {number} length - Length of the bar
     * @param {string} label - Label for the bar
     * @param {number} value - Value of the bar
     * @param {number} labelWidth - Width for the label
     * @returns {string} Rendered bar line
     */
    renderHorizontalBar(length, label, value, labelWidth) {
        const paddedLabel = this.pad(label, labelWidth);
        const bar = this.repeat(this.character, length);
        const valueText = this.showValues ? ` (${value})` : '';
        return `${paddedLabel} ${bar}${valueText}`;
    }

    /**
     * Renders a vertical bar
     * @param {number} height - Height of the bar
     * @param {number} width - Width of the bar
     * @param {number} maxHeight - Maximum height of the chart
     * @returns {string[]} Array of bar lines
     */
    renderVerticalBar(height, width, maxHeight) {
        const lines = [];
        for (let y = maxHeight - 1; y >= 0; y--) {
            const isBar = y < height;
            const bar = isBar ? this.repeat(this.character, width) : ' '.repeat(width);
            lines.push(bar);
        }
        return lines;
    }

    /**
     * Renders the axis for a vertical bar chart
     * @param {number} height - Height of the chart
     * @param {number} maxValue - Maximum value
     * @param {number} steps - Number of steps to show
     * @returns {string[]} Array of axis lines
     */
    renderVerticalAxis(height, maxValue, steps = 5) {
        if (!this.showAxis) return [];

        const lines = [];
        const stepValue = maxValue / (steps - 1);

        for (let i = 0; i < steps; i++) {
            const value = stepValue * i;
            const y = Math.round((i / (steps - 1)) * (height - 1));
            const label = this.formatValue(value);
            lines[y] = `${this.pad(label, 8)} ${this.verticalLine(1, '│')[0]}`;
        }

        return lines;
    }

    /**
     * Renders the axis for a horizontal bar chart
     * @param {number} width - Width of the chart
     * @param {number} maxValue - Maximum value
     * @param {number} steps - Number of steps to show
     * @returns {string} Axis line
     */
    renderHorizontalAxis(width, maxValue, steps = 5) {
        if (!this.showAxis) return '';

        const stepValue = maxValue / (steps - 1);
        const stepWidth = width / (steps - 1);
        const line = [];

        for (let i = 0; i < steps; i++) {
            const value = stepValue * i;
            const x = Math.round(i * stepWidth);
            const label = this.formatValue(value);
            line[x] = '┼';
            if (i < steps - 1) {
                line[x + 1] = this.horizontalLine(stepWidth - 1, '─');
            }
        }

        return line.join('');
    }
} 