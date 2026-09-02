<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-md q-px-md">
        <div class="text-h6 text-weight-bold">Messages</div>
        <div class="text-body2 text-grey-7">Bookmark collections you have sent</div>
      </div>

      <q-separator
        class="divider"
        color="grey-2"
        size="10px"
      />

      <q-banner
        v-if="!messages.length"
        class="q-ma-md bg-grey-2 text-grey-8"
        rounded
      >
        <template v-slot:avatar>
          <q-icon name="far fa-paper-plane" color="primary" />
        </template>
        No messages yet. Select some bookmarks and send them to a friend.
      </q-banner>

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item
            v-for="message in messages"
            :key="message.id"
            class="message q-py-md"
          >
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img :src="message.recipient.avatar">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                To <strong>{{ message.recipient.name }}</strong>
                <span class="text-grey-7">
                  {{ message.recipient.handle }} 
                  <br class="lt-md">&bull; {{ message.date | relativeDate }}
                </span>
              </q-item-label>

              <q-item-label
                v-if="message.note"
                class="message-note text-body1"
              >{{ message.note }}</q-item-label>

              <q-item-label caption class="q-mt-sm">
                {{ message.qweets.length }} shared {{ message.qweets.length === 1 ? 'qweet' : 'qweets' }}
              </q-item-label>

              <q-card
                v-for="qweet in message.qweets"
                :key="qweet.id"
                class="shared-qweet q-mt-sm"
                flat
                bordered
              >
                <q-card-section class="q-py-sm">
                  <div class="text-caption text-grey-7">
                    <strong>Danny Connell</strong> @danny__connell &bull; {{ qweet.date | relativeDate }}
                  </div>
                  <div class="qweet-content text-body2">{{ qweet.content }}</div>
                </q-card-section>
              </q-card>
            </q-item-section>

            <q-item-section side top>
              <q-btn
                @click="deleteMessage(message)"
                color="grey"
                icon="fas fa-trash"
                size="sm"
                flat
                round
              >
                <q-tooltip>Delete message</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { formatDistance } from 'date-fns'

export default {
  name: 'PageMessages',
  data() {
    return {
      messages: []
    }
  },
  methods: {
    deleteMessage(message) {
      db.collection('messages').doc(message.id).delete().then(function() {
        console.log('Message successfully deleted!')
      }).catch(function(error) {
        console.error('Error removing document: ', error)
      })
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  mounted() {
    db.collection('messages').orderBy('date').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let messageChange = change.doc.data()
        messageChange.id = change.doc.id
        if (change.type === 'added') {
          this.messages.unshift(messageChange)
        }
        if (change.type === 'modified') {
          let index = this.messages.findIndex(message => message.id === messageChange.id)
          Object.assign(this.messages[index], messageChange)
        }
        if (change.type === 'removed') {
          let index = this.messages.findIndex(message => message.id === messageChange.id)
          this.messages.splice(index, 1)
        }
      })
    })
  }
}
</script>

<style lang="sass">
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.message:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.message-note
  white-space: pre-line
.shared-qweet
  .qweet-content
    white-space: pre-line
</style>
