import re

constants_path = 'd:/project/prepkle/src/lib/constants.ts'
generated_path = 'd:/project/prepkle/courses_gen.txt'

with open(constants_path, 'r', encoding='utf-8') as f:
    constants_content = f.read()

with open(generated_path, 'r', encoding='utf-8') as f:
    generated_content = f.read()

new_content = re.sub(
    r'export const BRANCH_SEMESTERS: Record<string, string\[\]> = \{[\s\S]*?export const BRANCHES = Object\.keys\(BRANCH_SEMESTERS\);',
    generated_content + '\nexport const BRANCHES = Object.keys(BRANCH_SEMESTERS);',
    constants_content
)

with open(constants_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
