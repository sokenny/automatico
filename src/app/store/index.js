import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  cookies: null,
  setCookies: (cookies) => set({ cookies }),
  setUser: (user) => set({ user }),
  fetchStore: (session, token) => {
    set({ token: token });
    if (session) {
      try {
        fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user-data/${session.user.email}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
          },
        )
          .then((response) => response.json())
          .then((data) => {
            console.log('datusa que llegó: ', data);
            set({ user: data });
          });
      } catch (error) {
        console.error('Failed to fetch store:', error);
        // Handle the error
      }
    }
  },
}));

export default useStore;
