export function addThemeInitScript(themeSlug: string) {
  // Sets a pre-boot script that establishes the theme preference in localStorage
  return `(() => {
    try {
      localStorage.setItem('theme-preference-v1', JSON.stringify({ slug: '${themeSlug}', timestamp: Date.now(), version: 1 }));
      document.documentElement.setAttribute('data-theme', '${themeSlug}');
    } catch (e) {
      // ignore
    }
  })();`;
}
