<template lang="pug">
  div
    b-select(
      v-model="selected"
      :options="options"
    )
    b-table(
      :items="list"
      :fields="fields"
    )
      template(v-slot:cell(name)="row") {{row.item}}
      template(v-slot:cell(actions)="row") {{11}}
      template(v-slot:cell(status)="row")
        b-badge 1080
        b-badge 720
        b-badge 480
</template>

<script>
export default {
  name: 'TableSerials',
  data () {
    return {
      fields: [{
        key: 'name',
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
  },
}
</script>

<style scoped>

</style>
