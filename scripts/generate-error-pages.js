/**
 * 从 public/error.html 模板生成每个错误码对应的纯静态 HTML 到 dist/e/
 * 模板占位符：__CODE__ __TITLE__ __DESC__ __BTN__ __YEAR__
 * 中英双语合并显示，零 JS
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const year = new Date().getFullYear().toString();

const ERRORS = {
  '400': { zh: '请求有误', en: 'Bad Request', desc: ['服务器无法理解当前请求，请检查后重试。', 'The server cannot understand this request. Please check and try again.'] },
  '401': { zh: '需要登录', en: 'Unauthorized', desc: ['此页面需要登录才能访问。', 'You need to log in to access this page.'] },
  '403': { zh: '禁止访问', en: 'Forbidden', desc: ['你没有权限查看此页面。', "You don't have permission to view this page."] },
  '404': { zh: '页面好像走丢了……', en: 'Page Not Found', desc: ['你访问的页面不存在或已被移除。', "The page you're looking for doesn't exist or has been moved."] },
  '405': { zh: '方法不被允许', en: 'Method Not Allowed', desc: ['该请求方法不被服务器支持。', 'This request method is not supported by the server.'] },
  '408': { zh: '请求超时', en: 'Request Timeout', desc: ['服务器等待请求超时，请检查网络后重试。', 'The server timed out waiting for the request. Please check your network and try again.'] },
  '410': { zh: '内容已消失', en: 'Gone', desc: ['此页面已被永久移除。', 'This page has been permanently removed.'] },
  '429': { zh: '请求太频繁', en: 'Too Many Requests', desc: ['你发送了太多请求，请稍后再试。', "You've sent too many requests. Please try again later."] },
  '500': { zh: '服务器出了点问题', en: 'Internal Server Error', desc: ['服务器内部发生错误，请稍后再试。', 'Something went wrong on our end. Please try again later.'] },
  '502': { zh: '网关错误', en: 'Bad Gateway', desc: ['上游服务器返回了无效响应，请稍后再试。', 'The upstream server returned an invalid response. Please try again later.'] },
  '503': { zh: '服务暂时不可用', en: 'Service Unavailable', desc: ['服务器正在维护或暂时过载，请稍后再试。', 'The server is temporarily down for maintenance or overloaded. Please try again later.'] },
  '504': { zh: '网关超时', en: 'Gateway Timeout', desc: ['上游服务器未及时响应，请稍后再试。', "The upstream server didn't respond in time. Please try again later."] },
};

const template = readFileSync(resolve(root, 'public/error.html'), 'utf-8');
const outDir = resolve(root, 'dist/e');
mkdirSync(outDir, { recursive: true });

for (const [code, msg] of Object.entries(ERRORS)) {
  const html = template
    .replace(/__CODE__/g, code)
    .replace(/__TITLE__/g, `${msg.zh} / ${msg.en}`)
    .replace('__DESC__', `${msg.desc[0]}<br>${msg.desc[1]}<br><br>如有疑问请联系 / Please contact <br><a href="mailto:i@qqzhi.cc">i@qqzhi.cc</a>`)
    .replace('__BTN__', '返回首页 / Homepage')
    .replace('__YEAR__', year);

  writeFileSync(resolve(outDir, `${code}.html`), html, 'utf-8');
}

console.log(`✓ Generated ${Object.keys(ERRORS).length} error pages → dist/e/`);
