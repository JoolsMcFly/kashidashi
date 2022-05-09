<template>
    <div class="col-xs-12">
        <div class="card">
            <div class="card-header">Borrowers information</div>
            <div class="card-body">
                <p
                    class="pointer"
                    @click="downloadBorrowers">Download existing borrowers <i
                    class="fa fa-download"></i></p>
                <hr />
                <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
                    <p>Upload a borrower file</p>
                    <div class="dropbox">
                        <input type="file" ref="user" :disabled="isSaving"
                               @change="filesChange();"
                               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                               class="input-file"/>
                        <p v-if="isInitial">
                            Drag your file here<br> or click to browse
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
        </div>
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
        downloadBorrowers() {
            document.location = '/download/borrowers'
        },
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
                .finally(() => {
                    this.isSaving = false
                })
        }
    },
}
</script>
