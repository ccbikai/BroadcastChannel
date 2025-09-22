document.addEventListener('DOMContentLoaded', () => {
  const postsContainer = document.getElementById('posts-container')
  let loadMoreTrigger = document.getElementById('load-more-trigger')

  if (!loadMoreTrigger || !postsContainer)
    return

  let isLoading = false
  let observer

  const loadMorePosts = async () => {
    if (isLoading)
      return

    isLoading = true

    const url = loadMoreTrigger.href

    loadMoreTrigger.innerHTML = 'Loading...'

    try {
      const response = await fetch(url)
      const text = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, 'text/html')

      const newPosts = doc.querySelectorAll('#posts-container > .item')
      newPosts.forEach((post) => {
        const importedNode = document.importNode(post, true)
        postsContainer.appendChild(importedNode)
      })

      const newTrigger = doc.getElementById('load-more-trigger')
      if (newTrigger) {
        loadMoreTrigger.replaceWith(newTrigger)
        loadMoreTrigger = newTrigger
        loadMoreTrigger.addEventListener('click', (e) => {
          e.preventDefault()
          loadMorePosts()
        })
      }
      else {
        loadMoreTrigger.remove()
        if (observer)
          observer.disconnect()
      }
    }
    catch (error) {
      console.error('Failed to load more posts:', error)
      loadMoreTrigger.innerHTML = 'Failed to load. Click to try again.'
    }
    finally {
      isLoading = false
      if (document.getElementById('load-more-trigger'))
        document.getElementById('load-more-trigger').innerHTML = 'Load More'
    }
  }

  loadMoreTrigger.addEventListener('click', (e) => {
    e.preventDefault()
    loadMorePosts()
  })

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting)
        loadMorePosts()
    },
    {
      rootMargin: '0px 0px 200px 0px',
    },
  )

  observer.observe(loadMoreTrigger)
})
