import defaultSettings from '@/settings'

const title = defaultSettings.title || '城科固定资产维修系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
