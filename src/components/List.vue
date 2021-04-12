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
      template(v-slot:cell(status)="row") {{status(row.item.status) || "Сериал" }}
      template(v-slot:cell(actions)="row")
        b-spinner(v-if="loading")
        template(v-else)
          template(v-if="row.item.status === 'PENDING'")
            b-button(variant="outline-primary" v-on:click="convert(row.item.name)") Конвертировать
          template(v-else-if="row.item.status === 'CONVERTING'")
            b-button(
              v-on:click="row.toggleDetails"
            ) {{ row.detailsShowing ? 'Скрыть' : 'Показать'}} ссылки
          template(v-else)
            b-button(variant="outline-primary" v-on:click="convert(row.item.name)") Конвертировать новые серии

          template(v-if="row.item.status === 'DONE'")
            b-button(variant="danger") Удалить

      template(v-slot:row-details="row")
        b-spinner(v-if="loading")
        div(v-else)
          div(v-for="film in filmsLinks(row.item.name)")
            a(target='_blank' :href="film.u") {{ film.q }}
            br
          b-button(
            variant="outline-primary"
            v-on:click="convert(row.item.name)"
          ) Конвертировать еще раз
          b-button(variant="danger" v-on:click="remove(row.item.name)") Опубликовать

</template>

<script>
import * as R from 'ramda'
import axios from '@/utils/axios'

export default {
  name: 'List',
  data: () => ({
    _list: [],
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
    options: [
      {value: null, text: 'Все'},
      {value: 'PENDING', text: 'Ожидающие'},
      {value: 'CONVERTING', text: 'Конвертирующиеся'},
      {value: 'DONE', text: 'Готовые'}
    ]
  }),
  mounted () {
    this.getList().catch(console.error)
    axios.get('/token').then(R.prop('data')).then(r => {
      console.log(r)
      this.token = r.token
    }).catch(console.error)
  },
  computed: {
    list () {
      const filters = []

      if (this.selected !== null) {
        filters.push(R.filter(item => item.status === this.selected))
      }

      if (filters.length === 0) {
        filters.push(r => r)
      }

      return R.pipe(...filters)(this._list)
    }
  },
  methods: {
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
    getList () {
      return axios
        .get('/list')
        .then(R.prop('data'))
        .then(this.assignList.bind(this))
        .then(() => {
          const { selected } = this
          this.selected = 'PENDING'
          this.loading = false
          setTimeout(() => {
            this.selected = selected
          }, 10)
        })
    },
    assignList (bulk) {
      this._list = bulk
    },
    status (text) {
      return {
        PENDING: 'Ожидает',
        CONVERTING: 'В процессе конвертации',
        DONE: 'Готово'
      }[text]
    },
    convert (name) {
      this.loading = true
      axios
        .post(`/${encodeURIComponent(name)}`)
        .then(() => this.getList())
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
