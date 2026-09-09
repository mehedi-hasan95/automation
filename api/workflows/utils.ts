import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator"

export const generateSlug = () => {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "-",
    length: 2,
  })
}
