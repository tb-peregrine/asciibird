import { Chart } from '../core/Chart.js';
import { BarDataAdapter } from './adapters/BarDataAdapter.js';
import { BarRenderer } from './renderers/BarRenderer.js';

export class BarChart extends Chart {
    constructor(options = {}) {
        super(options);

        // Bar chart specific options
        this.orientation = options.orientation || 'horizontal';
        this.barSpacing = options.barSpacing || 1;
        this.showAxis = options.showAxis !== false;

        // Initialize the renderer
        this.renderer = new BarRenderer({
            character: this.character,
            showLabels: this.showLabels,
            showValues: this.showValues,
            orientation: this.orientation,
            barSpacing: this.barSpacing,
            showAxis: this.showAxis
        });
    }

    createDataAdapter() {
        return new BarDataAdapter(this.data, {
            orientation: this.orientation
        });
    }

    set data(newData) {
        this._data = newData;
        // Update the adapter with new data
        this.adapter = this.createDataAdapter();
    }

    get data() {
        return this._data;
    }

    renderHorizontal(data, dimensions) {
        const lines = [];
        const numBars = data.length;
        const chartHeight = this.height || numBars;
        // Add title if present
        if (this.title) {
            lines.push(this.title);
            lines.push('');
        }
        // Calculate label width
        const maxLabelLength = Math.max(...data.map(d => d.label.length));
        const labelWidth = this.showLabels ? maxLabelLength + 2 : 0;
        // The axis is always at the same column
        const axisCol = labelWidth + (this.showLabels ? 1 : 0);
        // Calculate spacing between bars
        let spacing = 0;
        let extraLines = 0;
        if (chartHeight > numBars && numBars > 1) {
            spacing = Math.floor((chartHeight - numBars) / (numBars - 1));
            extraLines = (chartHeight - numBars) % (numBars - 1);
        }
        // Render each bar with spacing
        data.forEach((item, idx) => {
            // Pad label to labelWidth
            const label = this.showLabels ? this.renderer.pad(item.label, labelWidth) : '';
            const dash = this.showLabels ? '-' : '';
            const axis = this.showAxis ? '|' : '';
            const bar = this.renderer.repeat(this.character, this.scaleValue(item.value, dimensions));
            const value = this.showValues ? ` (${item.value})` : '';
            const sep = this.showLabels ? ' ' : '';
            // Compose the line: [label][dash][axis][sep][bar][value]
            lines.push(`${label}${dash}${axis}${sep}${bar}${value}`);
            // Add vertical spacing after each bar except the last
            if (idx < numBars - 1) {
                for (let s = 0; s < spacing; s++) {
                    // Spacing lines: pad to labelWidth, then add axis in the same column, then sep
                    lines.push(`${''.padEnd(labelWidth, ' ')}${this.showLabels ? ' ' : ''}${this.showAxis ? '|' : ''}${sep}`);
                }
                // Distribute any extra lines
                if (extraLines > 0) {
                    lines.push(`${''.padEnd(labelWidth, ' ')}${this.showLabels ? ' ' : ''}${this.showAxis ? '|' : ''}${sep}`);
                    extraLines--;
                }
            }
        });
        return lines.join('\n');
    }

    renderVertical(data, dimensions) {
        const numBars = data.length;
        const totalWidth = this.width;
        const barWidth = 1; // Always 1 character wide
        const availableSpace = totalWidth - (numBars * barWidth);
        const minSpacing = 1;
        const spacing = numBars > 1 ? Math.max(minSpacing, Math.floor(availableSpace / (numBars - 1))) : 0;
        const barPositions = [];
        let pos = 0;
        for (let i = 0; i < numBars; i++) {
            barPositions.push(pos);
            pos += barWidth + spacing;
        }
        const chartLineWidth = barPositions[numBars - 1] + barWidth;
        const chartHeight = this.height || 10;
        const maxValue = dimensions.maxValue || 1;
        const lines = [];
        if (this.title) {
            lines.push(this.title);
            lines.push('');
        }
        // Calculate bar heights
        const barHeights = data.map(item => maxValue > 0 ? Math.round((item.value / maxValue) * chartHeight) : 0);
        // Prepare chart grid (rows x columns)
        let grid = Array.from({ length: chartHeight }, () => Array(chartLineWidth).fill(' '));
        // Draw bars
        for (let i = 0; i < numBars; i++) {
            for (let y = 0; y < barHeights[i]; y++) {
                grid[chartHeight - 1 - y][barPositions[i]] = this.character;
            }
        }
        // Place value labels directly above the topmost bar character, within the grid
        if (this.showValues) {
            for (let i = 0; i < numBars; i++) {
                const valueStr = String(data[i].value);
                const barTopRow = chartHeight - barHeights[i];
                let labelRow = barTopRow - 1;
                // If the bar fills the chart, place the label inside the topmost bar cell
                if (labelRow < 0) labelRow = 0;
                const valueStart = Math.max(0, barPositions[i] - Math.floor((valueStr.length - 1) / 2));
                for (let j = 0; j < valueStr.length && (valueStart + j) < chartLineWidth; j++) {
                    grid[labelRow][valueStart + j] = valueStr[j];
                }
            }
        }
        // Convert grid to lines
        for (let row = 0; row < chartHeight; row++) {
            lines.push(grid[row].join(''));
        }
        // Add X axis (underscores) only
        if (this.showAxis) {
            let axisLine = Array(chartLineWidth).fill('_');
            lines.push(axisLine.join(''));
        }
        // Add sparse, non-overlapping axes labels in a single line, with '|' under the bar, and labels on the next line
        if (this.showLabels) {
            let markerLine = Array(chartLineWidth).fill(' ');
            let labelLine = Array(chartLineWidth).fill(' ');
            let lastEnd = -1;
            for (let i = 0; i < numBars; i++) {
                let label = data[i].label;
                // Truncate label if it would overflow chart width
                if (label.length > chartLineWidth) {
                    label = label.slice(0, chartLineWidth);
                }
                const labelStart = Math.max(0, Math.min(chartLineWidth - label.length, barPositions[i] - Math.floor((label.length - 1) / 2)));
                const labelEnd = labelStart + label.length - 1;
                // Only place label if it doesn't overlap the previous one and there's at least one space between
                if (labelStart > lastEnd + 1 && labelEnd < chartLineWidth) {
                    // Place '|' directly above the bar position if possible
                    if (barPositions[i] >= 0 && barPositions[i] < chartLineWidth) {
                        markerLine[barPositions[i]] = '|';
                    }
                    for (let j = 0; j < label.length && (labelStart + j) < chartLineWidth; j++) {
                        labelLine[labelStart + j] = label[j];
                    }
                    lastEnd = labelEnd;
                }
            }
            lines.push(markerLine.join(''));
            lines.push(labelLine.join(''));
        }
        return lines.join('\n');
    }

    render() {
        const normalizedData = this.normalizeData();
        const dimensions = this.calculateDimensions();

        if (this.orientation === 'horizontal') {
            return this.renderHorizontal(normalizedData, dimensions);
        } else {
            return this.renderVertical(normalizedData, dimensions);
        }
    }
} 