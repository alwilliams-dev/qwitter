<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-pa-lg">
        <div class="row items-center justify-between q-mb-lg">
          <h2 class="q-my-none">My Collections</h2>
          <q-btn
            @click="openCreateCollectionDialog"
            color="primary"
            label="New Collection"
            rounded
            unelevated
            no-caps
            icon="add"
          />
        </div>

        <!-- Empty state -->
        <div v-if="collections.length === 0" class="text-center q-py-lg">
          <q-icon name="folder_open" size="64px" color="grey-5" />
          <p class="text-grey-7 q-mt-md">No collections yet. Create one to start bookmarking qweets!</p>
        </div>

        <!-- Collections List -->
        <div v-else class="row q-col-gutter-md">
          <div
            v-for="collection in collections"
            :key="collection.id"
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card
              @click="selectCollection(collection)"
              class="collection-card cursor-pointer"
            >
              <q-card-section>
                <div class="text-h6 text-weight-bold">{{ collection.name }}</div>
                <div class="text-caption text-grey">{{ collection.qweets ? collection.qweets.length : 0 }} qweets</div>
                <div v-if="collection.description" class="text-body2 q-mt-md text-grey-8">
                  {{ collection.description }}
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn
                  @click.stop="shareCollection(collection)"
                  color="primary"
                  label="Share"
                  flat
                  dense
                  no-caps
                  icon="share"
                />
                <q-btn
                  @click.stop="deleteCollection(collection)"
                  color="negative"
                  flat
                  dense
                  round
                  icon="delete"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </q-scroll-area>

    <!-- Create Collection Dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Create Collection</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showCreateDialog = false" />
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newCollectionName"
            label="Collection Name"
            outlined
            dense
            class="q-mb-md"
          />
          <q-input
            v-model="newCollectionDescription"
            label="Description (optional)"
            outlined
            dense
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" flat @click="showCreateDialog = false" />
          <q-btn
            label="Create"
            color="primary"
            @click="createCollection"
            :disable="!newCollectionName"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Collection Detail Dialog -->
    <q-dialog v-model="showDetailDialog" persistent>
      <q-card style="min-width: 500px; max-width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedCollection?.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showDetailDialog = false" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div v-if="selectedCollection?.description" class="text-body2 q-mb-md text-grey-8">
            {{ selectedCollection.description }}
          </div>
          <div class="text-caption text-grey q-mb-lg">
            {{ selectedCollection?.qweets ? selectedCollection.qweets.length : 0 }} qweets bookmarked
          </div>

          <!-- Bookmarked Qweets -->
          <div v-if="selectedCollection?.qweets && selectedCollection.qweets.length > 0">
            <div v-for="qweet in selectedCollection.qweets" :key="qweet.id" class="q-mb-md">
              <q-card>
                <q-card-section>
                  <div class="text-subtitle2 text-weight-bold">Danny Connell</div>
                  <div class="text-caption text-grey">@danny__connell</div>
                  <div class="text-body2 q-mt-md">{{ qweet.content }}</div>
                  <div class="text-caption text-grey q-mt-sm">{{ qweet.date | relativeDate }}</div>
                </q-card-section>
                <q-card-actions>
                  <q-btn
                    @click="removeQweetFromCollection(qweet)"
                    color="negative"
                    label="Remove"
                    flat
                    dense
                    no-caps
                    icon="delete"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </div>
          <div v-else class="text-center text-grey">
            <p>No qweets in this collection yet.</p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Share Collection Dialog -->
    <q-dialog v-model="showShareDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Share "{{ shareCollectionName }}"</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showShareDialog = false" />
        </q-card-section>

        <q-card-section>
          <p class="q-mb-md text-body2">Share this collection with your friends via a unique link:</p>
          <div class="row q-gutter-md">
            <q-input
              v-model="shareLink"
              readonly
              outlined
              dense
              class="col"
            />
            <q-btn
              @click="copyShareLink"
              color="primary"
              icon="content_copy"
              round
              flat
            />
          </div>
          <q-linear-progress
            v-if="shareLinkCopied"
            :value="1"
            color="positive"
            class="q-mt-md"
          />
          <p v-if="shareLinkCopied" class="text-caption text-positive q-mt-sm">Link copied!</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Close" flat @click="showShareDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { formatDistance } from 'date-fns'

