<template>
  <q-dialog
    :value="value"
    @input="$emit('input', $event)"
    @hide="reset"
  >
    <q-card class="send-bookmarks-dialog">
      <q-card-section>
        <div class="text-h6 text-weight-bold">Send bookmarks</div>
        <div class="text-body2 text-grey-7">
          {{ qweets.length }} bookmarked {{ qweets.length === 1 ? 'qweet' : 'qweets' }} selected
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select
          v-model="selectedFriends"
          :options="friends"
          option-label="name"
          option-value="id"
          label="To"
          multiple
          use-chips
          outlined
        >
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section avatar>
                <q-avatar size="md">
                  <img :src="scope.opt.avatar">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ scope.opt.name }}</q-item-label>
                <q-item-label caption>{{ scope.opt.handle }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-input
          v-model="note"
          class="q-mt-md"
          label="Add a message (optional)"
          maxlength="280"
          counter
          autogrow
          outlined
        />
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md q-px-md">
        <q-btn
          v-close-popup
          label="Cancel"
          color="grey-8"
          flat
          rounded
          no-caps
        />
        <q-btn
          @click="send"
          :disable="!selectedFriends.length || !qweets.length"
          color="primary"
          label="Send"
          rounded
          unelevated
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import friends from 'src/data/friends'

export default {
  name: 'SendBookmarksDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    qweets: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      friends,
      selectedFriends: [],
      note: ''
    }
  },
  methods: {
    send() {
      this.$emit('send', {
        friends: this.selectedFriends,
        note: this.note
      })
      this.$emit('input', false)
    },
    reset() {
      this.selectedFriends = []
      this.note = ''
    }
  }
}
</script>

<style lang="sass">
.send-bookmarks-dialog
  width: 100%
  max-width: 420px
</style>
