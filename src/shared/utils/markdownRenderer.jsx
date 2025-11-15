import katex from 'katex'
import 'katex/dist/katex.min.css'

// Simple markdown renderer for chat messages with math support
export function renderMarkdown(text) {
  if (!text) return null

  const elements = []
  const lines = text.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (!line.trim()) {
      elements.push(<br key={`br-${i}`} />)
      i++
      continue
    }

    // Display math block \[...\] (can be multi-line)
    if (line.trim().startsWith('\\[')) {
      let mathContent = line.replace('\\[', '').trim()
      i++
      
      // Collect multi-line math
      while (i < lines.length && !lines[i].includes('\\]')) {
        mathContent += '\n' + lines[i]
        i++
      }
      
      // Add the closing line
      if (i < lines.length) {
        mathContent += '\n' + lines[i].replace('\\]', '').trim()
        i++
      }
      
      // Render the math
      try {
        const html = katex.renderToString(mathContent.trim(), {
          displayMode: true,
          throwOnError: false
        })
        elements.push(
          <div 
            key={`math-${i}`} 
            className="math-display"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
      } catch (e) {
        elements.push(<pre key={`math-error-${i}`}>{mathContent}</pre>)
      }
      continue
    }

    // Display math block $$...$$
    if (line.trim().startsWith('$$')) {
      let mathContent = line.replace('$$', '').trim()
      i++
      
      // Collect multi-line math
      while (i < lines.length && !lines[i].includes('$$')) {
        mathContent += '\n' + lines[i]
        i++
      }
      
      // Add the closing line
      if (i < lines.length) {
        mathContent += '\n' + lines[i].replace('$$', '').trim()
        i++
      }
      
      // Render the math
      try {
        const html = katex.renderToString(mathContent.trim(), {
          displayMode: true,
          throwOnError: false
        })
        elements.push(
          <div 
            key={`math-${i}`} 
            className="math-display"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
      } catch (e) {
        elements.push(<pre key={`math-error-${i}`}>{mathContent}</pre>)
      }
      continue
    }

    // Images on their own line ![alt](url)
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/)
    if (imageMatch) {
      elements.push(
        <img 
          key={`img-${i}`}
          src={imageMatch[2]}
          alt={imageMatch[1] || 'Image'}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            margin: '8px 0',
            display: 'block'
          }}
        />
      )
      i++
      continue
    }

    // Headers
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} style={{ marginTop: '16px', marginBottom: '8px' }}>
          {parseInlineContent(line.slice(3))}
        </h2>
      )
      i++
      continue
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} style={{ marginTop: '12px', marginBottom: '6px' }}>
          {parseInlineContent(line.slice(4))}
        </h3>
      )
      i++
      continue
    }

    // Numbered lists
    if (/^\d+\.\s/.test(line)) {
      const listItems = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        const content = lines[i].replace(/^\d+\.\s/, '')
        listItems.push(
          <li key={`li-${i}`}>{parseInlineContent(content)}</li>
        )
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ marginBottom: '12px' }}>
          {listItems}
        </ol>
      )
      continue
    }

    // Bullet lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        const content = lines[i].slice(2)
        listItems.push(
          <li key={`li-${i}`}>{parseInlineContent(content)}</li>
        )
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ marginBottom: '12px' }}>
          {listItems}
        </ul>
      )
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} style={{ marginBottom: '12px' }}>
        {parseInlineContent(line)}
      </p>
    )
    i++
  }

  return <div>{elements}</div>
}

// Parse inline content (math, bold, italic, links)
function parseInlineContent(text) {
  const elements = []
  let currentIndex = 0
  let key = 0

  // First, handle inline math
  const allMatches = []

  // Find all inline math \(...\)
  const inlineMathRegex1 = /\\\((.+?)\\\)/g
  let match
  while ((match = inlineMathRegex1.exec(text)) !== null) {
    allMatches.push({
      type: 'math',
      start: match.index,
      end: match.index + match[0].length,
      content: match[1]
    })
  }

  // Find all inline math $...$
  const inlineMathRegex2 = /\$([^\$\n]+?)\$/g
  while ((match = inlineMathRegex2.exec(text)) !== null) {
    allMatches.push({
      type: 'math',
      start: match.index,
      end: match.index + match[0].length,
      content: match[1]
    })
  }

  // Find images
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  while ((match = imageRegex.exec(text)) !== null) {
    allMatches.push({
      type: 'image',
      start: match.index,
      end: match.index + match[0].length,
      alt: match[1],
      url: match[2]
    })
  }

  // Find links
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  while ((match = linkRegex.exec(text)) !== null) {
    allMatches.push({
      type: 'link',
      start: match.index,
      end: match.index + match[0].length,
      text: match[1],
      url: match[2]
    })
  }

  // Find bold
  const boldRegex = /\*\*(.+?)\*\*/g
  while ((match = boldRegex.exec(text)) !== null) {
    allMatches.push({
      type: 'bold',
      start: match.index,
      end: match.index + match[0].length,
      text: match[1]
    })
  }

  // Find italic
  const italicRegex = /\*(.+?)\*/g
  while ((match = italicRegex.exec(text)) !== null) {
    allMatches.push({
      type: 'italic',
      start: match.index,
      end: match.index + match[0].length,
      text: match[1]
    })
  }

  // Sort by position
  allMatches.sort((a, b) => a.start - b.start)

  // Remove overlapping matches
  const validMatches = []
  let lastEnd = 0
  allMatches.forEach(match => {
    if (match.start >= lastEnd) {
      validMatches.push(match)
      lastEnd = match.end
    }
  })

  // Build result
  validMatches.forEach(match => {
    // Add text before match
    if (match.start > currentIndex) {
      elements.push(text.substring(currentIndex, match.start))
    }

    // Add formatted element
    if (match.type === 'math') {
      try {
        const html = katex.renderToString(match.content, {
          displayMode: false,
          throwOnError: false
        })
        elements.push(
          <span 
            key={`math-${key++}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
      } catch (e) {
        elements.push(`$${match.content}$`)
      }
    } else if (match.type === 'image') {
      elements.push(
        <img 
          key={`img-${key++}`}
          src={match.url}
          alt={match.alt || 'Image'}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            margin: '4px 0',
            display: 'inline-block',
            verticalAlign: 'middle'
          }}
        />
      )
    } else if (match.type === 'link') {
      elements.push(
        <a 
          key={`link-${key++}`} 
          href={match.url} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {match.text}
        </a>
      )
    } else if (match.type === 'bold') {
      elements.push(<strong key={`bold-${key++}`}>{match.text}</strong>)
    } else if (match.type === 'italic') {
      elements.push(<em key={`italic-${key++}`}>{match.text}</em>)
    }

    currentIndex = match.end
  })

  // Add remaining text
  if (currentIndex < text.length) {
    elements.push(text.substring(currentIndex))
  }

  return elements.length > 0 ? elements : text
}
