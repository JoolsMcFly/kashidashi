<template>
    <div class="col-xs-12">
        <div class="card">
            <div class="card-header">Books information</div>
            <div class="card-body">
                <p
                    class="pointer"
                    @click="downloadBooks">Download all books <i
                    class="far fa-file-excel"></i></p>
                <hr/>
                <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
                    <p>Upload a book file</p>
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
        </div>
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
        downloadBooks() {
            document.location = '/download/books'
        },
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
                    iziToast.success({
                        title: 'Success',
                        message: res.data.message,
                        position: 'bottomCenter'
                    });
                })
                .finally(() => {
                    this.isSaving = false
                })
        }
    },
}
</script>
