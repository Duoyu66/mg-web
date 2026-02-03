#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class CodeStats {
  constructor(options = {}) {
    this.options = {
      rootDir: process.cwd(),
      ignoreDirs: ['.git', 'node_modules', 'dist', 'build', '.next', '.cache'],
      ignoreFiles: ['.min.js', '.min.css'],
      extensions: {
        js: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'],
        py: ['py'],
        java: ['java'],
        cpp: ['cpp', 'c', 'h', 'hpp'],
        html: ['html', 'htm', 'vue', 'jsx'],
        css: ['css', 'scss', 'sass', 'less'],
        php: ['php'],
        ruby: ['rb'],
        go: ['go'],
        rs: ['rs'],
        swift: ['swift'],
        kotlin: ['kt', 'kts'],
        shell: ['sh', 'bash'],
        config: ['json', 'yaml', 'yml', 'toml', 'xml'],
        md: ['md', 'markdown']
      },
      verbose: false,
      ...options
    };

    this.stats = {
      total: { files: 0, lines: 0, code: 0, comments: 0, blanks: 0 },
      byLanguage: {},
      byExtension: {},
      startTime: Date.now()
    };
  }

  // 判断是否应该忽略文件或目录
  shouldIgnore(itemPath) {
    const relativePath = path.relative(this.options.rootDir, itemPath);
    
    // 检查目录
    for (const dir of this.options.ignoreDirs) {
      if (relativePath.includes(dir) || path.basename(itemPath) === dir) {
        return true;
      }
    }

    // 检查文件扩展名
    for (const pattern of this.options.ignoreFiles) {
      if (relativePath.endsWith(pattern)) {
        return true;
      }
    }

    return false;
  }

  // 获取文件语言类型
  getFileLanguage(extension) {
    for (const [lang, exts] of Object.entries(this.options.extensions)) {
      if (exts.includes(extension)) {
        return lang;
      }
    }
    return 'other';
  }

  // 分析单个文件
  analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const extension = path.extname(filePath).slice(1).toLowerCase();
    const language = this.getFileLanguage(extension);

    let code = 0;
    let comments = 0;
    let blanks = 0;
    let inBlockComment = false;

    // 语言特定的注释模式
    const commentPatterns = {
      js: { line: ['//'], block: [['/*', '*/']] },
      py: { line: ['#'], block: [['"""', '"""'], ["'''", "'''"]] },
      java: { line: ['//'], block: [['/*', '*/']] },
      cpp: { line: ['//'], block: [['/*', '*/']] },
      html: { line: [], block: [['<!--', '-->']] },
      css: { line: [], block: [['/*', '*/']] },
      php: { line: ['//', '#'], block: [['/*', '*/']] },
      ruby: { line: ['#'], block: [['=begin', '=end']] },
      go: { line: ['//'], block: [['/*', '*/']] }
    };

    const patterns = commentPatterns[language] || { line: [], block: [] };

    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (inBlockComment) {
        comments++;
        // 检查块注释结束
        for (const [start, end] of patterns.block) {
          if (trimmed.includes(end) || trimmed.endsWith(end)) {
            inBlockComment = false;
          }
        }
      } else if (trimmed === '') {
        blanks++;
      } else {
        let isComment = false;
        
        // 检查行注释
        for (const pattern of patterns.line) {
          if (trimmed.startsWith(pattern)) {
            comments++;
            isComment = true;
            break;
          }
        }

        // 检查块注释开始
        if (!isComment) {
          for (const [start, end] of patterns.block) {
            if (trimmed.startsWith(start)) {
              comments++;
              inBlockComment = !trimmed.includes(end) || !trimmed.endsWith(end);
              isComment = true;
              break;
            }
          }
        }

        if (!isComment) {
          code++;
        }
      }
    });

    return {
      extension,
      language,
      lines: lines.length,
      code,
      comments,
      blanks
    };
  }

  // 遍历目录
  walkDirectory(dirPath) {
    if (this.shouldIgnore(dirPath)) return;

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        this.walkDirectory(fullPath);
      } else if (stat.isFile()) {
        if (this.shouldIgnore(fullPath)) continue;

        try {
          const fileStats = this.analyzeFile(fullPath);
          this.updateStats(fullPath, fileStats);
        } catch (error) {
          if (this.options.verbose) {
            console.warn(`无法读取文件 ${fullPath}:`, error.message);
          }
        }
      }
    }
  }

  // 更新统计信息
  updateStats(filePath, fileStats) {
    const { extension, language, lines, code, comments, blanks } = fileStats;

    // 更新总计
    this.stats.total.files++;
    this.stats.total.lines += lines;
    this.stats.total.code += code;
    this.stats.total.comments += comments;
    this.stats.total.blanks += blanks;

    // 按语言统计
    if (!this.stats.byLanguage[language]) {
      this.stats.byLanguage[language] = {
        files: 0, lines: 0, code: 0, comments: 0, blanks: 0
      };
    }
    this.stats.byLanguage[language].files++;
    this.stats.byLanguage[language].lines += lines;
    this.stats.byLanguage[language].code += code;
    this.stats.byLanguage[language].comments += comments;
    this.stats.byLanguage[language].blanks += blanks;

    // 按扩展名统计
    if (!this.stats.byExtension[extension]) {
      this.stats.byExtension[extension] = {
        files: 0, lines: 0, code: 0, comments: 0, blanks: 0
      };
    }
    this.stats.byExtension[extension].files++;
    this.stats.byExtension[extension].lines += lines;
    this.stats.byExtension[extension].code += code;
    this.stats.byExtension[extension].comments += comments;
    this.stats.byExtension[extension].blanks += blanks;

    if (this.options.verbose) {
      console.log(`${filePath}: ${lines}行 (代码:${code}, 注释:${comments}, 空行:${blanks})`);
    }
  }

  // 格式化输出
  formatStats() {
    const timeTaken = ((Date.now() - this.stats.startTime) / 1000).toFixed(2);
    
    let output = '\n' + '='.repeat(80) + '\n';
    output += '项目代码统计报告\n';
    output += '='.repeat(80) + '\n\n';

    // 总计
    output += '总计:\n';
    output += `  文件数: ${this.stats.total.files.toLocaleString()}\n`;
    output += `  总行数: ${this.stats.total.lines.toLocaleString()}\n`;
    output += `  代码行: ${this.stats.total.code.toLocaleString()} (${this.getPercentage(this.stats.total.code, this.stats.total.lines)}%)\n`;
    output += `  注释行: ${this.stats.total.comments.toLocaleString()} (${this.getPercentage(this.stats.total.comments, this.stats.total.lines)}%)\n`;
    output += `  空行数: ${this.stats.total.blanks.toLocaleString()} (${this.getPercentage(this.stats.total.blanks, this.stats.total.lines)}%)\n`;
    output += `  平均每文件行数: ${(this.stats.total.lines / this.stats.total.files || 0).toFixed(1)}\n`;

    // 按语言统计
    output += '\n按语言统计:\n';
    output += '-'.repeat(60) + '\n';
    output += '语言'.padEnd(15) + '文件数'.padStart(10) + '总行数'.padStart(10) + 
              '代码行'.padStart(10) + '注释行'.padStart(10) + '空行'.padStart(10) + '\n';
    output += '-'.repeat(60) + '\n';

    Object.entries(this.stats.byLanguage)
      .sort((a, b) => b[1].lines - a[1].lines)
      .forEach(([lang, data]) => {
        output += lang.padEnd(15) + 
          data.files.toString().padStart(10) +
          data.lines.toString().padStart(10) +
          data.code.toString().padStart(10) +
          data.comments.toString().padStart(10) +
          data.blanks.toString().padStart(10) + '\n';
      });

    // 按扩展名统计
    output += '\n按文件扩展名统计:\n';
    output += '-'.repeat(60) + '\n';
    Object.entries(this.stats.byExtension)
      .sort((a, b) => b[1].lines - a[1].lines)
      .slice(0, 15) // 显示前15个
      .forEach(([ext, data]) => {
        output += `.${ext}`.padEnd(10) + 
          `${data.files}个文件, ${data.lines}行 (代码:${data.code}, 注释:${data.comments}, 空行:${data.blanks})\n`;
      });

    output += `\n统计完成，耗时: ${timeTaken}秒\n`;
    output += '='.repeat(80) + '\n';

    return output;
  }

  getPercentage(part, total) {
    return total > 0 ? ((part / total) * 100).toFixed(1) : '0.0';
  }

  // 生成JSON报告
  toJSON() {
    return {
      ...this.stats,
      duration: (Date.now() - this.stats.startTime) / 1000
    };
  }

  // 主运行方法
  run() {
    console.log(`开始分析目录: ${this.options.rootDir}`);
    this.walkDirectory(this.options.rootDir);
    console.log(this.formatStats());
    
    return this.stats;
  }
}

// CLI使用
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const options = {
    rootDir: args[0] || process.cwd(),
    verbose: args.includes('-v') || args.includes('--verbose'),
    ignoreDirs: ['.git', 'node_modules', 'dist', 'build', '.next', '.cache', 'coverage'],
    ignoreFiles: ['.min.js', '.min.css', '.map']
  };

  const stats = new CodeStats(options);
  stats.run();
}

module.exports = CodeStats;