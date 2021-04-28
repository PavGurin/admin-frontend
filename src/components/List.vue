<template lang="pug">
  b-container
    b-form-radio-group(
        v-model="mode"
        :options="modeList"
        name="plain-inline"
        plain
      )
      template(v-if='mode === "films"')
        b-select(
        v-model="selected"
        :options="options"
        )

    b-table(
      :items="list"
      :fields="fields"
    )
      // status template
      template(v-slot:cell(status)="row") {{status(row.item.status) || 'Сериал' }}
      // actions template
      template(v-slot:cell(actions)="row")
        b-spinner(v-if="loading")
        template(v-else)
          template(v-if="row.item.status === 'PENDING'")
            b-button(
              variant="outline-primary"
              v-on:click="convert(row.item.name)"
              :disabled="isConvertPending"
            ) Конвертировать
          template(v-else-if="row.item.status === 'CONVERTING'")
            b-button(
              v-on:click="row.toggleDetails"
            ) {{ row.detailsShowing ? 'Скрыть' : 'Показать'}} ссылки
          template(v-else-if="typeof row.item.status !== 'string'")
            b-button(variant="outline-primary"
             v-on:click="row.toggleDetails"
            ) {{ row.detailsShowing ? 'Скрыть' : 'Показать'}} Сезоны

          template(v-if="row.item.status === 'DONE'")
            b-button(variant="danger") Удалить

      template(v-slot:row-details="row")
        b-spinner(v-if="loading")
        div(v-else-if="typeof row.item.status !== 'string'")
          div(v-for="(status, i) in $store.getters.getSeasonsList(row.index)") {{status}} Сезон
            b-button(variant="outline-primary"
            class='episodes'
            v-on:click="toggleState(row.item.name + row.index + i)"
             ) {{ stateList[row.item.name + row.index + i] ? 'Cкрыть' : 'Показать'}} Серии
            code {{ selected }}
            TableSerials(
              v-if="stateList[row.item.name + row.index + i]"
              :list="$store.getters.getEpisodesByStatus(row.index, i)"
            )
        div(v-else)
          div(v-for="film in filmsLinks(row.item.name)")
            a(target='_blank' :href="film.url") {{ film.quality }}
            br
          b-button(
            variant="outline-primary"
            v-on:click="convert(row.item.name)"
          ) Конвертировать еще раз
          b-button(variant="danger" v-on:click="remove(row.item.name)") Опубликовать
          b-button(variant="danger") Удалить

</template>

<script>
import * as R from 'ramda'
import axios from '@/utils/axios'
import TableSerials from './TableSerials'

export default {
  name: 'List',
  components: {TableSerials},
  data () {
    return {
      fields: [{
        key: 'name',
        label: 'Имя',
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
      mode: 'films',
      token: null,
      loading: false,
      isConvertPending: false,
      stateList: {},
      modeList: [
        {value: 'films', text: 'Фильмы'},
        {value: 'serials', text: 'Сериалы'},
      ],
      options: [
        {value: null, text: 'Все'},
        {value: 'PENDING', text: 'Ожидающие'},
        {value: 'CONVERTING', text: 'Конвертирующиеся'},
        {value: 'DONE', text: 'Готовые'},
      ],
    }
  },
  created () {
    this.$store.dispatch('getList')
  },
  mounted () {
    this.getList()
    axios.get('/token').then(R.prop('data')).then(r => {
      console.log(r)
      this.token = r.token
    }).catch(console.error)

    this.intervalId = setInterval(() => {
      this.getList()
    }, 20 * 10000)
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  computed: {
    list () {
      if (this.mode === 'films') {
        if (this.selected !== null) {
          return this.$store.getters.getFilmsList.filter(item => item.status === this.selected)
        }
        return this.$store.getters.getFilmsList
      }
      if (this.mode === 'serials') {
        return this.$store.getters.getSerialsList
      }
    },
  },
  methods: {
    toggleState (key) {
      this.$set(this.stateList, key, !this.stateList[key])
    },
    filmsLinks (name) {
      const id = name.split('-')[0]
      return [
        1080, 720, 480,
      ].map(quality =>
        ({
          url: `https://1win.tv/film/${id}/${quality}/video.mp4?token=${this.token}`,
          quality,
        })
      )
    },
    async getList () {
      return this.$store.state.allVideosList
    },
    async getFilmsList () {
      return this.$store.state.films.filmsList
    },
    async getSerialsList () {
      return this.$store.state.serials.serialsList
    },
    status (text) {
      return {
        PENDING: 'Ожидает',
        CONVERTING: 'В процессе конвертации',
        DONE: 'Готово',
      }[text]
    },
    async convert (name) {
      if (this.isConvertPending) {
        return
      }
      this.isConvertPending = true
      try {
        await axios.post(`/${encodeURIComponent(name)}`)
        await this.getList()
      } catch (e) {
        console.log(e)
      } finally {
        this.isConvertPending = false
      }
    },
    remove (name) {
      this.loading = true
      axios
        .delete(`/${encodeURIComponent(name)}`)
        .then(() => this.getList())
    },
  },
}
</script>
