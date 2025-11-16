/**
 * Responsive Chart Configuration for Plotly
 * Provides mobile-optimized layouts and configurations
 */

/**
 * Get responsive chart height based on screen size
 * @param {string} chartType - Type of chart (e.g., 'main', 'volume', 'indicator')
 * @returns {string} - Height in pixels
 */
export function getResponsiveHeight(chartType = 'main') {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024
  
  if (width < 768) {
    // Mobile
    return {
      main: '350px',
      volume: '250px',
      indicator: '300px',
    }[chartType] || '300px'
  } else if (width < 1024) {
    // Tablet
    return {
      main: '450px',
      volume: '350px',
      indicator: '400px',
    }[chartType] || '400px'
  } else {
    // Desktop
    return {
      main: '500px',
      volume: '400px',
      indicator: '400px',
    }[chartType] || '500px'
  }
}

/**
 * Get responsive margins for chart layout
 * @returns {object} - Margin configuration
 */
export function getResponsiveMargins() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024
  
  if (width < 768) {
    // Mobile - tighter margins
    return {
      l: 50,  // Left
      r: 20,  // Right
      t: 50,  // Top
      b: 50,  // Bottom
    }
  } else if (width < 1024) {
    // Tablet
    return {
      l: 60,
      r: 30,
      t: 60,
      b: 60,
    }
  } else {
    // Desktop
    return {
      l: 80,
      r: 40,
      t: 70,
      b: 60,
    }
  }
}

/**
 * Get responsive font sizes
 * @returns {object} - Font size configuration
 */
export function getResponsiveFonts() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024
  
  if (width < 768) {
    // Mobile - smaller fonts
    return {
      title: 14,
      axis: 11,
      tick: 10,
      legend: 11,
    }
  } else if (width < 1024) {
    // Tablet
    return {
      title: 16,
      axis: 12,
      tick: 11,
      legend: 12,
    }
  } else {
    // Desktop
    return {
      title: 18,
      axis: 14,
      tick: 12,
      legend: 13,
    }
  }
}

/**
 * Get responsive legend configuration
 * @returns {object} - Legend configuration
 */
export function getResponsiveLegend() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024
  const fonts = getResponsiveFonts()
  
  if (width < 768) {
    // Mobile - horizontal legend at bottom
    return {
      orientation: 'h',
      yanchor: 'top',
      y: -0.15,
      xanchor: 'center',
      x: 0.5,
      font: {
        size: fonts.legend,
      },
      bgcolor: 'rgba(0,0,0,0)',
    }
  } else {
    // Tablet/Desktop - horizontal legend at top
    return {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.02,
      xanchor: 'right',
      x: 1,
      font: {
        size: fonts.legend,
      },
    }
  }
}

/**
 * Get responsive modebar (toolbar) configuration
 * @returns {array} - Buttons to show/hide
 */
export function getResponsiveModeBar() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024
  
  if (width < 768) {
    // Mobile - minimal buttons
    return {
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: [
        'select2d',
        'lasso2d',
        'zoomIn2d',
        'zoomOut2d',
        'autoScale2d',
        'hoverClosestCartesian',
        'hoverCompareCartesian',
        'toggleSpikelines',
      ],
    }
  } else {
    // Tablet/Desktop - more buttons
    return {
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: [
        'select2d',
        'lasso2d',
      ],
    }
  }
}

/**
 * Apply responsive configuration to a Plotly layout
 * @param {object} baseLayout - Base layout configuration
 * @param {object} options - Additional options
 * @returns {object} - Enhanced responsive layout
 */
export function applyResponsiveLayout(baseLayout = {}, options = {}) {
  const margins = getResponsiveMargins()
  const fonts = getResponsiveFonts()
  const legend = getResponsiveLegend()
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024
  
  // Mobile-specific adjustments
  const mobileAdjustments = width < 768 ? {
    // Compact title
    title: {
      ...(baseLayout.title || {}),
      font: {
        size: fonts.title,
        ...(baseLayout.title?.font || {}),
      },
      pad: {
        t: 10,
        b: 10,
      },
    },
    // Compact axes
    xaxis: {
      ...(baseLayout.xaxis || {}),
      title: {
        text: baseLayout.xaxis?.title || '',
        font: { size: fonts.axis },
        standoff: 10,
      },
      tickfont: { size: fonts.tick },
      automargin: true,
    },
    yaxis: {
      ...(baseLayout.yaxis || {}),
      title: {
        text: baseLayout.yaxis?.title || '',
        font: { size: fonts.axis },
        standoff: 10,
      },
      tickfont: { size: fonts.tick },
      automargin: true,
    },
  } : {}
  
  return {
    ...baseLayout,
    ...mobileAdjustments,
    margin: {
      ...(baseLayout.margin || {}),
      ...margins,
    },
    legend: options.showLegend !== false ? {
      ...(baseLayout.legend || {}),
      ...legend,
    } : { showlegend: false },
    autosize: true,
    hovermode: baseLayout.hovermode || 'x unified',
  }
}

/**
 * Get complete responsive chart config
 * @param {string} chartType - Type of chart
 * @returns {object} - Complete responsive configuration
 */
export function getResponsiveChartConfig(chartType = 'main') {
  return {
    height: getResponsiveHeight(chartType),
    config: {
      responsive: true,
      ...getResponsiveModeBar(),
    },
    style: {
      width: '100%',
      height: getResponsiveHeight(chartType),
    },
  }
}

