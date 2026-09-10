self.addEventListener('message', async (event: MessageEvent) => {
  const { id, content } = event.data;

  try {
    // Mock MDX parsing logic
    // In a real implementation, this would use a library like @mdx-js/mdx or next-mdx-remote
    const parsedContent = `<!-- Parsed MDX mock -->\n<div>${content}</div>`;
    
    self.postMessage({
      type: 'success',
      id,
      parsedContent,
    });
  } catch (error) {
    self.postMessage({
      type: 'error',
      id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
