/**
 * Formats a date string or Date object into a human-readable format
 * @param dateInput - Date string (ISO format) or Date object
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  dateInput: string | Date,
  options: {
    format?: 'long' | 'medium' | 'short'
    includeTime?: boolean
  } = {}
): string {
  const { format = 'medium', includeTime = false } = options

  try {
    // Parse the date if it's a string
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date provided to formatDate:', dateInput)
      return typeof dateInput === 'string' ? dateInput : 'Invalid Date'
    }

    // Format options for different styles
    const formatOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'UTC', // Use UTC to avoid timezone issues with date-only values
    }

    switch (format) {
      case 'long':
        formatOptions.year = 'numeric'
        formatOptions.month = 'long'
        formatOptions.day = 'numeric'
        break
      case 'medium':
        formatOptions.year = 'numeric'
        formatOptions.month = 'short'
        formatOptions.day = 'numeric'
        break
      case 'short':
        formatOptions.year = '2-digit'
        formatOptions.month = 'numeric'
        formatOptions.day = 'numeric'
        break
    }

    if (includeTime) {
      formatOptions.hour = '2-digit'
      formatOptions.minute = '2-digit'
    }

    return new Intl.DateTimeFormat('en-US', formatOptions).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return typeof dateInput === 'string' ? dateInput : 'Invalid Date'
  }
}

/**
 * Formats a date for display in photo cards
 * @param dateInput - Date string (ISO format) or Date object
 * @returns Human-readable date string (e.g., "Jan 15, 2024")
 */
export function formatPhotoDate(dateInput: string | Date): string {
  return formatDate(dateInput, { format: 'medium' })
}

/**
 * Formats a date for datetime attributes in HTML
 * @param dateInput - Date string (ISO format) or Date object
 * @returns ISO date string for datetime attribute
 */
export function formatDateTimeAttribute(dateInput: string | Date): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    if (isNaN(date.getTime())) {
      return typeof dateInput === 'string' ? dateInput : ''
    }
    return date.toISOString().split('T')[0] // Return YYYY-MM-DD format
  } catch (error) {
    console.error('Error formatting datetime attribute:', error)
    return typeof dateInput === 'string' ? dateInput : ''
  }
}

/**
 * Formats a date as a relative time string (e.g., "2 months ago", "3 days ago")
 * @param dateInput - Date string (ISO format) or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(dateInput: string | Date): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    if (isNaN(date.getTime())) {
      return 'Unknown'
    }

    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInSeconds = Math.floor(diffInMs / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    const diffInMonths = Math.floor(diffInDays / 30)
    const diffInYears = Math.floor(diffInDays / 365)

    if (diffInYears > 0) {
      return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`
    } else if (diffInMonths > 0) {
      return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`
    } else if (diffInDays > 0) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`
    } else if (diffInHours > 0) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
    } else if (diffInMinutes > 0) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`
    } else {
      return 'Just now'
    }
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return 'Unknown'
  }
}