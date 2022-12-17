<template>
    <div @click="$emit('show-borrower', borrower)">
        <div class="borrower">{{ fullName }}</div>
    </div>
</template>

<script>
    export default {
        name: 'borrower',

        props: ['borrower'],

        computed: {
            fullName() {
                return this.borrower.surname + ` (${this.borrower.katakana})`
                + this.borrower.surname !== this.borrower.frenchSurname ? this.borrower.frenchSurname : ''
            }
        }
    }
</script>
