import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { jwtDecode } from 'jwt-decode';

// Define the expected structure of the JWT payload
interface CustomJwtPayload {
  name: string;
  email: string;
  [key: string]: any;  // Allows additional fields that might exist in the token
}

// Function to handle Google sign-in and JWT token storage
export const signInWithGoogle = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Get the JWT token
    const token = await user.getIdToken();

    // Store the token in localStorage
    localStorage.setItem('jwt_token', token);

    // Decode the JWT token to extract user details
    const decodedToken = jwtDecode<CustomJwtPayload>(token);  // Use the custom type here
    console.log(decodedToken); // Log the decoded user info

    // Extract details like name and email from the decoded token
    const name = decodedToken.name || user.displayName || 'Guest';
    const email = decodedToken.email || user.email || 'No email';

    // Store the details in localStorage as well
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);

    return { name, email, token }; // You can return the details if you need them immediately
  } catch (error) {
    console.error('Error signing in: ', error);
    throw error; // You can throw or handle the error as needed
  }
};
