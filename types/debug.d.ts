// Deklaracje typu dla funkcji debugowania

declare global {
  interface Window {
    debugLogin: {
      testSupabase: () => Promise<void>
      testLogin: (email?: string, password?: string) => Promise<void>
      checkUser: () => Promise<void>
    }
  }
}

export {}