<template>
    <div @click="$emit('show-borrower', borrower)">
        <div class="borrower">{{ fullname }}</div>
    </div>
</template>

<script>
    export default {
        name: 'borrower',

        props: ['borrower'],

        computed: {
            fullname() {
                return this.borrower.surname + ` (${this.borrower.katakana})`
                + this.borrower.surname !== this.borrower.french_surname ? this.borrower.french_surname : ''
            }
        }
    }
</script>
