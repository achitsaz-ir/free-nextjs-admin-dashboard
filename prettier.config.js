// prettier.config.js یا .prettierrc.js
module.exports = {
  // پلاگین Tailwind CSS برای مرتب سازی کلاس‌ها
  plugins: ['prettier-plugin-tailwindcss'],

  // طول خط مجاز که کد را در خط جدید بشکند (معمولاً 80-100)
  printWidth: 100,

  // استفاده از کوتیشن‌های تک (') به جای دابل ("") برای رشته‌ها
  singleQuote: true,

  // استفاده از کاما در انتهای لیست‌ها و اشیاء (به ویژه مناسب برای git)
  trailingComma: 'all',

  // استفاده از فاصله‌های دو کاراکتری برای تورفتگی (Indentation)
  tabWidth: 2,

  // ترجیح دادن indent به جای استفاده از تب
  useTabs: false,

  // اضافه کردن فاصله بعد از تیغه‌های JSX مانند <Component />
  jsxBracketSameLine: false, // بهتر است false باشد، اما در نسخه‌های جدید این گزینه به jsxClosingBracketLocation تغییر یافته

  // اضافه کردن کاما در JSX props multiline
  jsxSingleQuote: false,

  // مدیریت اسامی فایل‌های جداگانه، خصوصاً در پروژه‌های TypeScript
  semi: true,

  // فرمت خودکار برای فایل‌های markdown ، JSON و غیره هماهنگ شده است
  bracketSpacing: true,

  // برای فرمت کدهای CSS-in-JS (styled-components, emotion و غیره)
  embeddedLanguageFormatting: 'auto',

  // پشتیبانی از فرمت TypeScript و JSX
  parser: 'typescript',

  // گزینه جدید برای کنترل ترتیب بندی JSX Closing Bracket (در نسخه‌های جدید Prettier)
  jsxBracketSameLine: false,

  // گزینه‌ای که باعث می‌شود Prettier ساختار HTML/JSX را بهتر بخواند
  htmlWhitespaceSensitivity: 'css',

  // گزینه‌ای برای جلوگیری از خراب شدن خطوط طولانی‌تر در انتها
  arrowParens: 'always',

  // این گزینه برای اطمینان از سازگاری کامل با ESLint (اگر دارید استفاده می‌کنید)
  endOfLine: 'lf',
};
