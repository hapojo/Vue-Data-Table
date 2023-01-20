export default class User {

    getUsers() {
        return fetch('data/users.json').then(res => res.json()).then(d => d.data);
    }
}