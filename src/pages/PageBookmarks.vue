<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-md q-px-md row items-center q-col-gutter-md">
        <div class="col">
          <div class="text-h6 text-weight-bold">Bookmarks</div>
          <div class="text-body2 text-grey-7">
            {{ selected.length }} of {{ bookmarks.length }} selected
          </div>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="toggleSelectAll"
            :disable="!bookmarks.length"
            :label="allSelected ? 'Clear' : 'Select all'"
            class="q-mr-sm"
            color="grey-8"
            flat
            rounded
            no-caps
          />
          <q-btn
            @click="sendDialogOpen = true"
            :disable="!selected.length"
            color="primary"
            icon="far fa-paper-plane"
            label="Send to friends"
            rounded
            unelevated
            no-caps
          />
        </div>
      </div>

      <q-separator
        class="divider"
        color="grey-2"
        size="10px"
      />

      <q-banner
        v-if="!bookmarks.length"
        class="q-ma-md bg-grey-2 text-grey-8"
        rounded
      >
        <template v-slot:avatar>
          <q-icon name="far fa-bookmark" color="primary" />
        </template>
        Nothing bookmarked yet. Tap the bookmark icon on a qweet to save it here,
        then send a collection of them to your friends.
      </q-banner>

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item
            v-for="qweet in bookmarks"
            :key="qweet.id"
            @click="toggleSelected(qweet)"
            class="qweet q-py-md"
            clickable
            v-ripple
          >
            <q-item-section avatar top>
              <q-checkbox
                :value="isSelected(qweet)"
                @input="toggleSelected(qweet)"
                color="primary"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Danny Connell</strong>
                <span class="text-grey-7">
                  @danny__connell 
                  <br class="lt-md">&bull; {{ qweet.date | relativeDate }}
                </span>
              </q-item-label>
              <q-item-label class="qweet-content text-body1">{{ qweet.content }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-btn
                @click.stop="removeBookmark(qweet)"
                color="primary"
                icon="fas fa-bookmark"
                size="sm"
                flat
                round
              >
                <q-tooltip>Remove bookmark</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>

    <send-bookmarks-dialog
      v-model="sendDialogOpen"
      :qweets="selectedQweets"
      @send="sendBookmarks"
    />
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { formatDistance } from 'date-fns'
import { buildBookmarkMessages } from 'src/utils/messages'
import SendBookmarksDialog from 'components/SendBookmarksDialog'

export default {
  name: 'PageBookmarks',
  components: { SendBookmarksDialog },
  data() {
    return {
      bookmarks: [],
      selected: [],
      sendDialogOpen: false
    }
  },
  computed: {
    selectedQweets() {
      return this.bookmarks.filter(qweet => this.selected.includes(qweet.id))
    },
    allSelected() {
      return this.bookmarks.length > 0 && this.selected.length === this.bookmarks.length
    }
  },
  methods: {
    isSelected(qweet) {
      return this.selected.includes(qweet.id)
    },
    toggleSelected(qweet) {
      let index = this.selected.indexOf(qweet.id)
      if (index === -1) {
        this.selected.push(qweet.id)
      }
      else {
        this.selected.splice(index, 1)
      }
    },
    toggleSelectAll() {
      this.selected = this.allSelected ? [] : this.bookmarks.map(qweet => qweet.id)
    },
    removeBookmark(qweet) {
      db.collection('qweets').doc(qweet.id).update({
        bookmarked: false
      })
      .then(function() {
        console.log('Bookmark successfully removed!')
      })
      .catch(function(error) {
        console.error('Error updating document: ', error)
      })
    },
    sendBookmarks({ friends, note }) {
      let messages = buildBookmarkMessages({
        friends,
        qweets: this.selectedQweets,
        note
      })
      if (!messages.length) {
        return
      }
      Promise.all(messages.map(message => db.collection('messages').add(message)))
        .then(() => {
          this.selected = []
          this.$q.notify({
            message: `Sent ${messages[0].qweets.length} bookmarked qweet(s) to ${this.recipientNames(messages)}`,
            color: 'primary',
            actions: [
              { label: 'View', color: 'white', handler: () => this.$router.push('/messages') }
            ]
          })
        })
        .catch(error => {
          console.error('Error adding document: ', error)
          this.$q.notify({
            message: 'Your bookmarks could not be sent. Please try again.',
            color: 'negative'
          })
        })
    },
    recipientNames(messages) {
      return messages.map(message => message.recipient.name).join(', ')
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  mounted() {
    db.collection('qweets').where('bookmarked', '==', true).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let qweetChange = change.doc.data()
        qweetChange.id = change.doc.id
        let index = this.bookmarks.findIndex(qweet => qweet.id === qweetChange.id)
        if (change.type === 'added') {
          this.bookmarks.push(qweetChange)
        }
        if (change.type === 'modified') {
          Object.assign(this.bookmarks[index], qweetChange)
        }
        if (change.type === 'removed') {
          this.bookmarks.splice(index, 1)
          let selectedIndex = this.selected.indexOf(qweetChange.id)
          if (selectedIndex !== -1) {
            this.selected.splice(selectedIndex, 1)
          }
        }
      })
      // Sorted here rather than in the query so no composite index is needed
      this.bookmarks.sort((a, b) => b.date - a.date)
    })
  }
}
</script>

<style lang="sass">
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.qweet-content
  white-space: pre-line
</style>
