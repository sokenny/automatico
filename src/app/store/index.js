import { create } from 'zustand';

const useStore = create((set, get) => ({
  user: null,
  cookies: null,
  setCookies: (cookies) => set({ cookies }),
  setUser: (user) => set({ user }),
  token: null,
  fetchUserData: (session, token) => {
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
  refetchUserData: () => {
    const { user, token } = get();
    if (user && user.email && token) {
      try {
        fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user-data/${user.email}`,
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
            console.log('Data refetched: ', data);
            set({ user: data });
          });
      } catch (error) {
        console.error('Failed to refetch user data:', error);
        // Handle the error
      }
    } else {
      console.error('No user email or token available for refetching');
      // Handle the case where user email or token is not available
    }
  },
}));

export default useStore;
