// Picsum's download_url points to the full-size original (often 5000px wide, several MB).
// Asking for a specific size of the same photo keeps the page fast.
export function photoUrl(id, width, height) {
  return `https://picsum.photos/id/${id}/${width}/${height}`
}
