#!/bin/bash

# AfriReads Source Code Export Script
# This script exports all source code files to a single text file

OUTPUT_FILE="afrireads-source-code.txt"
PROJECT_DIR="/home/ngobiro/projects/kalenjinbooks"

# Remove old output file if it exists
rm -f "$OUTPUT_FILE"

echo "==================================================================" >> "$OUTPUT_FILE"
echo "AfriReads - Kalenjin Books Platform - Source Code Export" >> "$OUTPUT_FILE"
echo "Generated: $(date)" >> "$OUTPUT_FILE"
echo "==================================================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Function to add a file to the output
add_file() {
    local file=$1
    local relative_path=${file#$PROJECT_DIR/}
    
    echo "" >> "$OUTPUT_FILE"
    echo "##################################################################" >> "$OUTPUT_FILE"
    echo "# File: $relative_path" >> "$OUTPUT_FILE"
    echo "##################################################################" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

# Export configuration files
echo "Exporting configuration files..."
add_file "$PROJECT_DIR/package.json"
add_file "$PROJECT_DIR/tsconfig.json"
add_file "$PROJECT_DIR/tailwind.config.ts"
add_file "$PROJECT_DIR/next.config.ts"
add_file "$PROJECT_DIR/wrangler.toml"
add_file "$PROJECT_DIR/.env.example"

# Export Prisma schema
echo "Exporting database schema..."
add_file "$PROJECT_DIR/prisma/schema.prisma"

# Export source files
echo "Exporting source code..."

# App directory (pages and layouts)
find "$PROJECT_DIR/src/app" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) | while read file; do
    add_file "$file"
done

# Components
find "$PROJECT_DIR/src/components" -type f \( -name "*.tsx" -o -name "*.ts" \) 2>/dev/null | while read file; do
    add_file "$file"
done

# Lib directory
find "$PROJECT_DIR/src/lib" -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | while read file; do
    add_file "$file"
done

# Documentation files
echo "Exporting documentation..."
find "$PROJECT_DIR/docs" -type f -name "*.md" 2>/dev/null | while read file; do
    add_file "$file"
done

# Root markdown files
for file in "$PROJECT_DIR"/*.md; do
    if [ -f "$file" ]; then
        add_file "$file"
    fi
done

echo "" >> "$OUTPUT_FILE"
echo "==================================================================" >> "$OUTPUT_FILE"
echo "End of Source Code Export" >> "$OUTPUT_FILE"
echo "==================================================================" >> "$OUTPUT_FILE"

echo "✅ Source code exported to: $OUTPUT_FILE"
echo "📊 File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo "📝 Total lines: $(wc -l < "$OUTPUT_FILE")"
