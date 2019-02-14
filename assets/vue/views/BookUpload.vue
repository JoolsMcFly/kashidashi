<template>
    <div>
        <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
            <h1>Upload a book file</h1>
            <div class="dropbox">
                <input type="file" ref="book" :disabled="isSaving"
                       @change="filesChange();"
                       accept="text/csv"
                       class="input-file"/>
                <p v-if="isInitial">
                    Drag your file here to begin<br> or click to browse
                </p>
                <p v-if="isSaving">
                    Uploading file...
                </p>
            </div>
            <div v-show="Boolean(book)">
                Click to upload <span v-text="fileName"></span>
                <input @click="upload()" type="button" class="btn btn-primary" :disabled="!Boolean(book)" value="Upload"/>
                or <input @click="reset()" type="button" class="btn btn-secondary" value="Reset"/>
            </div>
        </form>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'bookUpload',

        data() {
            return {
                isInitial: true,
                isSaving: false,
                book: null,
            }
        },

        computed: {
            fileName() {
                if (Boolean(this.book)) {
                    return this.book.name
                }

                return ''
            }
        },

        methods: {
            filesChange() {
                this.book = this.$refs.book.files[0]
            },
            reset() {
                this.book = null
                this.$refs.book.value = ''
            },
            upload() {
                let data = new FormData()
                data.append('books', this.book)
                this.isSaving = true
                axios
                    .post(
                        '/api/books-upload',
                        data,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    )
                    .then((res) => {
                        this.book = null
                        // TODO
                        this.$refs.book.files = []
                    })
                    .catch((err) => {
                    })
                    .finally(() => {
                        this.isSaving = false
                    })
            }
        },
    }
</script>
