import axios from 'axios'

axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    let message
    if (error.response) {
        message = error.response.data
    } else if (error.request) {
        message = 'No response received from server.'
    } else {
        message = error.message
    }
    iziToast.error({
        title: 'Error',
        message: message,
        position: 'bottomCenter'
    });
    return Promise.reject(error);
});

export default axios
