/*
 * Helpers for messaging a collection of bookmarked qweets to friends.
 * Kept free of Firebase so the shape of a message document lives in one place.
 */

function toSharedQweet(qweet) {
  return {
    id: qweet.id,
    content: qweet.content,
    date: qweet.date
  }
}

function toRecipient(friend) {
  return {
    id: friend.id,
    name: friend.name,
    handle: friend.handle,
    avatar: friend.avatar
  }
}

/*
 * Builds one message document per recipient, each one carrying a copy of the
 * qweets that were shared (so a message still reads correctly after the
 * original qweet is deleted or un-bookmarked).
 */
export function buildBookmarkMessages({ friends = [], qweets = [], note = '', date = Date.now() } = {}) {
  if (!friends.length || !qweets.length) {
    return []
  }

  const sharedQweets = qweets.map(toSharedQweet)

  return friends.map(friend => ({
    recipient: toRecipient(friend),
    note: note.trim(),
    qweets: sharedQweets,
    date
  }))
}

export default buildBookmarkMessages
