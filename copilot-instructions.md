# Copilot Instructions for NextJS Client Development

## Project Architecture

This project follows a Next.js App Router architecture with the following workflow:

1. **Client Components**: Pages in the `app/` directory contain client components with local state management
2. **Server Actions**: Each page has dedicated server action functions that handle data fetching/mutation
3. **API Integration**: Server actions communicate with FastAPI backend endpoints

## Development Guidelines

### Component Structure

- Pages should be organized in the `app/` directory following the Next.js App Router convention
- Each route can have its own `page.jsx` file with client components
- Use client components for UI rendering and state management
- Keep components modular and focused on specific functionality

### State Management

- Use React hooks (`useState`, `useEffect`, `useCallback`) for client-side state management
- Avoid excessive prop drilling - consider React Context for deeper state needs
- Keep state as close as possible to where it's used

### Server Actions

- Create server action functions in separate files within the `app/actions/` directory
- Name server actions descriptively based on their functionality (e.g., `fetchUsers.js`, `updateProfile.js`)
- Server actions should handle:
  - Data validation before sending to the backend
  - Error handling and appropriate error responses
  - Formatting response data for client consumption
- Import and use server actions directly in client components

### API Integration 

- Server actions should communicate with the FastAPI backend
- Use the fetch API for making HTTP requests
- Handle authentication tokens consistently across requests
- Implement proper error handling for network failures

### UI Components

- Use shadcn/ui components exclusively for UI elements
- Leverage Tailwind CSS for styling with the following principles:
  - Use utility classes directly in components
  - Follow mobile-first responsive design
  - Maintain consistent spacing and color schemes
- Minimize custom CSS - use Tailwind's utility classes whenever possible

### JavaScript Usage

- Use JavaScript (not TypeScript) for all components and functions
- Follow ES6+ syntax and features (arrow functions, destructuring, etc.)
- Only use TypeScript when absolutely necessary for specific integrations
- Use JSDoc comments for documenting types when needed

### Code Quality

- Keep component files under 200 lines when possible
- Follow DRY (Don't Repeat Yourself) principles
- Use descriptive variable and function names
- Add meaningful comments for complex logic
- Format code consistently (use Prettier)

### Performance Considerations

- Implement proper loading states during data fetching
- Use Next.js built-in optimizations:
  - Image optimization with `next/image`
  - Font optimization with `next/font`
  - Client-side navigation with `next/link`
- Lazy load components when appropriate with `next/dynamic`
- Implement proper error boundaries

### Accessibility

- Ensure all shadcn components have proper accessibility attributes
- Use semantic HTML elements
- Maintain proper color contrast for text
- Ensure keyboard navigation works properly

## Workflow Example

```jsx
// app/users/page.jsx
"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { fetchUsers, createUser } from '@/app/actions/users'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newUserName, setNewUserName] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      const data = await fetchUsers()
      setUsers(data)
    } catch (err) {
      setError('Failed to load users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault()
    try {
      await createUser({ name: newUserName })
      setNewUserName('')
      await loadUsers() // Refresh the list
    } catch (err) {
      setError('Failed to create user')
      console.error(err)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      
      {/* Form for creating users */}
      <Card className="p-4 mb-6">
        <form onSubmit={handleCreateUser} className="flex gap-4">
          <Input 
            value={newUserName} 
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter user name" 
          />
          <Button type="submit">Add User</Button>
        </form>
      </Card>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center">Loading users...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <Card key={user.id} className="p-4">
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
```

```javascript
// app/actions/users.js
"use server"

const API_URL = process.env.API_URL || 'http://localhost:8000'

export async function fetchUsers() {
  try {
    const response = await fetch(`${API_URL}/api/users`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export async function createUser(userData) {
  try {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
```

## Project-Specific Examples

### Login Page Example (`app/login/page.jsx`)

The login page demonstrates several key patterns to follow:

```jsx
// Client component with "use client" directive
"use client";

// Import server actions from actions directory
import { loginUser } from "../actions/auth";

export default function CardWithForm() {
  // State management using React hooks
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form submission handler with server action
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Call server action with form data
      const result = await loginUser(formData);
      
      if (result.success) {
        // Handle successful response
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.username);
        router.push('/');
      } else {
        // Handle error response
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // UI using shadcn components and Tailwind classes
    // with proper loading states and error handling
  );
}
```

### Server Action Example (`app/actions/auth.js`)

Server actions should follow this pattern:

```javascript
"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function loginUser(formData) {
  try {
    // API request to FastAPI backend
    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        username: "",
      }),
    });

    const data = await response.json();
    
    // Error handling
    if (data.error) {
      return { success: false, message: "Invalid email or password" };
    }
    
    // Successful response formatting
    return { 
      success: true, 
      token: data.token, 
      username: data.username 
    };
  } catch (error) {
    // Exception handling
    console.error("Login error:", error);
    return { success: false, message: "Server error. Please try again later." };
  }
}
```

## Development Process

1. Create a client component in the appropriate route directory
2. Implement server actions for API communication in the `app/actions/` directory
3. Import and use server actions in the client component
4. Use shadcn components for UI with Tailwind styling
5. Implement proper loading and error states
6. Test functionality with the FastAPI backend

## Remember:

- Keep UI components from shadcn
- Use Tailwind for styling
- JavaScript, not TypeScript
- Separate server actions for API calls
- Proper error handling and loading states