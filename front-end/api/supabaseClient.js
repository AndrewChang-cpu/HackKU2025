import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oxqihadsabaaqzjfldpn.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cWloYWRzYWJhYXF6amZsZHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDkxMzIsImV4cCI6MjA1OTI4NTEzMn0.t5PGgeUYIIQ9wpol8YK7qHkoClZianh03XB7jHlL11M"
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      // Specify AsyncStorage for session persistence
      storage: AsyncStorage,
      // Optional: Customize the storage key used
      storageKey: 'supabase.auth.token',
    },
});
export default supabase;