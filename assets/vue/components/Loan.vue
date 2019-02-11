<template>
    <div class="row">
        <div class="col-2">
            <span class="badge badge-pill badge-primary">{{ loan.book.code }}</span>
        </div>
        <div class="col-10">
            <span class="book-title">{{ loan.book.title }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'loan',

        props: ['loan'],
    }
</script>
