export function getUserData(){
    const userData = localStorage.getItem('user');
    return JSON.parse(userData);
}