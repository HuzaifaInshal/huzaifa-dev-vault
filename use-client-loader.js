// Prepends "use client" to compiled .md MDX output so React treats
// them as client components when used as children inside client components.
module.exports = function useClientLoader(source) {
  return `"use client";\n${source}`;
};
