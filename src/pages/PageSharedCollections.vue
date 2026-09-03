<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-pa-lg">
        <div class="row items-center justify-between q-mb-lg">
          <h2 class="q-my-none">Shared Collections</h2>
        </div>

        <!-- Empty state -->
        <div v-if="sharedCollections.length === 0" class="text-center q-py-lg">
          <q-icon name="share" size="64px" color="grey-5" />
          <p class="text-grey-7 q-mt-md">No collections shared with you yet.</p>
        </div>

        <!-- Shared Collections List -->
        <div v-else class="row q-col-gutter-md">
          <div
            v-for="collection in sharedCollections"
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
                <div class="text-caption text-grey-6 q-mt-sm">Shared by: {{ collection.sharedBy }}</div>
                <div v-if="collection.description" class="text-body2 q-mt-md text-grey-8">
                  {{ collection.description }}
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn
                  @click.stop="viewCollection(collection)"
                  color="primary"
                  label="View"
                  flat
                  dense
                  no-caps
                  icon="visibility"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </q-scroll-area>

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
          <div class="text-caption text-grey q-mb-md">
            {{ selectedCollection?.qweets ? selectedCollection.qweets.length : 0 }} qweets bookmarked
          </div>
          <div class="text-caption text-grey-6 q-mb-lg">
            Shared by: {{ selectedCollection?.sharedBy }}
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
              </q-card>
            </div>
          </div>
          <div v-else class="text-center text-grey">
            <p>No qweets in this collection.</p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { formatDistance } from 'date-fns'

export default {
  name: 'PageSharedCollections',
  data() {
    return {
      sharedCollections: [],
      showDetailDialog: false,
      selectedCollection: null
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  methods: {
    selectCollection(collection) {
      this.selectedCollection = collection
      this.showDetailDialog = true
    },
    viewCollection(collection) {
      this.selectedCollection = collection
      this.showDetailDialog = true
    }
  },
  mounted() {
    // Load shared collections
    db.collection('collections').onSnapshot(snapshot => {
      this.sharedCollections = []
      snapshot.forEach(doc => {
        const collection = doc.data()
        collection.id = doc.id
        // Add all collections (in a real app, you would filter by shared status)
        this.sharedCollections.push(collection)
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
