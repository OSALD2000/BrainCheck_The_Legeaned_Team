import { getAuthToken } from "../views/auth/auth";

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8888";

export const fetch_function = async (subUrl, method, body) => {
    const token = getAuthToken();

    const response = await fetch(`${API_URL}/${subUrl}`, {
        method: method,
        headers: {
            'authorization': token.toString(),
            'Content-Type': 'application/json'
        },
        body: (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') ? JSON.stringify(body) : null,
    });

    return response;
}