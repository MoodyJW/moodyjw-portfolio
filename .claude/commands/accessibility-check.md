---
description: Review code for WCAG 2.1 AAA accessibility compliance
---

Perform a comprehensive accessibility audit of the current code or component.

**Check for:**

1. **Semantic HTML**
   - Using semantic elements (nav, main, article, section, header, footer)
   - `<button>` for actions, `<a>` for navigation
   - No divs/spans used as interactive elements

2. **ARIA**
   - aria-label on interactive elements without visible text
   - Form inputs have associated labels
   - Appropriate use of aria-describedby, aria-labelledby
   - No positive tabindex values (only 0 or -1)

3. **Keyboard Navigation**
   - All interactive elements are keyboard accessible
   - Logical tab order
   - Focus management for modals/dynamic content

4. **Color Contrast (AAA)**
   - Normal text: 7:1 minimum
   - Large text (18pt+): 4.5:1 minimum
   - UI components: 3:1 minimum
   - Not relying on color alone for information

5. **Images & Media**
   - All images have alt attributes
   - Decorative images use alt=""
   - Meaningful alt text for content images

6. **Forms**
   - Every input has an associated label
   - Error messages are clear and accessible
   - Using aria-invalid and aria-describedby for errors

**Actions to take:**
1. Run: `npm run lint` to catch template issues
2. Review the code/component I specify
3. List all accessibility violations found
4. Provide specific fixes for each violation
5. Suggest Playwright accessibility tests if needed

Review the code carefully and ensure WCAG 2.1 AAA compliance.
