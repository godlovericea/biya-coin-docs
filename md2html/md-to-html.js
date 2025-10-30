/**
 * Markdown to HTML Converter
 * 使用方法: node md-to-html.js <input.md> [output.html]
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// 用于存储目录项
let tocItems = [];

// 自定义渲染器，用于提取标题并生成 ID
const renderer = new marked.Renderer();
const originalHeading = renderer.heading.bind(renderer);

renderer.heading = function(text, level, raw) {
  // 生成标题 ID（将文本转换为 URL 友好的格式）
  const id = raw
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // 存储到目录数组
  tocItems.push({
    level: level,
    text: text,
    id: id
  });
  
  // 返回带 ID 的标题
  return `<h${level} id="${id}">${text}</h${level}>\n`;
};

// 配置 marked 选项
marked.setOptions({
  breaks: true,           // 支持 GitHub 风格的换行
  gfm: true,              // 启用 GitHub Flavored Markdown
  headerIds: false,       // 禁用自动 ID（我们自己生成）
  mangle: false,          // 不混淆邮箱地址
  renderer: renderer      // 使用自定义渲染器
});

// 生成目录 HTML
function generateTOC(items) {
    if (items.length === 0) {
        return '';
    }

    let tocHtml = '<nav class="table-of-contents">\n';
    tocHtml += '  <h2 class="toc-title">📑 目录</h2>\n';
    tocHtml += '  <ul class="toc-list">\n';
    
    let lastLevel = 0;
    
    items.forEach((item, index) => {
        const { level, text, id } = item;
        
        // 处理嵌套层级
        if (level > lastLevel) {
            // 开启新的嵌套列表
            for (let i = lastLevel; i < level - 1; i++) {
                tocHtml += '    <ul class="toc-sublist">\n';
            }
        } else if (level < lastLevel) {
            // 关闭嵌套列表
            for (let i = level; i < lastLevel; i++) {
                tocHtml += '    </ul>\n';
                tocHtml += '  </li>\n';
            }
        } else if (index > 0) {
            // 同级关闭上一个项
            tocHtml += '  </li>\n';
        }
        
        tocHtml += `    <li class="toc-item toc-level-${level}">\n`;
        tocHtml += `      <a href="#${id}" class="toc-link">${text}</a>\n`;
        
        lastLevel = level;
    });
    
    // 关闭所有未关闭的标签
    for (let i = 1; i < lastLevel; i++) {
        tocHtml += '    </ul>\n';
        tocHtml += '  </li>\n';
    }
    
    tocHtml += '  </li>\n';
    tocHtml += '  </ul>\n';
    tocHtml += '</nav>\n';
    
    return tocHtml;
}

// HTML 模板
const htmlTemplate = (title, toc, content, cssPath) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="${cssPath}">
</head>
<body>
${toc}
<div class="content">
${content}
</div>
</body>
</html>`;

function convertMarkdownToHtml(inputFile, outputFile) {
    try {
        // 检查输入文件是否存在
        if (!fs.existsSync(inputFile)) {
            console.error(`❌ 错误: 找不到文件 "${inputFile}"`);
            process.exit(1);
        }

        // 重置目录项数组
        tocItems = [];

        // 读取 Markdown 文件
        console.log(`📖 读取文件: ${inputFile}`);
        const markdown = fs.readFileSync(inputFile, 'utf-8');

        // 转换为 HTML（这会自动填充 tocItems 数组）
        console.log('🔄 转换中...');
        const htmlContent = marked.parse(markdown);

        // 生成目录
        console.log(`📑 生成目录 (共 ${tocItems.length} 个标题)...`);
        const tocHtml = generateTOC(tocItems);

        // 获取文件标题（使用文件名）
        const title = path.basename(inputFile, path.extname(inputFile));

        // 计算 CSS 文件的相对路径
        const scriptDir = path.dirname(__filename);
        const outputDir = path.dirname(path.resolve(outputFile));
        const cssAbsolutePath = path.join(scriptDir, 'style.css');
        const cssRelativePath = path.relative(outputDir, cssAbsolutePath).replace(/\\/g, '/');

        // 生成完整的 HTML
        const fullHtml = htmlTemplate(title, tocHtml, htmlContent, cssRelativePath);

        // 写入输出文件
        fs.writeFileSync(outputFile, fullHtml, 'utf-8');
        console.log(`✅ 转换成功: ${outputFile}`);
        console.log(`📊 文件大小: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
        console.log(`🎨 CSS 文件: ${cssRelativePath}`);

    } catch (error) {
        console.error('❌ 转换失败:', error.message);
        process.exit(1);
    }
}

// 主程序
function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log(`
📝 Markdown to HTML 转换工具

使用方法:
  node md-to-html.js <input.md> [output.html]

参数:
  input.md     - 输入的 Markdown 文件路径（必需）
  output.html  - 输出的 HTML 文件路径（可选，默认与输入文件同名）

示例:
  node md-to-html.js README.md
  node md-to-html.js docs/guide.md output/guide.html
  node md-to-html.js "My Document.md" "My Document.html"
        `);
        process.exit(0);
    }

    const inputFile = args[0];
    let outputFile = args[1];

    // 如果没有指定输出文件，使用输入文件名生成
    if (!outputFile) {
        const parsedPath = path.parse(inputFile);
        outputFile = path.join(parsedPath.dir, `${parsedPath.name}.html`);
    }

    convertMarkdownToHtml(inputFile, outputFile);
}

main();

