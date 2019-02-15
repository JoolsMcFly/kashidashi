<template>
    <div class="row">
        <div class="col" :title="loan.book.title">
            <span class="badge badge-pill badge-primary">{{ loan.book.code }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'loan',

        props: ['loan'],
    }
</script>
