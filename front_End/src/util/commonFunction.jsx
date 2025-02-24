export function getUserData() {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    let user;
    try {
        user = JSON.parse(userData); // Only parse if it's valid JSON
    } catch (error) {
        user = userData; // If parsing fails, assume it's a string (user ID)
    }

    if (!token || !user) {
        return null;
    }

    return { token, user };
}
