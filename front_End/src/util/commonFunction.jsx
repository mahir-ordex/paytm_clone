export function getUserData(){
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const user = JSON.parse(userData)
    if(!token ||!user){
        return null;
    }
    return {token: token,user};
}