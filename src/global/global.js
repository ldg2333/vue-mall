import Vue from 'vue'

let serve = 'http://localhost:8082';

let defaultAvatarUrl = 'http://localhost:8082/avatar/defaultAvatar.jpeg'



export default {
    install () {
        Vue.prototype.$serve = serve;
        Vue.prototype.$defaultAvatarUrl = defaultAvatarUrl;
    }
}