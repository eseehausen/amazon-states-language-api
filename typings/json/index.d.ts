// snippet from https://www.npmjs.com/package/json-types
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
