// Plotly theme configuration that adapts to light/dark mode

export function getPlotlyTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  
  if (isDark) {
    return {
      plot_bgcolor: '#1C1C1E',
      paper_bgcolor: '#1C1C1E',
      font: {
        color: '#FFFFFF',
        family: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        weight: 500
      },
      xaxis: {
        gridcolor: '#38383A',
        linecolor: '#48484A',
        tickcolor: '#48484A',
        zerolinecolor: '#48484A',
        title: {
          font: { color: '#98989D' }
        }
      },
      yaxis: {
        gridcolor: '#38383A',
        linecolor: '#48484A',
        tickcolor: '#48484A',
        zerolinecolor: '#48484A',
        title: {
          font: { color: '#98989D' }
        }
      },
      title: {
        font: {
          family: 'Anton, sans-serif',
          color: '#FFFFFF',
          size: 20,
          weight: 400
        },
        xanchor: 'left',
        x: 0.05
      },
      legend: {
        bgcolor: 'rgba(44, 44, 46, 0.9)',
        bordercolor: '#48484A',
        font: { color: '#FFFFFF' }
      },
      hoverlabel: {
        bgcolor: '#2C2C2E',
        bordercolor: '#48484A',
        font: { color: '#FFFFFF' }
      }
    }
  } else {
    return {
      plot_bgcolor: '#FFFFFF',
      paper_bgcolor: '#FFFFFF',
      font: {
        color: '#000000',
        family: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        weight: 500
      },
      xaxis: {
        gridcolor: '#E5E5EA',
        linecolor: '#D1D1D6',
        tickcolor: '#D1D1D6',
        zerolinecolor: '#D1D1D6',
        title: {
          font: { color: '#3C3C43' }
        }
      },
      yaxis: {
        gridcolor: '#E5E5EA',
        linecolor: '#D1D1D6',
        tickcolor: '#D1D1D6',
        zerolinecolor: '#D1D1D6',
        title: {
          font: { color: '#3C3C43' }
        }
      },
      title: {
        font: {
          family: 'Anton, sans-serif',
          color: '#000000',
          size: 20,
          weight: 400
        },
        xanchor: 'left',
        x: 0.05
      },
      legend: {
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        bordercolor: '#D1D1D6',
        font: { color: '#000000' }
      },
      hoverlabel: {
        bgcolor: '#FFFFFF',
        bordercolor: '#D1D1D6',
        font: { color: '#000000' }
      }
    }
  }
}

// Apply theme to existing layout
export function applyThemeToLayout(baseLayout) {
  const theme = getPlotlyTheme()
  
  return {
    ...baseLayout,
    ...theme,
    xaxis: {
      ...baseLayout.xaxis,
      ...theme.xaxis
    },
    yaxis: {
      ...baseLayout.yaxis,
      ...theme.yaxis
    },
    title: typeof baseLayout.title === 'string' 
      ? { text: baseLayout.title, ...theme.title }
      : { ...baseLayout.title, font: theme.title.font },
    legend: {
      ...baseLayout.legend,
      ...theme.legend
    }
  }
}

