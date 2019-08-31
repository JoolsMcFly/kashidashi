<template>
    <div class="col-xs-12">
        <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
            <h1>Upload a borrower file</h1>
            <div class="dropbox">
                <input type="file" ref="user" :disabled="isSaving"
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
            <div v-show="Boolean(user)">
                Click to upload <span v-text="fileName"></span>
                <button type="button" @click="upload()" class="btn btn-primary" :disabled="!Boolean(user)">
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
        name: 'userUpload',

        data() {
            return {
                isInitial: true,
                isSaving: false,
                user: null,
            }
        },

        computed: {
            fileName() {
                if (Boolean(this.user)) {
                    return this.user.name
                }

                return ''
            }
        },

        methods: {
            filesChange() {
                this.user = this.$refs.user.files[0]
            },
            reset() {
                this.user = null
                this.$refs.user.value = ''
            },
            upload() {
                let data = new FormData()
                data.append('users', this.user)
                this.isSaving = true
                axios
                    .post(
                        '/api/borrowers-upload',
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
