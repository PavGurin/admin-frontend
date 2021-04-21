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
      template(v-slot:cell(status)="row") {{status(row.item.status) || 'Сериал' }}
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
            ) {{ seriesList.detailsShowing ? 'Скрыть' : 'Показать'}} Серии

          template(v-if="row.item.status === 'DONE'")
            b-button(variant="danger") Удалить

      template(v-slot:row-details="row")
        b-spinner(v-if="loading")
        div(v-else-if="typeof row.item.status !== 'string'")
          div(v-for="(episode, key) in seriesList[0]") {{key}}
            b-button(
              variant="outline-primary"
              v-on:click="convert(row.item.name)"
              :disabled="isConvertPending"
            ) Конвертировать
        div(v-else)
          div(v-for="film in filmsLinks(row.item.name)")
            a(target='_blank' :href="film.u") {{ film.q }}
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
  data: () => ({
    filmList: [],
    seriesList: [{'1080-1-1.mp4': 'PENDING',
      '1080-1-2.mp4': 'PENDING',
      '1080-1-3.mp4': 'PENDING',
      '1080-1-4.mp4': 'PENDING',
      '1080-1-5.mp4': 'PENDING'}],
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
  }),
  // created: function () {
  //   console.log(`films: ` + this.filmList + `\n`, `series: ` + this.seriesList)
  // },
  mounted () {
    this.getList()
    axios.get('/token').then(R.prop('data')).then(r => {
      console.log(r)
      this.token = r.token
    }).catch(console.error)

    this.intervalId = setInterval(() => {
      this.getList()
    }, 20 * 1000)
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
        return this.filmList.filter(item => item.status === this.selected)
      }
      console.log(this.filmList)
      return this.filmList
    }
  },

  methods: {
    episodesLinks (name) {
      let series = {'1': '2', '3': '4'}
      console.log(name)
      return series
    },
    filmsLinks (name) {
      const id = name.split('-')[0]

      return [
        1080, 720, 480
      ].map(q =>
        ({
          u: `https://1win.tv/film/${id}/${q}/video.mp4?token=${this.token}`,
          q
        })
      )
    },
    async getList () {
      this.filmList = await axios
        .get('/list')
        .then(R.prop('data'))
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
    }
  }
}
</script>
