/*
 * Qwitter has no accounts system yet, so - just like the hardcoded author of a
 * qweet - the people you can message are a fixed list of friends.
 */

const friends = [
  {
    id: 'sarah__hughes',
    name: 'Sarah Hughes',
    handle: '@sarah__hughes',
    avatar: 'https://s.gravatar.com/avatar/0f1c9f9a1e2b3c4d5e6f708192a3b4c5?s=80&d=identicon'
  },
  {
    id: 'marcus__lee',
    name: 'Marcus Lee',
    handle: '@marcus__lee',
    avatar: 'https://s.gravatar.com/avatar/1a2b3c4d5e6f708192a3b4c5d6e7f809?s=80&d=identicon'
  },
  {
    id: 'priya__nair',
    name: 'Priya Nair',
    handle: '@priya__nair',
    avatar: 'https://s.gravatar.com/avatar/2b3c4d5e6f708192a3b4c5d6e7f8091a?s=80&d=identicon'
  },
  {
    id: 'tom__okafor',
    name: 'Tom Okafor',
    handle: '@tom__okafor',
    avatar: 'https://s.gravatar.com/avatar/3c4d5e6f708192a3b4c5d6e7f8091a2b?s=80&d=identicon'
  }
]

export function findFriend(id) {
  return friends.find(friend => friend.id === id)
}

export default friends
