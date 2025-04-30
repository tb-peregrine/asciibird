/**
 * Base Renderer class that provides ASCII rendering utilities
 */
export class Renderer {
    constructor(options = {}) {
        this.character = options.character || '█';
        this.showLabels = options.showLabels !== false;
        this.showValues = options.showValues !== false;
    }

    /**
     * Creates a string of repeated characters
     * @param {string} char - Character to repeat
     * @param {number} length - Number of times to repeat
     * @returns {string} Repeated characters
     */
    repeat(char, length) {
        return char.repeat(Math.max(0, length));
    }

    /**
     * Pads a string to a specific length
     * @param {string} str - String to pad
     * @param {number} length - Target length
     * @param {string} char - Padding character
     * @param {boolean} right - Whether to pad on the right
     * @returns {string} Padded string
     */
    pad(str, length, char = ' ', right = false) {
        const padding = this.repeat(char, length - str.length);
        return right ? str + padding : padding + str;
    }

    /**
     * Creates a horizontal line
     * @param {number} length - Length of the line
     * @param {string} char - Character to use
     * @returns {string} Horizontal line
     */
    horizontalLine(length, char = '─') {
        return this.repeat(char, length);
    }

    /**
     * Creates a vertical line
     * @param {number} height - Height of the line
     * @param {string} char - Character to use
     * @returns {string[]} Array of vertical line segments
     */
    verticalLine(height, char = '│') {
        return Array(height).fill(char);
    }

    /**
     * Creates a box with specified dimensions
     * @param {number} width - Width of the box
     * @param {number} height - Height of the box
     * @param {Object} chars - Box drawing characters
     * @returns {string[]} Array of box lines
     */
    box(width, height, chars = {
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        horizontal: '─',
        vertical: '│'
    }) {
        const lines = [];

        // Top border
        lines.push(
            chars.topLeft +
            this.horizontalLine(width - 2, chars.horizontal) +
            chars.topRight
        );

        // Middle lines
        for (let i = 0; i < height - 2; i++) {
            lines.push(
                chars.vertical +
                this.repeat(' ', width - 2) +
                chars.vertical
            );
        }

        // Bottom border
        lines.push(
            chars.bottomLeft +
            this.horizontalLine(width - 2, chars.horizontal) +
            chars.bottomRight
        );

        return lines;
    }

    /**
     * Formats a value for display
     * @param {number} value - Value to format
     * @param {Object} options - Formatting options
     * @returns {string} Formatted value
     */
    formatValue(value, options = {}) {
        const {
            precision = 0,
            prefix = '',
            suffix = ''
        } = options;

        return `${prefix}${value.toFixed(precision)}${suffix}`;
    }
} 