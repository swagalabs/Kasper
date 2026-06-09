# Generate Project Report

Create a structured project report summarizing work done.

## Output format:

```markdown
# {Project Name} — Отчет

**Дата:** {date}
**Репозиторий:** {repo URL}

---

## Что это
{1-2 sentence description}

## Что было сделано
### 1. {Category}
- Bullet points of what was created/changed
- Include file paths

{repeat for each category}

## Структура файлов
{tree view of key files with 1-line descriptions}

## Git история
| Коммит | Описание |
{table of commits}

## Статус
- Build: pass/fail
- Type: extension/app/library
- Data: mock/real
- Ready to test: how to run

## Что дальше
- [ ] Next steps as checklist
```

## Rules:
- Keep it SHORT — no fluff, just facts
- Include links (repo, docs, deployed URL)
- Tables over paragraphs where possible
- Include "how to run" — the reader should be able to start in 1 command
- Write in the language the user has been using (default: Russian if user spoke Russian)

## Input:
- Read git log for commit history
- Read package.json / README for project info
- Analyze src/ structure
- Check build status

## Output location:
- Ask user where to save, or default to ~/Desktop/Отчеты/
