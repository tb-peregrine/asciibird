# ASCII Bar Chart Component

This project provides a simple way to generate ASCII bar charts using Tinybird data sources. The component uses plain text characters to create visualizations that can be embedded in any HTML page.

## Components

1. **Tinybird Data Source**: A sample data source that provides the raw data for the chart
2. **Tinybird Pipe**: Processes the data and formats it for ASCII visualization
3. **HTML Component**: A simple web interface to display the chart
4. **JavaScript Renderer**: Handles the conversion of data to ASCII art

## Usage

1. Set up your Tinybird data source
2. Configure the pipe with your desired parameters
3. Include the JavaScript file in your HTML
4. Call the render function with your data

## Example

```javascript
const chart = new AsciiBarChart({
    data: [...],
    width: 80,
    height: 20,
    character: '█'
});
chart.render('#chart-container');
```

## Parameters

- `width`: Number of characters wide
- `height`: Number of lines tall
- `character`: The ASCII character to use for bars
- `data`: Array of values to visualize 

## Architecture

AsciiChart.js/
├── src/
│   ├── core/
│   │   ├── Chart.js           # Base chart class
│   │   ├── DataAdapter.js     # Handles data transformation
│   │   └── Renderer.js        # Base rendering utilities
│   ├── charts/
│   │   ├── BarChart.js        # Bar chart implementation
│   │   ├── LineChart.js       # Future line chart
│   │   └── PieChart.js        # Future pie chart
│   └── tinybird/
│       ├── TinybirdClient.js  # Tinybird API client
│       └── adapters/          # Tinybird-specific data adapters
└── examples/
    └── tinybird/
        ├── data_source.sql    # Example data source
        └── pipes/             # Example pipes for each chart type 