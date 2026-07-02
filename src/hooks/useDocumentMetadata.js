import { useEffect } from 'react'

export function useDocumentMetadata({ title, description, ogTitle, ogDescription, ogImage }) {
  useEffect(() => {
    // 1. Update Document Title
    if (title) {
      document.title = `${title} | KnoWMi`
    }

    // 2. Update Meta Description
    if (description) {
      let descMeta = document.querySelector("meta[name='description']")
      if (!descMeta) {
        descMeta = document.createElement('meta')
        descMeta.setAttribute('name', 'description')
        document.head.appendChild(descMeta)
      }
      descMeta.setAttribute('content', description)
    }

    // 3. Update OG Title
    if (ogTitle || title) {
      let ogTitleMeta = document.querySelector("meta[property='og:title']")
      if (!ogTitleMeta) {
        ogTitleMeta = document.createElement('meta')
        ogTitleMeta.setAttribute('property', 'og:title')
        document.head.appendChild(ogTitleMeta)
      }
      ogTitleMeta.setAttribute('content', ogTitle || title)
    }

    // 4. Update OG Description
    if (ogDescription || description) {
      let ogDescMeta = document.querySelector("meta[property='og:description']")
      if (!ogDescMeta) {
        ogDescMeta = document.createElement('meta')
        ogDescMeta.setAttribute('property', 'og:description')
        document.head.appendChild(ogDescMeta)
      }
      ogDescMeta.setAttribute('content', ogDescription || description)
    }

    // 5. Update OG Image
    if (ogImage) {
      let ogImgMeta = document.querySelector("meta[property='og:image']")
      if (!ogImgMeta) {
        ogImgMeta = document.createElement('meta')
        ogImgMeta.setAttribute('property', 'og:image')
        document.head.appendChild(ogImgMeta)
      }
      ogImgMeta.setAttribute('content', ogImage)
    }
  }, [title, description, ogTitle, ogDescription, ogImage])
}