export default {
  name: 'PageCollections',
  data() {
    return {
      collections: [],
      showCreateDialog: false,
      showDetailDialog: false,
      showShareDialog: false,
      newCollectionName: '',
      newCollectionDescription: '',
      selectedCollection: null,
      shareCollectionName: '',
      shareCollectionId: '',
      shareLink: '',
      shareLinkCopied: false
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  methods: {
    openCreateCollectionDialog() {
      this.newCollectionName = ''
      this.newCollectionDescription = ''
      this.showCreateDialog = true
    },
    createCollection() {
      if (!this.newCollectionName.trim()) return

      const newCollection = {
        name: this.newCollectionName,
        description: this.newCollectionDescription,
        qweets: [],
        createdAt: Date.now(),
        sharedWith: []
      }

      db.collection('collections').add(newCollection)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Collection created successfully!',
            position: 'top'
          })
          this.showCreateDialog = false
        })
        .catch(error => {
          console.error('Error creating collection:', error)
          this.$q.notify({
            type: 'negative',
            message: 'Error creating collection',
            position: 'top'
          })
        })
    },
    deleteCollection(collection) {
      this.$q.dialog({
        title: 'Delete Collection',
        message: `Are you sure you want to delete "${collection.name}"? This action cannot be undone.`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        db.collection('collections').doc(collection.id).delete()
          .then(() => {
            this.$q.notify({
              type: 'positive',
              message: 'Collection deleted',
              position: 'top'
            })
          })
          .catch(error => {
            console.error('Error deleting collection:', error)
            this.$q.notify({
              type: 'negative',
              message: 'Error deleting collection',
              position: 'top'
            })
          })
      })
    },
    selectCollection(collection) {
      this.selectedCollection = collection
      this.showDetailDialog = true
    },
    shareCollection(collection) {
      this.shareCollectionId = collection.id
      this.shareCollectionName = collection.name
      this.shareLink = `${window.location.origin}?sharedCollection=${collection.id}`
      this.shareLinkCopied = false
      this.showShareDialog = true
    },
    copyShareLink() {
      navigator.clipboard.writeText(this.shareLink)
        .then(() => {
          this.shareLinkCopied = true
          setTimeout(() => {
            this.shareLinkCopied = false
          }, 2000)
        })
        .catch(err => {
          console.error('Failed to copy:', err)
        })
    },
    removeQwestFromCollection(qweet) {
      if (!this.selectedCollection) return

      const updatedQweets = this.selectedCollection.qweets.filter(q => q.id !== qweet.id)

      db.collection('collections').doc(this.selectedCollection.id).update({
        qweets: updatedQweets
      })
        .then(() => {
          this.selectedCollection.qweets = updatedQweets
          this.$q.notify({
            type: 'positive',
            message: 'Qweet removed from collection',
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
    removeQweetFromCollection(qweet) {
      if (!this.selectedCollection) return

      const updatedQweets = this.selectedCollection.qweets.filter(q => q.id !== qweet.id)

      db.collection('collections').doc(this.selectedCollection.id).update({
        qweets: updatedQweets
      })
        .then(() => {
          this.selectedCollection.qweets = updatedQweets
          this.$q.notify({
            type: 'positive',
            message: 'Qweet removed from collection',
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
    }
  },
  mounted() {
    // Load collections
    db.collection('collections').onSnapshot(snapshot => {
      this.collections = []
      snapshot.forEach(doc => {
        const collection = doc.data()
        collection.id = doc.id
        this.collections.push(collection)
      })
    })
  }
}
</script>

<style lang="sass" scoped>
.collection-card
  transition: all 0.3s ease
  &:hover
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
    transform: translateY(-2px)
</style>
