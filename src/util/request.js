import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://192.168.1.120:9091/shucun',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});


export {
    instance as axios
}