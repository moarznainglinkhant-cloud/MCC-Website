// Supabase connection settings for the exec area.
//
// These two values are SAFE to be public (they identify the project; the database's
// Row Level Security rules are what protect the data). Paste them from the Supabase
// dashboard: Project Settings -> API (Project URL + "Publishable" / anon key).
//
// NEVER paste the "secret" or "service_role" key here or anywhere in this repo.
window.MCC_EXEC_CONFIG = {
  url: "https://teipvhyqtjwhjnqvfngi.supabase.co",        // e.g. https://abcdefgh.supabase.co
  key: "sb_publishable_UmbrrMl_z3mDlBXdYe9Exg_ExHWMAK9"     // starts with sb_publishable_... or eyJ...
};
