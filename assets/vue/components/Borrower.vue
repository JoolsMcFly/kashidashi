<template>
    <div @click="$emit('show-borrower', borrower)">
        <div class="borrower"><span class="borrower-id">{{ this.borrower.id }}</span>{{ fullname }}</div>
    </div>
</template>

<script>
    export default {
        name: 'borrower',

        props: ['borrower'],

        computed: {
            fullname() {
                return this.borrower.firstname + ' ' + this.borrower.surname
            }
        }
    }
</script>
