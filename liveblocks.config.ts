// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.

    UserMeta: {
      id: string
      info: {
        name: string
        avatar: string
      }
    }
  }
}

export {}
