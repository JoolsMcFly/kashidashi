<template>
    <div>
        <span class="badge badge-primary float-right ml-2">{{ loan.book.code }}</span>
        <p>{{ loan.book.title }}</p>
        <p class="text-danger">
            <i class="far fa-calendar-alt"></i> {{ loan.startedAt }} ({{loan.duration}} days)
        </p>
        <p>Borrowed by {{ loan.borrower.surname + ` (${loan.borrower.katakana})`}} {{
            loan.borrower.surname !== loan.borrower.frenchSurname ? loan.borrower.frenchSurname : '' }}</p>
    </div>
</template>

<script>
    export default {
        name: 'loan',

        props: ['loan'],
    }
</script>
