<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            v-model="newQweetContent"
            class="new-qweet"
            placeholder="What's happening?"
            maxlength="280"
            bottom-slots
            counter
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://s.gravatar.com/avatar/ce7f3697e231df38b3ca6065848520da?s=80">
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewQweet"
            :disable="!newQweetContent"
            class="q-mb-lg"
            color="primary"
            label="Qweet"
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

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item
            v-for="qweet in qweets"
            :key="qweet.id"
            class="qweet q-py-md"
          >
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img src="https://s.gravatar.com/avatar/ce7f3697e231df38b3ca6065848520da?s=80">
              </q-avatar>
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
              <div class="qweet-icons row justify-between q-mt-sm">
                <q-btn
                  color="grey"
                  icon="far fa-comment"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  color="grey"
                  icon="fas fa-retweet"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  @click="toggleLiked(qweet)"
                  :color="qweet.liked ? 'pink' : 'grey'"
                  :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  @click="openBookmarkDialog(qweet)"
                  :color="isQweetBookmarked(qweet) ? 'primary' : 'grey'"
                  :icon="isQweetBookmarked(qweet) ? 'fas fa-bookmark' : 'far fa-bookmark'"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  @click="deleteQweet(qweet)"
                  color="grey"
                  icon="fas fa-trash"
                  size="sm"
                  flat
                  round
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>

    <!-- Bookmark Dialog -->
    <q-dialog v-model="showBookmarkDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add to Collection</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showBookmarkDialog = false" />
        </q-card-section>

        <q-card-section>
          <p class="q-mb-md text-body2">Select a collection to add this qweet:</p>
          
          <div v-if="userCollections.length === 0" class="text-center text-grey">
            <p>No collections yet. <router-link to="/collections">Create one</router-link></p>
          </div>

          <q-list v-else separator>
            <q-item
              v-for="collection in userCollections"
              :key="collection.id"
              clickable
              @click="addQweetToCollection(collection)"
            >
              <q-item-section>
                <q-item-label>{{ collection.name }}</q-item-label>
                <q-item-label caption>{{ collection.qweets ? collection.qweets.length : 0 }} qweets</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-checkbox
                  :model-value="isQweetInCollection(selectedQweet, collection)"
                  @update:model-value="val => val ? addQweetToCollection(collection) : removeQweetFromCollection(collection)"
                  @click.stop
                />
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator class="q-my-md" />

          <q-input
            v-model="newCollectionName"
            label="New Collection Name"
            outlined
            dense
            placeholder="Create new collection..."
            @keyup.enter="createNewCollection"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-if="newCollectionName"
            label="Create & Add"
            color="primary"
            @click="createNewCollection"
          />
          <q-btn label="Done" flat @click="showBookmarkDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { formatDistance } from 'date-fns'

export default {
  name: 'PageHome',
  data() {
    return {
      newQweetContent: '',
      qweets: [],
      userCollections: [],
      showBookmarkDialog: false,
      selectedQweet: null,
      newCollectionName: ''
    }
  },
  methods: {
    addNewQweet() {
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false
      }
      // this.qweets.unshift(newQweet)
      db.collection('qweets').add(newQweet).then(function(docRef) {
        console.log('Document written with ID: ', docRef.id)
      }).catch(function(error) {
        console.error('Error adding document: ', error)
      })
      this.newQweetContent = ''
    },
    deleteQweet(qweet) {
      db.collection('qweets').doc(qweet.id).delete().then(function() {
        console.log('Document successfully deleted!');
      }).catch(function(error) {
        console.error('Error removing document: ', error);
      })
    },
    toggleLiked(qweet) {
      db.collection('qweets').doc(qweet.id).update({
        liked: !qweet.liked
      })
      .then(function() {
        console.log('Document successfully updated!')
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error)
      })
    },
    openBookmarkDialog(qweet) {
      this.selectedQweet = qweet
      this.newCollectionName = ''
      this.showBookmarkDialog = true
      this.loadUserCollections()
    },
    loadUserCollections() {
      db.collection('collections').onSnapshot(snapshot => {
        this.userCollections = []
        snapshot.forEach(doc => {
          const collection = doc.data()
          collection.id = doc.id
          this.userCollections.push(collection)
        })
      })
    },
    isQweetBookmarked(qweet) {
      return this.userCollections.some(collection => 
        collection.qweets && collection.qweets.some(q => q.id === qweet.id)
      )
    },
    isQweetInCollection(qweet, collection) {
      if (!qweet || !collection.qweets) return false
      return collection.qweets.some(q => q.id === qweet.id)
    },
    addQweetToCollection(collection) {
      if (!this.selectedQweet) return

      const qweetData = {
        id: this.selectedQweet.id,
        content: this.selectedQweet.content,
        date: this.selectedQweet.date,
        liked: this.selectedQweet.liked
      }

      // Check if qweet is already in collection
      if (this.isQweetInCollection(this.selectedQweet, collection)) {
        this.$q.notify({
          type: 'info',
          message: 'This qweet is already in the collection',
          position: 'top'
        })
        return
      }

      const updatedQweets = collection.qweets ? [...collection.qweets, qweetData] : [qweetData]

      db.collection('collections').doc(collection.id).update({
        qweets: updatedQweets
      })
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: `Added to "${collection.name}"`,
            position: 'top'
          })
        })
        .catch(error => {
          console.error('Error adding qweet to collection:', error)
          this.$q.notify({
            type: 'negative',
            message: 'Error adding qweet to collection',
            position: 'top'
          })
        })
    },
    removeQweetFromCollection(collection) {
      if (!this.selectedQweet || !collection.qweets) return

      const updatedQweets = collection.qweets.filter(q => q.id !== this.selectedQweet.id)

      db.collection('collections').doc(collection.id).update({
        qweets: updatedQweets
      })
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Removed from collection',
            position: 'top'
          })
        })
        .catch(error => {
          console.error('Error removing qweet:', error)
          this.$q.notify({
            type: 'negative',
            message: 'Error removing qweet',
            position: 'top'
          })
        })
    },
    createNewCollection() {
      if (!this.newCollectionName.trim()) return

      const newCollection = {
        name: this.newCollectionName,
        description: '',
        qweets: [],
        createdAt: Date.now(),
        sharedWith: []
      }

      db.collection('collections').add(newCollection)
        .then(docRef => {
          const addedCollection = {
            id: docRef.id,
            ...newCollection
          }
          this.addQweetToCollection(addedCollection)
          this.newCollectionName = ''
        })
        .catch(error => {
          console.error('Error creating collection:', error)
          this.$q.notify({
            type: 'negative',
            message: 'Error creating collection',
            position: 'top'
          })
        })
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  mounted() {
    db.collection('qweets').orderBy('date').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let qweetChange = change.doc.data()
        qweetChange.id = change.doc.id
        if (change.type === 'added') {
          console.log('New qweet: ', qweetChange)
          this.qweets.unshift(qweetChange)
        }
        if (change.type === 'modified') {
          console.log('Modified qweet: ', qweetChange)
          let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
          Object.assign(this.qweets[index], qweetChange)
        }
        if (change.type === 'removed') {
          console.log('Removed qweet: ', qweetChange)
          let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
          this.qweets.splice(index, 1)
        }
      })
    })

    // Load collections for bookmark status
    this.loadUserCollections()
  }
}
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.qweet-content
  white-space: pre-line
.qweet-icons
  margin-left: -5px
</style>
