# Career Chatbot Assets

This directory contains the knowledge base and embeddings for the client-side AI career chatbot.

## Files

### `corpus.json`

The career knowledge base containing chunked text segments about Jay's professional experience.

**Structure**:
```json
[
  {
    "id": 1,
    "text": "Jay has 5 years of experience with Angular...",
    "metadata": {
      "category": "technical-skills",
      "topic": "angular",
      "source": "resume"
    }
  }
]
```

**Fields**:
- `id` (number): Unique identifier for the chunk
- `text` (string): 300-500 token text segment
- `metadata` (object): Optional metadata for filtering/organization
  - `category`: Type of content (technical-skills, leadership, projects, education, etc.)
  - `topic`: Specific subject matter
  - `source`: Original source document

**Content Categories**:
- `technical-skills`: Programming languages, frameworks, tools
- `leadership`: Team management, mentoring, project leadership
- `projects`: Project descriptions, challenges, solutions
- `education`: Degrees, certifications, courses
- `achievements`: Awards, recognition, significant accomplishments
- `work-history`: Employment history, roles, responsibilities

### `embeddings.json`

Pre-computed vector embeddings for each text chunk in `corpus.json`.

**Structure**:
```json
[
  {
    "id": 1,
    "embedding": [0.123, -0.456, 0.789, ...],
    "text": "Jay has 5 years of experience with Angular..."
  }
]
```

**Fields**:
- `id` (number): Matches the ID in corpus.json
- `embedding` (number[]): 384-dimensional vector from all-MiniLM-L6-v2 model
- `text` (string): Original text (included for reference/debugging)

**Generation**:
Embeddings are generated using the Python script: `scripts/generate-embeddings.py`

## Generation Process

### Prerequisites

```bash
# Install Python dependencies
pip install sentence-transformers numpy
```

### Generate Embeddings

```bash
# From project root
python scripts/generate-embeddings.py

# Output:
# ✓ Loaded corpus.json (150 chunks)
# ✓ Loading model: all-MiniLM-L6-v2
# ✓ Generating embeddings...
# ✓ Saved embeddings.json (150 embeddings)
```

### Verification

```bash
# Check file sizes
ls -lh src/assets/chatbot/

# Expected output:
# corpus.json      ~80KB
# embeddings.json  ~600KB
```

## Usage in Application

### Loading Embeddings

The `RagService` loads embeddings on application startup:

```typescript
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RagService {
  private readonly http = inject(HttpClient);
  private readonly embeddings = signal<Embedding[]>([]);

  async loadEmbeddings(): Promise<void> {
    const data = await this.http
      .get<Embedding[]>('/assets/chatbot/embeddings.json')
      .toPromise();
    this.embeddings.set(data);
  }
}
```

### Retrieval Process

When a user asks a question:

1. **Embed Query**: Convert user question to 384-dimensional vector
2. **Compute Similarity**: Calculate cosine similarity with all corpus embeddings
3. **Retrieve Top-K**: Return the 5 most similar chunks
4. **Build Context**: Concatenate retrieved chunks into prompt context
5. **Generate**: LLM generates response using retrieved context

## Content Guidelines

### Adding New Content

When updating the knowledge base:

1. **Keep chunks focused**: Each chunk should cover a single topic
2. **Optimal length**: 300-500 tokens (~200-350 words)
3. **Avoid duplication**: Don't repeat information across chunks
4. **Include context**: Each chunk should be self-contained
5. **Use clear language**: Write in clear, professional language

### Content Structure

**Good Chunk Example**:
```
Jay has extensive experience with Angular, having worked with the framework for 5 years across multiple enterprise projects. His expertise includes Angular 12-21+, focusing on standalone components, signals, and reactive state management. Notable projects include a healthcare platform serving 50,000+ users and a financial dashboard processing $10M+ in daily transactions.
```

**Poor Chunk Example** (too vague):
```
Jay knows Angular. He has worked on projects.
```

### Metadata Best Practices

- **category**: Use consistent category names across chunks
- **topic**: Use lowercase, hyphenated format (e.g., `angular`, `react`, `node-js`)
- **source**: Track where content came from for future updates

## Maintenance

### Updating Content

1. Edit `corpus.json` with new/updated content
2. Run embedding generation script
3. Verify embeddings.json was updated
4. Test chatbot with sample queries
5. Deploy updated assets

### Version Control

- Both `corpus.json` and `embeddings.json` are committed to git
- Track changes in git commit messages
- Consider adding a version field to corpus for migrations

### Performance Considerations

- **File Size**: Keep corpus under 200 chunks to maintain < 1MB embeddings file
- **Load Time**: Embeddings load on app startup (~100-200ms for 1MB file)
- **Search Speed**: Cosine similarity is O(n), acceptable for < 1000 chunks

## Testing

### Manual Testing

```bash
# Start dev server
npm start

# Open chatbot in browser
# Test queries:
# - "What experience does Jay have with Angular?"
# - "Tell me about Jay's leadership experience"
# - "What are Jay's most significant achievements?"
```

### Automated Testing

Unit tests verify embedding retrieval accuracy:

```typescript
it('should retrieve relevant chunks for Angular query', async () => {
  const queryEmbedding = await llmService.embed('Angular experience');
  const chunks = await ragService.retrieveContext(queryEmbedding, 5);

  expect(chunks.length).toBe(5);
  expect(chunks[0]).toContain('Angular');
});
```

## Troubleshooting

### Embeddings Out of Sync

**Problem**: corpus.json updated but embeddings.json not regenerated

**Solution**:
```bash
python scripts/generate-embeddings.py
```

### Poor Retrieval Quality

**Problem**: Chatbot returns irrelevant information

**Possible Causes**:
- Chunks are too broad (solution: split into smaller, focused chunks)
- Missing content (solution: add relevant chunks to corpus)
- Metadata inconsistency (solution: review and standardize metadata)

### Large File Size

**Problem**: embeddings.json > 2MB

**Solution**:
- Reduce number of chunks (aim for < 200 chunks)
- Remove redundant content
- Consider embedding quantization (future enhancement)

## Security & Privacy

- ✅ **No PII**: Only professional career information
- ✅ **Public Content**: All content is suitable for public portfolio
- ✅ **Client-Side**: All processing happens in browser
- ✅ **No Telemetry**: User queries never leave the browser

## References

- [Sentence Transformers Documentation](https://www.sbert.net/)
- [all-MiniLM-L6-v2 Model Card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [WebLLM Documentation](https://github.com/mlc-ai/web-llm)
- [RAG Best Practices](https://python.langchain.com/docs/use_cases/question_answering/)

---

**Last Updated**: Phase 5 Implementation
**Status**: Template (directory will be created in Phase 4)
