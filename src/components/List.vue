<template lang="pug">
  b-container

    b-select(
      :options="options"
      v-model="selected"
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
            ) {{ row.detailsShowing ? 'Скрыть' : 'Показать'}} Серии

          template(v-if="row.item.status === 'DONE'")
            b-button(variant="danger") Удалить

      template(v-slot:row-details="row")
        b-spinner(v-if="loading")
        div(v-else-if="typeof row.item.status !== 'string'")
          div(v-for="(status, episodeName) in $store.getters.getEpisodesByStatus(row.index)") {{episodeName}}
            b-button(
              variant="outline-primary"
              v-on:click="convert(row.item.name)"
              :disabled="isConvertPending"
            ) Конвертировать
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

export default {
  name: 'List',
  data () {
    return {
      fields: [{
        key: 'name',
        label: 'Имя',
        sortable: true
      },
      {
        key: 'status',
        label: 'Статус'
      },
      {
        key: 'actions',
        label: 'Действия'
      }],
      selected: null,
      token: null,
      loading: false,
      isConvertPending: false,
      options: [
        {value: null, text: 'Все'},
        {value: 'PENDING', text: 'Ожидающие'},
        {value: 'CONVERTING', text: 'Конвертирующиеся'},
        {value: 'DONE', text: 'Готовые'}
      ]
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
  watch: {
    filmList (l) {
      console.log('l', l)
    }
  },
  computed: {
    list () {
      if (this.selected !== null) {
        return this.$store.state.filmsList.filter(item => item.status === this.selected)
      }
      console.log(this.$store.state.filmsList)
      return this.$store.state.filmsList
    }
  },
  methods: {
    filmsLinks (name) {
      console.log('name for filmLinks ' + name)
      const id = name.split('-')[0]

      return [
        1080, 720, 480
      ].map(quality =>
        ({
          url: `https://1win.tv/film/${id}/${quality}/video.mp4?token=${this.token}`,
          quality
        })
      )
    },
    async getList () {
      return this.$store.state.filmsList
      // this.filmList = await axios
      //   .get('/list')
      //   .then(R.prop('data'))
    },
    status (text) {
      return {
        PENDING: 'Ожидает',
        CONVERTING: 'В процессе конвертации',
        DONE: 'Готово'
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
    createSerialsList () {
      const seriesList = {}

      for (let film in this.filmList) {
        if (typeof this.filmList[film].status === 'object') {
          let key = this.filmList[film].name
          seriesList[key] = this.filmList[film].status
        }
      }
      return seriesList
    }
  }
}
</script>
