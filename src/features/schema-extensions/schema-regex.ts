// ---------------------------------------------------------
//
//                     Regex Helpers
//
// ---------------------------------------------------------

// ✅ Helper regex: Ensure it's not ONLY special characters
export const notOnlySpecialChars = /^(?![^a-zA-Z0-9]+$).*/;

// ✅ Helper regex: Ensure it's not ONLY spaces
export const notOnlySpaces = /^(?!\s+$).*/;

// ✅ Regex: Require a proper domain after @
export const validEmailPattern =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ✅ Regex: Ensure its a valid link
export const validLinkPattern =
  /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/;
