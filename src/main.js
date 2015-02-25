
function main(x: number): () => number {
  return () => x + x
}
