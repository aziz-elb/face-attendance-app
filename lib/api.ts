const API_URL = "http://localhost:3000"; // Update this with your local IP if testing on a physical device

export const api = {
  getUsers: async () => {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
  },
  
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
    const users = await response.json();
    if (users.length > 0) {
      return users[0];
    }
    throw new Error("Invalid email or password");
  },
  
  signup: async (userData) => {
    // Check if user already exists
    const existingResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
    const existingUsers = await existingResponse.json();
    
    if (existingUsers.length > 0) {
      throw new Error("User with this email already exists");
    }
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        role: userData.role || "USER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });
    return response.json();
  }
};
