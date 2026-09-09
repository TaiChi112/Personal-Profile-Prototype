#!/bin/bash
echo "🚀 เริ่มต้นรวบรวมข้อมูล AI Configurations..."
OUTPUT_FILE="ai_ecosystem_report.txt"

echo "========================================" > "$OUTPUT_FILE"
echo "   AI Ecosystem Configuration Report    " >> "$OUTPUT_FILE"
echo "========================================" >> "$OUTPUT_FILE"
echo "Project: $(basename "$PWD")" >> "$OUTPUT_FILE"
echo "Date: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# List of files to look for
FILES_TO_CHECK=("AGENTS.md" "CLAUDE.md" "CONTEXT.md" ".cursorrules" ".cursor/rules" ".github/copilot-instructions.md" "skills-lock.json")

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "----------------------------------------" >> "$OUTPUT_FILE"
        echo "📄 FILE: $file" >> "$OUTPUT_FILE"
        echo "----------------------------------------" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo -e "\n" >> "$OUTPUT_FILE"
    fi
done

echo "----------------------------------------" >> "$OUTPUT_FILE"
echo "📁 DIRECTORY: AI Skills & Rules Tree" >> "$OUTPUT_FILE"
echo "----------------------------------------" >> "$OUTPUT_FILE"
tree .agents skills .cursor/rules -L 2 2>/dev/null >> "$OUTPUT_FILE"

echo "✅ รวบรวมข้อมูลสำเร็จ! ไฟล์ถูกบันทึกไว้ที่: $OUTPUT_FILE"
