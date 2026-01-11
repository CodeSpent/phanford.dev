import type { Token, TokenType, TokenPosition } from '../../types/latex'

/**
 * LaTeX Tokenizer
 *
 * Converts LaTeX source string into a stream of tokens.
 * Handles commands, brace groups, comments, and text.
 */

export interface TokenizerResult {
  tokens: Token[]
  errors: { message: string; position: TokenPosition }[]
}

export function tokenize(source: string): TokenizerResult {
  const tokens: Token[] = []
  const errors: { message: string; position: TokenPosition }[] = []

  let pos = 0
  let line = 1
  let column = 1

  function getPosition(): TokenPosition {
    return { line, column, offset: pos }
  }

  function advance(count: number = 1): void {
    for (let i = 0; i < count; i++) {
      if (source[pos] === '\n') {
        line++
        column = 1
      } else {
        column++
      }
      pos++
    }
  }

  function peek(offset: number = 0): string {
    return source[pos + offset] || ''
  }

  function isWhitespace(char: string): boolean {
    return char === ' ' || char === '\t'
  }

  function isAlpha(char: string): boolean {
    return /[a-zA-Z]/.test(char)
  }

  function addToken(type: TokenType, value: string, position: TokenPosition): void {
    tokens.push({ type, value, position })
  }

  while (pos < source.length) {
    const char = peek()
    const position = getPosition()

    // Comments: % to end of line
    if (char === '%') {
      let comment = ''
      while (pos < source.length && peek() !== '\n') {
        comment += peek()
        advance()
      }
      addToken('comment', comment, position)
      continue
    }

    // Newlines
    if (char === '\n') {
      addToken('newline', '\n', position)
      advance()
      continue
    }

    // Whitespace (spaces and tabs)
    if (isWhitespace(char)) {
      let ws = ''
      while (pos < source.length && isWhitespace(peek())) {
        ws += peek()
        advance()
      }
      addToken('whitespace', ws, position)
      continue
    }

    // Commands: \commandname or \specialchar
    if (char === '\\') {
      advance() // skip backslash

      if (pos >= source.length) {
        errors.push({ message: 'Unexpected end of input after backslash', position })
        break
      }

      const nextChar = peek()

      // Special single-character commands (like \\ or \%)
      if (!isAlpha(nextChar)) {
        addToken('command', nextChar, position)
        advance()
        continue
      }

      // Regular command names (alphabetic characters only)
      let commandName = ''
      while (pos < source.length && isAlpha(peek())) {
        commandName += peek()
        advance()
      }

      addToken('command', commandName, position)
      continue
    }

    // Opening brace
    if (char === '{') {
      addToken('openBrace', '{', position)
      advance()
      continue
    }

    // Closing brace
    if (char === '}') {
      addToken('closeBrace', '}', position)
      advance()
      continue
    }

    // Text: everything else until we hit a special character
    let text = ''
    while (pos < source.length) {
      const c = peek()
      if (c === '\\' || c === '{' || c === '}' || c === '%' || c === '\n') {
        break
      }
      text += c
      advance()
    }

    if (text.length > 0) {
      addToken('text', text, position)
    }
  }

  return { tokens, errors }
}

/**
 * Utility to print tokens for debugging
 */
export function debugTokens(tokens: Token[]): string {
  return tokens
    .map(t => {
      const value = t.value.replace(/\n/g, '\\n').slice(0, 20)
      return `${t.position.line}:${t.position.column} ${t.type.padEnd(12)} "${value}"`
    })
    .join('\n')
}
