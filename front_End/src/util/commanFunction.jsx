export function getUserData(){
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const user = JSON.parse(userData)
    return {token: token,user};
}