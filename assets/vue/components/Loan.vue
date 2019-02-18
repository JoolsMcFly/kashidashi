<template>
    <div>
        <span class="badge badge-primary float-right ml-2">{{ loan.book.code }}</span>
        <p>{{ loan.book.title }}</p>
        <p :class="loanClasses(loan)"><i class="far fa-calendar-alt"></i> {{ loan.started_at }}</p>
        <a href="#" @click="$emit('clicked')" class="card-link">Remove</a>
    </div>
</template>

<script>
    export default {
        name: 'loan',

        methods: {
            loanClasses(loan) {
                if (loan.duration > 21) {
                    return 'text-danger'
                }

                return ''
            }
        },

        props: ['loan'],
    }
</script>
