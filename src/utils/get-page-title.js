import defaultSettings from '@/settings'

const title = defaultSettings.title || 'user-rights-authoraty'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
