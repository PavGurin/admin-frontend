<template lang="pug">
  div
    //b-select(
    //  v-model="selected"
    //  :options="options"
    //)
    b-button(
        variant="outline-primary"
      ) Конвертировать Все
    b-table(
      :items="list"
      :fields="fields"
    )

      template(v-slot:cell(episode)="row") {{row.item}}
      template(v-slot:cell(status)="row") {{ getEpisodeStatus(row.item)}}
        //b-badge 1080
        //b-badge 720
        //b-badge 480
      template(v-slot:cell(actions)="row")
        template(v-if="getEpisodeStatus(row.item) === 'PENDING'")
          b-button(
            variant="outline-primary"
            v-on:click="convert(row.item.name)"
          ) Конвертировать
        template(v-else-if="getEpisodeStatus(row.item) === 'CONVERTING'")
          b-button(
            v-on:click="row.toggleDetails"
          ) Ожидаем завершения
        template(v-if="getEpisodeStatus(row.item) === 'DONE'")
          b-button(variant="danger") Удалить

</template>

<script>
export default {
  name: 'TableSerials',
  data () {
    return {
      fields: [{
        key: 'episode',
        label: 'Серия',
        sortable: true,
      },
      {
        key: 'status',
        label: 'Статус',
      },
      {
        key: 'actions',
        label: 'Действия',
      }],
      selected: null,
      options: [
        {value: null, text: 'Все'},
        {value: 'PENDING', text: 'Ожидающие'},
        {value: 'CONVERTING', text: 'Конвертирующиеся'},
        {value: 'DONE', text: 'Готовые'},
      ],
    }
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
    episodeInfo: {
      type: Object,
      required: true,
    },
    serialId: {
      type: Number,
    },
    seasonId: {
      type: Number,
    },
  },
  methods: {
    getEpisodeStatus (item) {
      return this.$store.getters.getStatusOfEpisode(this.serialId, this.seasonId + 1, item)
    },
  },
}
</script>

<style scoped>

</style>
