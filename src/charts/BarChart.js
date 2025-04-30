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

    render() {
        const normalizedData = this.normalizeData();
        const dimensions = this.calculateDimensions();

        if (this.orientation === 'horizontal') {
            return this.renderHorizontal(normalizedData, dimensions);
        } else {
            return this.renderVertical(normalizedData, dimensions);
        }
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
        const labelWidth = maxLabelLength + 2;
        // Calculate spacing between bars
        let spacing = 0;
        let extraLines = 0;
        if (chartHeight > numBars && numBars > 1) {
            spacing = Math.floor((chartHeight - numBars) / (numBars - 1));
            extraLines = (chartHeight - numBars) % (numBars - 1);
        }
        // Render each bar with spacing
        data.forEach((item, idx) => {
            const barLength = this.scaleValue(item.value, dimensions);
            const label = this.renderer.pad(item.label, labelWidth);
            const bar = this.renderer.repeat(this.character, barLength);
            const value = this.showValues ? ` (${item.value})` : '';
            lines.push(`${label} ${bar}${value}`);
            // Add vertical spacing after each bar except the last
            if (idx < numBars - 1) {
                for (let s = 0; s < spacing; s++) {
                    lines.push('');
                }
                // Distribute any extra lines
                if (extraLines > 0) {
                    lines.push('');
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
        // Add labels, centered under each bar
        if (this.showLabels) {
            let labelLine = Array(chartLineWidth).fill(' ');
            data.forEach((item, i) => {
                let label = item.label;
                // Truncate label if it would overflow chart width
                if (label.length > chartLineWidth) {
                    label = label.slice(0, chartLineWidth);
                }
                const labelStart = Math.max(0, Math.min(chartLineWidth - label.length, barPositions[i] - Math.floor((label.length - 1) / 2)));
                for (let j = 0; j < label.length && (labelStart + j) < chartLineWidth; j++) {
                    labelLine[labelStart + j] = label[j];
                }
            });
            lines.push(labelLine.join(''));
        }
        return lines.join('\n');
    }
} 