import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN })
}

export function formatDateDistance(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true, 
    locale: zhCN 
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.replace(/[\u4e00-\u9fa5]/g, 'aa').length / 2
  return Math.ceil(words / wordsPerMinute)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}