<template>
    <div class="col-xs-12">
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
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="truncate-books" v-model="truncate">
                <label class="form-check-label" for="truncate-books">
                    Remove existing books not in file?
                </label>
            </div>
            <div v-show="Boolean(book)">
                Click to upload <span v-text="fileName"></span>
                <button type="button" @click="upload()" class="btn btn-primary" :disabled="!Boolean(book)">
                    Upload
                </button>
                or
                <button type="button" @click="reset()" class="btn btn-secondary">Reset</button>
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
                truncate: false
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
                data.append('truncate', this.truncate)
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
                        this.reset()
                        // TODO show success message
                    })
                    .catch((err) => {
                        // TODO show error message
                    })
                    .finally(() => {
                        this.isSaving = false
                    })
            }
        },
    }
</script>
