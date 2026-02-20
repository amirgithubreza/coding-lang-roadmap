import { useState, useRef } from 'react';
import jsPDF from 'jspdf';

// Types
interface Chapter {
  title: string;
  topics: string[];
  duration: string;
}

interface Language {
  name: string;
  icon: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
  chapters: Chapter[];
}

interface DaySchedule {
  day: number;
  title: string;
  tasks: string[];
  languages: string[];
}

// Programming Languages Data
const programmingLanguages: Language[] = [
  {
    name: 'Python',
    icon: '🐍',
    description: 'زبان برنامه‌نویسی همه‌منظوره و قدرتمند',
    difficulty: 'Beginner',
    color: 'from-blue-500 to-green-500',
    chapters: [
      { title: 'مقدمات و نصب', topics: ['نصب Python', 'IDE معرفی', 'Hello World', 'متغیرها و انواع داده'], duration: '2 ساعت' },
      { title: 'انواع داده و عملیات‌ها', topics: ['اعداد', 'رشته‌ها', 'لیست‌ها', 'تاپل‌ها', 'دیکشنری‌ها', 'مجموعه‌ها'], duration: '3 ساعت' },
      { title: 'شرط‌ها و حلقه‌ها', topics: ['if/elif/else', 'for loop', 'while loop', 'break و continue'], duration: '2 ساعت' },
      { title: 'توابع', topics: ['تعریف تابع', 'پارامترها', 'return', 'Lambda', 'Scope'], duration: '3 ساعت' },
      { title: 'ماژول‌ها و پکیج‌ها', topics: ['import', 'pip', 'virtualenv', 'PyPI'], duration: '2 ساعت' },
      { title: 'OOP', topics: ['کلاس‌ها', 'شی‌ها', 'ارث‌بری', 'Polymorphism', '__init__', 'Encapsulation'], duration: '4 ساعت' },
      { title: 'استثناها', topics: ['try/except', 'finally', 'raise', 'Custom Exceptions'], duration: '1.5 ساعت' },
      { title: 'فایل‌ها و I/O', topics: ['خواندن فایل', 'نوشتن فایل', 'CSV', 'JSON'], duration: '2 ساعت' },
      { title: 'کتابخانه‌های کاربردی', topics: ['NumPy', 'Pandas', 'Matplotlib', 'Requests'], duration: '4 ساعت' },
      { title: 'پروژه نهایی', topics: ['ساخت برنامه کاربردی', 'استفاده از API', 'ذخیره‌سازی داده'], duration: '5 ساعت' }
    ]
  },
  {
    name: 'JavaScript',
    icon: '⚡',
    description: 'زبان برنامه‌نویسی وب و تعاملی',
    difficulty: 'Beginner',
    color: 'from-yellow-400 to-orange-500',
    chapters: [
      { title: 'مقدمات JavaScript', topics: ['نصب Node.js', 'VS Code', 'console.log', 'Data Types', 'Variables'], duration: '2 ساعت' },
      { title: 'عملیات‌ها و اپراتورها', topics: ['算術运算', '比较运算', '逻辑运算', '三元运算符'], duration: '2 ساعت' },
      { title: 'شرط‌ها و Switch', topics: ['if/else', 'switch', 'Ternary', 'Truthy/Falsy'], duration: '1.5 ساعت' },
      { title: 'حلقه‌ها', topics: ['for', 'while', 'do-while', 'for...of', 'for...in'], duration: '2 ساعت' },
      { title: 'توابع', topics: ['Function Declaration', 'Arrow Functions', 'Parameters', 'Return', 'Closures'], duration: '3 ساعت' },
      { title: 'Arrays', topics: ['Methods', 'map', 'filter', 'reduce', 'forEach', 'Destructuring'], duration: '3 ساعت' },
      { title: 'Objects', topics: ['Properties', 'Methods', 'Destructuring', 'Spread', 'Object Methods'], duration: '2.5 ساعت' },
      { title: 'DOM Manipulation', topics: [' getElementById', 'querySelector', 'Events', 'Event Delegation'], duration: '3 ساعت' },
      { title: 'Async JavaScript', topics: ['Callbacks', 'Promises', 'async/await', 'Fetch API'], duration: '4 ساعت' },
      { title: 'ES6+ Features', topics: ['Let/Const', 'Template Literals', 'Destructuring', 'Modules', 'Classes'], duration: '3 ساعت' }
    ]
  },
  {
    name: 'Java',
    icon: '☕',
    description: 'زبان برنامه‌نویسی سازمانی و enterprise',
    difficulty: 'Intermediate',
    color: 'from-red-500 to-orange-600',
    chapters: [
      { title: 'مقدمات Java', topics: ['نصب JDK', 'IDE (IntelliJ)', 'Hello World', 'Comments', 'Naming Conventions'], duration: '2 ساعت' },
      { title: 'انواع داده و متغیرها', topics: ['Primitive Types', 'Reference Types', 'Variables', 'Constants'], duration: '2 ساعت' },
      { title: 'عملیات‌ها', topics: ['算術运算', '关系运算', '逻辑运算', '位运算'], duration: '1.5 ساعت' },
      { title: 'شرط‌ها و حلقه‌ها', topics: ['if/else', 'switch', 'for', 'while', 'do-while'], duration: '2 ساعت' },
      { title: 'توابع (Methods)', topics: ['Method Declaration', 'Parameters', 'Return', 'Overloading'], duration: '2.5 ساعت' },
      { title: 'Arrays', topics: ['یک‌بعدی', 'چند‌بعدی', 'ArrayList', 'Arrays Class'], duration: '2 ساعت' },
      { title: 'OOP پیشرفته', topics: ['Classes', 'Objects', 'Inheritance', 'Polymorphism', 'Abstraction', 'Encapsulation'], duration: '4 ساعت' },
      { title: 'Exception Handling', topics: ['try/catch', 'finally', 'throw', 'Custom Exceptions'], duration: '2 ساعت' },
      { title: 'Collections Framework', topics: ['List', 'Set', 'Map', 'Iterator'], duration: '3 ساعت' },
      { title: 'Multithreading', topics: ['Threads', 'Runnable', 'Synchronization', 'Thread Pool'], duration: '3 ساعت' }
    ]
  },
  {
    name: 'C++',
    icon: '⚙️',
    description: 'زبان برنامه‌نویسی سطح پایین و کارآمد',
    difficulty: 'Advanced',
    color: 'from-blue-600 to-indigo-700',
    chapters: [
      { title: 'مقدمات C++', topics: ['نصب Compiler', 'IDE', 'Hello World', 'Comments', 'Namespace'], duration: '2 ساعت' },
      { title: 'انواع داده', topics: ['Primitive Types', 'User-Defined', 'Variables', 'Constants'], duration: '2 ساعت' },
      { title: 'عملیات‌ها', topics: ['算术运算', '关系运算', '逻辑运算', '位运算', '运算符重载'], duration: '2 ساعت' },
      { title: 'کنترل جریان', topics: ['if/else', 'switch', 'for', 'while', 'goto'], duration: '1.5 ساعت' },
      { title: 'توابع', topics: ['Function Declaration', 'Parameters', 'Return', 'Inline Functions', 'Recursion'], duration: '2.5 ساعت' },
      { title: 'Arrays و Pointers', topics: ['Arrays', 'Pointers', 'Pointer Arithmetic', 'Dynamic Memory'], duration: '4 ساعت' },
      { title: 'OOP در C++', topics: ['Classes', 'Objects', 'Inheritance', 'Polymorphism', 'Virtual Functions', 'Abstract Classes'], duration: '4 ساعت' },
      { title: 'STL', topics: ['Vectors', 'Lists', 'Maps', 'Sets', 'Algorithms'], duration: '3 ساعت' },
      { title: 'Memory Management', topics: ['new/delete', 'malloc/free', 'Smart Pointers', 'Memory Leaks'], duration: '2 ساعت' },
      { title: 'Templates و Generic Programming', topics: ['Function Templates', 'Class Templates', 'STL Containers'], duration: '3 ساعت' }
    ]
  },
  {
    name: 'C#',
    icon: '🎯',
    description: 'زبان Microsoft برای توسعه اپلیکیشن',
    difficulty: 'Intermediate',
    color: 'from-purple-500 to-pink-600',
    chapters: [
      { title: 'مقدمات C#', topics: ['نصب .NET', 'Visual Studio', 'Hello World', 'Comments', 'Naming'], duration: '2 ساعت' },
      { title: 'انواع داده', topics: ['Primitive Types', 'Reference Types', 'Variables', 'Constants', 'Nullable'], duration: '2 ساعت' },
      { title: 'عملیات‌ها', topics: ['算术运算', '关系运算', '逻辑运算', '类型转换'], duration: '1.5 ساعت' },
      { title: 'کنترل جریان', topics: ['if/else', 'switch', 'for', 'foreach', 'while', 'do-while'], duration: '2 ساعت' },
      { title: 'توابع', topics: ['Methods', 'Parameters', 'Return', 'Optional Parameters', 'Named Arguments'], duration: '2.5 ساعت' },
      { title: 'Arrays و Collections', topics: ['Arrays', 'ArrayList', 'List', 'Dictionary', 'LINQ'], duration: '3 ساعت' },
      { title: 'OOP در C#', topics: ['Classes', 'Objects', 'Inheritance', 'Interfaces', 'Polymorphism', 'Properties'], duration: '4 ساعت' },
      { title: 'Exception Handling', topics: ['try/catch', 'finally', 'throw', 'Custom Exceptions'], duration: '1.5 ساعت' },
      { title: 'Async Programming', topics: ['async/await', 'Tasks', 'Threads', 'TPL'], duration: '3 ساعت' },
      { title: '.NET Framework', topics: [' namespaces', ' assemblies', 'Garbage Collection', 'Attributes'], duration: '2 ساعت' }
    ]
  },
  {
    name: 'PHP',
    icon: '🐘',
    description: 'زبان برنامه‌نویسی وب',
    difficulty: 'Beginner',
    color: 'from-indigo-500 to-purple-600',
    chapters: [
      { title: 'مقدمات PHP', topics: ['نصب XAMPP', 'PHP Tags', 'Comments', 'Variables', 'Echo/Print'], duration: '2 ساعت' },
      { title: 'انواع داده', topics: ['String', 'Integer', 'Float', 'Boolean', 'Array', 'Object'], duration: '2 ساعت' },
      { title: 'عملیات‌ها', topics: ['算术运算', '字符串运算', '比较运算', '逻辑运算'], duration: '1.5 ساعت' },
      { title: 'کنترل جریان', topics: ['if/else', 'switch', 'for', 'foreach', 'while', 'do-while'], duration: '2 ساعت' },
      { title: 'توابع', topics: ['User Functions', 'Built-in Functions', 'Parameters', 'Return', 'Scope'], duration: '2.5 ساعت' },
      { title: 'Arrays', topics: ['Indexed', 'Associative', 'Multidimensional', 'Array Functions'], duration: '2 ساعت' },
      { title: 'فرم‌ها و ورودی', topics: ['$_GET', '$_POST', '$_REQUEST', 'Form Validation', 'CSRF'], duration: '3 ساعت' },
      { title: 'Sessions و Cookies', topics: ['Sessions', 'Cookies', 'Storage', 'Security'], duration: '2 ساعت' },
      { title: 'Database', topics: ['MySQLi', 'PDO', 'CRUD Operations', 'Prepared Statements'], duration: '4 ساعت' },
      { title: 'OOP در PHP', topics: ['Classes', 'Objects', 'Inheritance', 'Interfaces', 'Traits'], duration: '3 ساعت' }
    ]
  },
  {
    name: 'Ruby',
    icon: '💎',
    description: 'زبان برنامه‌نویسی ساده و زیبا',
    difficulty: 'Beginner',
    color: 'from-red-600 to-pink-500',
    chapters: [
      { title: 'مقدمات Ruby', topics: ['نصب Ruby', 'IRB', 'Hello World', 'Comments', ' puts vs print'], duration: '1.5 ساعت' },
      { title: 'انواع داده', topics: ['Numbers', 'Strings', 'Symbols', 'Arrays', 'Hashes'], duration: '2 ساعت' },
      { title: 'عملیات‌ها', topics: ['算术运算', '字符串方法', '比较运算'], duration: '1.5 ساعت' },
      { title: 'کنترل جریان', topics: ['if/elsif/else', 'unless', 'case', 'for', 'while', 'each'], duration: '2 ساعت' },
      { title: 'توابع', topics: ['Method Definition', 'Parameters', 'Return', 'Blocks', 'Procs', 'Lambdas'], duration: '3 ساعت' },
      { title: 'OOP در Ruby', topics: ['Classes', 'Objects', 'Inheritance', 'Mixins', 'Modules', 'attr_*'], duration: '3 ساعت' },
      { title: 'Collections', topics: ['Arrays', 'Hashes', 'Enumerable', 'map', 'select', 'reduce'], duration: '2.5 ساعت' },
      { title: 'Exceptions', topics: ['raise', 'rescue', 'ensure', 'retry'], duration: '1.5 ساعت' },
      { title: 'File I/O', topics: ['Reading', 'Writing', 'File Operations'], duration: '1.5 ساعت' },
      { title: 'Rails مقدمات', topics: ['MVC', 'Routes', 'Controllers', 'Models', 'Views'], duration: '4 ساعت' }
    ]
  },
  {
    name: 'Go (Golang)',
    icon: '🔵',
    description: 'زبان Google برای سیستم‌های scalable',
    difficulty: 'Intermediate',
    color: 'from-cyan-500 to-blue-600',
    chapters: [
      { title: 'مقدمات Go', topics: ['نصب Go', 'Workspace', 'Hello World', 'Comments', 'Packages'], duration: '2 ساعت' },
      { title: 'انواع داده', topics: ['Variables', 'Constants', 'Basic Types', 'Zero Values'], duration: '1.5 ساعت' },
      { title: 'کنترل جریان', topics: ['if/else', 'for', 'switch', 'goto'], duration: '1.5 ساعت' },
      { title: 'توابع', topics: ['Function Declaration', 'Multiple Return', 'Variadic', 'Anonymous'], duration: '2 ساعت' },
      { title: 'Arrays و Slices', topics: ['Arrays', 'Slices', 'Maps', 'Structs'], duration: '2.5 ساعت' },
      { title: 'Pointers', topics: ['Pointers', 'Pass by Value', 'Pass by Reference'], duration: '2 ساعت' },
      { title: 'OOP در Go', topics: ['Methods', 'Interfaces', 'Embedding', 'Composition'], duration: '2.5 ساعت' },
      { title: 'Concurrency', topics: ['Goroutines', 'Channels', 'Select', 'WaitGroups'], duration: '4 ساعت' },
      { title: 'Error Handling', topics: ['Error Type', 'Error Wrapping', 'Panic/Recover'], duration: '1.5 ساعت' },
      { title: 'Packages', topics: ['Creating Packages', 'Import', 'Init Functions'], duration: '2 ساعت' }
    ]
  },
  {
    name: 'Rust',
    icon: '🦀',
    description: 'زبان امن و سریع برای سیستم',
    difficulty: 'Advanced',
    color: 'from-orange-600 to-red-700',
    chapters: [
      { title: 'مقدمات Rust', topics: ['نصب Rust', 'Cargo', 'Hello World', 'Comments', 'println!'], duration: '2 ساعت' },
      { title: 'انواع داده', topics: ['Variables', 'Constants', 'Primitive Types', 'Literals'], duration: '1.5 ساعت' },
      { title: 'کنترل جریان', topics: ['if/else', 'loop', 'while', 'for', 'break', 'continue'], duration: '1.5 ساعت' },
      { title: 'توابع', topics: ['Function Declaration', 'Parameters', 'Return', 'Methods'], duration: '2 ساعت' },
      { title: 'Tuples و Options', topics: ['Tuples', 'Destructuring', 'Option Type', 'unwrap', 'match'], duration: '2 ساعت' },
      { title: 'Ownership', topics: ['Ownership Rules', 'Borrowing', 'References', 'Lifetimes'], duration: '4 ساعت' },
      { title: 'Structs و Enums', topics: ['Structs', 'Methods', 'Enums', 'Pattern Matching'], duration: '2.5 ساعت' },
      { title: 'Collections', topics: ['Vectors', 'Strings', 'HashMap', 'Iterators'], duration: '2.5 ساعت' },
      { title: 'Error Handling', topics: ['Result Type', 'panic!', 'unwrap', '? Operator'], duration: '1.5 ساعت' },
      { title: 'Traits و Generics', topics: ['Traits', 'Generic Functions', 'Generic Structs', 'Lifetimes'], duration: '3 ساعت' }
    ]
  },
  {
    name: 'Swift',
    icon: '🍎',
    description: 'زبان Apple برای iOS و macOS',
    difficulty: 'Intermediate',
    color: 'from-gray-700 to-blue-800',
    chapters: [
      { title: 'مقدمات Swift', topics: ['نصب Xcode', 'Playground', 'Hello World', 'Comments', 'Print'], duration: '2 ساعت' },
      { title: 'انواع داده', topics: ['Int', 'Double', 'String', 'Bool', 'Character'], duration: '1.5 ساعت' },
      { title: 'کنترل جریان', topics: ['if/else', 'switch', 'for-in', 'while', 'repeat-while'], duration: '1.5 ساعت' },
      { title: 'توابع', topics: ['Function Declaration', 'Parameters', 'Return', 'Closures'], duration: '2.5 ساعت' },
      { title: 'Arrays و Dictionaries', topics: ['Arrays', 'Dictionaries', 'Sets', 'Collection Methods'], duration: '2 ساعت' },
      { title: 'OOP در Swift', topics: ['Classes', 'Structs', 'Enums', 'Inheritance', 'Protocols'], duration: '3 ساعت' },
      { title: 'Optionals', topics: ['Optional Binding', 'Nil Coalescing', 'Optional Chaining'], duration: '2 ساعت' },
      { title: 'Extensions و Protocols', topics: ['Extensions', 'Protocol-Oriented', 'Protocol Extensions'], duration: '2 ساعت' },
      { title: 'Error Handling', topics: ['do-catch', 'throw', 'rethrows', 'Error Protocol'], duration: '1.5 ساعت' },
      { title: 'UIKit/SwiftUI', topics: ['Views', 'Layout', 'Actions', 'State Management'], duration: '4 ساعت' }
    ]
  },
  {
    name: 'Kotlin',
    icon: '🟢',
    description: 'زبان مدرن برای Android',
    difficulty: 'Intermediate',
    color: 'from-green-500 to-emerald-600',
    chapters: [
      { title: 'مقدمات Kotlin', topics: ['نصب IntelliJ', 'Hello World', 'Comments', 'Print'], duration: '1.5 ساعت' },
      { title: 'انواع داده', topics: ['Numbers', 'Strings', 'Booleans', 'Characters'], duration: '1.5 ساعت' },
      { title: 'کنترل جریان', topics: ['if/else', 'when', 'for', 'while', 'when Expression'], duration: '1.5 ساعت' },
      { title: 'توابع', topics: ['Function Declaration', 'Parameters', 'Return', 'Lambda', 'Higher-Order'], duration: '2 ساعت' },
      { title: 'Classes و Objects', topics: ['Classes', 'Objects', 'Properties', 'Methods', 'Primary/Secondary'], duration: '2.5 ساعت' },
      { title: 'OOP در Kotlin', topics: ['Inheritance', 'Interfaces', 'Visibility', 'Data Classes', 'Sealed Classes'], duration: '3 ساعت' },
      { title: 'Collections', topics: ['Lists', 'Sets', 'Maps', 'Sequences', 'Collection Operations'], duration: '2 ساعت' },
      { title: 'Null Safety', topics: ['Nullable Types', 'Safe Calls', 'Elvis Operator', 'NotNull Assertion'], duration: '1.5 ساعت' },
      { title: 'Extension Functions', topics: ['Extensions', 'Companion Objects', 'Object Expressions'], duration: '1.5 ساعت' },
      { title: 'Android Development', topics: ['Activities', 'Layouts', 'Views', 'RecyclerView'], duration: '4 ساعت' }
    ]
  },
  {
    name: 'TypeScript',
    icon: '📘',
    description: 'JavaScript با Type Safety',
    difficulty: 'Intermediate',
    color: 'from-blue-500 to-indigo-600',
    chapters: [
      { title: 'مقدمات TypeScript', topics: ['نصب TypeScript', 'tsc', 'Hello World', 'Basic Types'], duration: '2 ساعت' },
      { title: 'انواع داده', topics: ['Primitive Types', 'Any', 'Unknown', 'Void', 'Null', 'Undefined'], duration: '1.5 ساعت' },
      { title: 'Arrays و Tuples', topics: ['Arrays', 'Tuples', 'Readonly', 'Array Methods'], duration: '1.5 ساعت' },
      { title: 'Interfaces و Types', topics: ['Interface Declaration', 'Type Aliases', 'Union Types', 'Intersection'], duration: '2.5 ساعت' },
      { title: 'Classes', topics: ['Class Declaration', 'Access Modifiers', 'Constructors', 'Inheritance', 'Abstract'], duration: '2 ساعت' },
      { title: 'Generics', topics: ['Generic Functions', 'Generic Classes', 'Generic Constraints'], duration: '2 ساعت' },
      { title: ' Enums', topics: ['Numeric Enums', 'String Enums', 'Heterogeneous Enums'], duration: '1 ساعت' },
      { title: 'Modules', topics: ['Export/Import', 'Default Exports', 'Named Exports', 'Re-exports'], duration: '1.5 ساعت' },
      { title: 'Advanced Types', topics: ['Type Guards', 'Type Narrowing', 'Mapped Types', 'Conditional Types'], duration: '2.5 ساعت' },
      { title: 'React با TypeScript', topics: ['Props', 'State', 'Hooks', 'Context'], duration: '3 ساعت' }
    ]
  },
  {
    name: 'SQL',
    icon: '🗄️',
    description: 'زبان برای مدیریت پایگاه داده',
    difficulty: 'Beginner',
    color: 'from-teal-500 to-cyan-600',
    chapters: [
      { title: 'مقدمات SQL', topics: ['نصب Database', 'SQL vs NoSQL', 'Basic Syntax', 'Comments'], duration: '1.5 ساعت' },
      { title: 'SELECT', topics: ['Basic SELECT', 'WHERE', 'ORDER BY', 'LIMIT', 'DISTINCT'], duration: '2 ساعت' },
      { title: 'INSERT, UPDATE, DELETE', topics: ['INSERT', 'UPDATE', 'DELETE', 'Transactions'], duration: '1.5 ساعت' },
      { title: 'JOIN', topics: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN'], duration: '2.5 ساعت' },
      { title: 'GROUP BY و HAVING', topics: ['GROUP BY', 'HAVING', 'Aggregate Functions', 'ROLLUP'], duration: '2 ساعت' },
      { title: 'Subqueries', topics: ['Scalar Subquery', 'Row Subquery', 'Table Subquery', 'Correlated'], duration: '2 ساعت' },
      { title: 'Indexes', topics: ['Creating Indexes', 'Types of Indexes', 'Index Optimization'], duration: '1.5 ساعت' },
      { title: 'Views', topics: ['Creating Views', 'Updating Views', 'Dropping Views'], duration: '1 ساعت' },
      { title: 'Stored Procedures', topics: ['Creating Procedures', 'Parameters', 'Calling Procedures'], duration: '2 ساعت' },
      { title: 'Normalization', topics: ['1NF', '2NF', '3NF', 'BCNF', 'Denormalization'], duration: '2 ساعت' }
    ]
  },
  {
    name: 'Assembly',
    icon: '🔧',
    description: 'زبان سطح پایین برای سخت‌افزار',
    difficulty: 'Advanced',
    color: 'from-gray-600 to-slate-700',
    chapters: [
      { title: 'مقدمات Assembly', topics: ['CPU Architecture', 'Registers', 'Memory', 'Hello World'], duration: '2 ساعت' },
      { title: 'Data Types', topics: ['Bytes', 'Words', 'Dwords', 'Qwords', 'Arrays'], duration: '1.5 ساعت' },
      { title: 'Instructions', topics: ['MOV', 'ADD', 'SUB', 'MUL', 'DIV', 'INC', 'DEC'], duration: '2 ساعت' },
      { title: 'Control Flow', topics: ['JMP', 'JE', 'JNE', 'JG', 'JL', 'LOOP'], duration: '2 ساعت' },
      { title: 'Functions', topics: ['CALL', 'RET', 'Stack', 'Parameters'], duration: '2 ساعت' },
      { title: 'Interrupts', topics: ['INT', 'DOS Interrupts', 'BIOS Interrupts'], duration: '1.5 ساعت' },
      { title: 'String Operations', topics: ['MOVSB', 'STOSB', 'LODSB', 'SCASB'], duration: '1.5 ساعت' },
      { title: 'Bit Operations', topics: ['AND', 'OR', 'XOR', 'NOT', 'SHL', 'SHR'], duration: '1.5 ساعت' },
      { title: 'x86-64 Extensions', topics: ['64-bit Registers', 'RIP-relative', 'System Calls'], duration: '2 ساعت' },
      { title: 'Optimization', topics: ['Loop Optimization', 'Branch Prediction', 'Cache'], duration: '2 ساعت' }
    ]
  }
];

// 15-Day Schedule
const schedule: DaySchedule[] = [
  { day: 1, title: 'روز اول: مبانی برنامه‌نویسی', tasks: ['نصب ابزارهای لازم', 'آشنایی با IDE', 'Hello World در 3 زبان', 'متغیرها و انواع داده'], languages: ['Python', 'JavaScript', 'Java'] },
  { day: 2, title: 'روز دوم: منطق برنامه', tasks: ['شرط‌ها (if/else)', 'عملیات‌های ریاضی', 'مقایسه در زبان‌های مختلف', 'تمرین: ماشین حساب'], languages: ['Python', 'JavaScript', 'Java'] },
  { day: 3, title: 'روز سوم: حلقه‌ها', tasks: ['for loop', 'while loop', 'break و continue', 'تمرین: چاپ مثلث', 'تمرین: فاکتوریل'], languages: ['Python', 'JavaScript', 'Java'] },
  { day: 4, title: 'روز چهارم: توابع', tasks: ['تعریف و فراخوانی توابع', 'پارامترها', 'return', 'Scope', 'تمرین: تابع فیبوناچی'], languages: ['Python', 'JavaScript', 'Java'] },
  { day: 5, title: 'روز پنجم: آرایه‌ها', tasks: ['Array Basics', 'Array Methods', 'Multidimensional Arrays', 'تمرین: جستجو در آرایه'], languages: ['Python', 'JavaScript', 'Java'] },
  { day: 6, title: 'روز ششم: OOP مقدمات', tasks: ['کلاس‌ها و اشیاء', 'Properties', 'Methods', 'Constructor', 'تمرین: کلاس BankAccount'], languages: ['Python', 'Java', 'C#'] },
  { day: 7, title: 'روز هفتم: OOP پیشرفته', tasks: ['ارث‌بری', 'Polymorphism', 'Encapsulation', 'Abstraction', 'تمرین: سیستم مدیریت کتابخانه'], languages: ['Python', 'Java', 'C#'] },
  { day: 8, title: 'روز هشتم: مدیریت خطا', tasks: ['try/catch', 'finally', 'throw', 'Custom Exceptions', 'تمرین: Divider با Error Handling'], languages: ['Python', 'Java', 'JavaScript'] },
  { day: 9, title: 'روز نهم: فایل و I/O', tasks: ['خواندن فایل', 'نوشتن فایل', 'JSON', 'CSV', 'تمرین: Log Writer'], languages: ['Python', 'Java', 'JavaScript'] },
  { day: 10, title: 'روز دهم: Collections', tasks: ['Lists/ArrayLists', 'Maps/Dictionaries', 'Sets', 'Iterators', 'تمرین: Phone Book'], languages: ['Python', 'Java', 'C#'] },
  { day: 11, title: 'روز یازدهم: Async Programming', tasks: ['Threads', 'Callbacks', 'Promises', 'async/await', 'تمرین: Async File Reader'], languages: ['JavaScript', 'Python', 'Java'] },
  { day: 12, title: 'روز دوازدهم: Database', tasks: ['SQL Basics', 'CRUD Operations', 'Joins', 'ORM', 'تمرین: User Management'], languages: ['SQL', 'Python', 'Java'] },
  { day: 13, title: 'روز سیزدهم: Web Development', tasks: ['HTML/CSS Basics', 'DOM', 'API Calls', 'REST', 'تمرین: Todo App'], languages: ['JavaScript', 'PHP', 'Python'] },
  { day: 14, title: 'روز چهاردهم: Mobile Development', tasks: ['iOS با Swift', 'Android با Kotlin', 'Cross-platform', 'تمرین: Simple App'], languages: ['Swift', 'Kotlin'] },
  { day: 15, title: 'روز پانزدهم: پروژه نهایی', tasks: ['انتخاب پروژه', 'طراحی معماری', 'پیاده‌سازی', 'دیباگ', 'ارائه'], languages: ['Python', 'JavaScript', 'Java'] }
];

// Frameworks Data
const frameworks = [
  { name: 'React', language: 'JavaScript', description: 'کتابخانه UI', icon: '⚛️' },
  { name: 'Vue.js', language: 'JavaScript', description: 'فریمورک پیشرو', icon: '💚' },
  { name: 'Angular', language: 'TypeScript', description: 'فریمورک enterprise', icon: '🅰️' },
  { name: 'Django', language: 'Python', description: 'فریمورک وب', icon: '🎪' },
  { name: 'Flask', language: 'Python', description: 'میکرو فریمورک', icon: '🧪' },
  { name: 'Spring', language: 'Java', description: 'فریمورک enterprise', icon: '🌱' },
  { name: 'Express', language: 'JavaScript', description: 'فریمورک Node.js', icon: '🚂' },
  { name: 'Laravel', language: 'PHP', description: 'فریمورک PHP', icon: '🏠' },
  { name: 'ASP.NET', language: 'C#', description: 'فریمورک Microsoft', icon: '🌐' },
  { name: 'Rails', language: 'Ruby', description: 'فریمورک وب', icon: '🚂' },
  { name: 'FastAPI', language: 'Python', description: 'API framework', icon: '⚡' },
  { name: 'Next.js', language: 'JavaScript', description: 'React framework', icon: '▲' },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'languages' | 'schedule' | 'frameworks'>('languages');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleChapter = (index: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedChapters(newExpanded);
  };

  const exportToPDF = async () => {
    if (!contentRef.current) return;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Title
    pdf.setFontSize(24);
    pdf.text('Programming Roadmap - Complete Learning Guide', pageWidth / 2, 20, { align: 'center' });
    pdf.text('راهنمای کامل یادگیری برنامه‌نویسی', pageWidth / 2, 30, { align: 'center' });
    
    let y = 50;
    
    // Languages Section
    pdf.setFontSize(18);
    pdf.text('Programming Languages', y, 10);
    y += 15;
    
    programmingLanguages.forEach((lang) => {
      if (y > 250) {
        pdf.addPage();
        y = 20;
      }
      
      pdf.setFontSize(14);
      pdf.text(`${lang.icon} ${lang.name} - ${lang.description}`, 15, y);
      y += 10;
      
      pdf.setFontSize(10);
      lang.chapters.forEach((chapter, chIdx) => {
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
        
        const isExpanded = expandedChapters.has(chIdx);
        pdf.text(`  ${chapter.title} (${chapter.duration})`, 20, y);
        y += 6;
        
        if (isExpanded) {
          chapter.topics.forEach((topic) => {
            if (y > 270) {
              pdf.addPage();
              y = 20;
            }
            pdf.text(`    • ${topic}`, 25, y);
            y += 5;
          });
        }
        y += 4;
      });
      y += 5;
    });
    
    // Schedule Section
    pdf.addPage();
    y = 20;
    pdf.setFontSize(18);
    pdf.text('15-Day Learning Schedule', y, 10);
    pdf.text('برنامه ۱۵ روزه یادگیری', y, 18);
    y += 15;
    
    schedule.forEach((day) => {
      if (y > 250) {
        pdf.addPage();
        y = 20;
      }
      
      pdf.setFontSize(12);
      pdf.text(`${day.day}. ${day.title}`, 15, y);
      y += 8;
      
      pdf.setFontSize(10);
      day.tasks.forEach((task, taskIndex) => {
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(`   ${taskIndex + 1}. ${task}`, 20, y);
        y += 5;
      });
      
      pdf.text(`   Languages: ${day.languages.join(', ')}`, 20, y);
      y += 8;
    });
    
    // Frameworks Section
    pdf.addPage();
    y = 20;
    pdf.setFontSize(18);
    pdf.text('Popular Frameworks', y, 10);
    pdf.text('فریمورک‌های محبوب', y, 18);
    y += 15;
    
    frameworks.forEach((fw) => {
      if (y > 250) {
        pdf.addPage();
        y = 20;
      }
      
      pdf.setFontSize(11);
      pdf.text(`${fw.icon} ${fw.name} (${fw.language}) - ${fw.description}`, 15, y);
      y += 8;
    });
    
    pdf.save('programming-roadmap.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                🚀
              </div>
              <div>
                <h1 className="text-xl font-bold">Programming Roadmap</h1>
                <p className="text-xs text-gray-400">راهنمای کامل یادگیری</p>
              </div>
            </div>
            <button
              onClick={exportToPDF}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-red-500/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              خروجی PDF
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl w-fit">
          {[
            { id: 'languages', label: 'زبان‌های برنامه‌نویسی', icon: '💻' },
            { id: 'schedule', label: 'برنامه ۱۵ روزه', icon: '📅' },
            { id: 'frameworks', label: 'فریمورک‌ها', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main ref={contentRef} className="max-w-7xl mx-auto px-4 pb-12">
        {/* Languages Tab */}
        {activeTab === 'languages' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Language List */}
            <div className="lg:col-span-1 space-y-3">
              <h2 className="text-lg font-semibold mb-4 text-gray-300">انتخاب زبان</h2>
              {programmingLanguages.map((lang) => (
                <button
                  key={lang.name}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setExpandedChapters(new Set());
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    selectedLanguage?.name === lang.name
                      ? 'bg-gradient-to-r ' + lang.color + ' shadow-lg'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{lang.name}</h3>
                      <p className="text-xs text-gray-300 truncate">{lang.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      lang.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                      lang.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {lang.difficulty === 'Beginner' ? 'مبتدی' :
                       lang.difficulty === 'Intermediate' ? 'متوسط' : 'پیشرفته'}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Chapters */}
            <div className="lg:col-span-2">
              {selectedLanguage ? (
                <div className="bg-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl">{selectedLanguage.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedLanguage.name}</h2>
                      <p className="text-gray-400">{selectedLanguage.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedLanguage.chapters.length} فصل • کل زمان: ~25 ساعت
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedLanguage.chapters.map((chapter, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleChapter(index)}
                          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <div className="text-left">
                              <h3 className="font-semibold">{chapter.title}</h3>
                              <p className="text-xs text-gray-400">{chapter.duration}</p>
                            </div>
                          </div>
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              expandedChapters.has(index) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {expandedChapters.has(index) && (
                          <div className="px-4 pb-4">
                            <div className="pl-11 space-y-2">
                                                  {chapter.topics.map((topic) => (
                      <div
                        key={topic}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                        {topic}
                      </div>
                    ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 rounded-2xl p-12 text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h3 className="text-xl font-semibold mb-2">یک زبان را انتخاب کنید</h3>
                  <p className="text-gray-400">از لیست سمت چپ یک زبان برنامه‌نویسی را انتخاب کنید تا فصل‌های آن را مشاهده کنید</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">برنامه ۱۵ روزه یادگیری</h2>
              <p className="text-gray-400">یک مسیر ساختاریافته برای یادگیری برنامه‌نویسی</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedule.map((day) => (
                <div
                  key={day.day}
                  className="bg-white/5 rounded-2xl p-5 hover:bg-white/10 transition-all border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl font-bold">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="font-semibold">{day.title}</h3>
                      <p className="text-xs text-gray-400">روز {day.day}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {day.tasks.map((task) => (
                      <li key={task} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-purple-400 mt-0.5">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1">
                    {day.languages.map((lang) => (
                      <span
                        key={lang}
                        className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Frameworks Tab */}
        {activeTab === 'frameworks' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">فریمورک‌های محبوب</h2>
              <p className="text-gray-400">ابزارهای قدرتمند برای توسعه سریع‌تر</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {frameworks.map((fw) => (
                <div
                  key={fw.name}
                  className="bg-white/5 rounded-2xl p-5 hover:bg-white/10 transition-all border border-white/10 group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {fw.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{fw.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{fw.description}</p>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                    {fw.language}
                  </span>
                </div>
              ))}
            </div>

            {/* Additional Technologies */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">تکنولوژی‌های دیگر</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  { name: 'Docker', icon: '🐳', desc: 'Container' },
                  { name: 'Kubernetes', icon: '☸️', desc: 'Orchestration' },
                  { name: 'Git', icon: '📦', desc: 'Version Control' },
                  { name: 'Linux', icon: '🐧', desc: 'OS' },
                  { name: 'AWS', icon: '☁️', desc: 'Cloud' },
                  { name: 'GraphQL', icon: '◈', desc: 'API' },
                  { name: 'Redis', icon: '🔴', desc: 'Cache' },
                  { name: 'MongoDB', icon: '🍃', desc: 'Database' },
                  { name: 'PostgreSQL', icon: '🐘', desc: 'Database' },
                  { name: 'Nginx', icon: '🌐', desc: 'Server' },
                  { name: 'TensorFlow', icon: '🧠', desc: 'AI/ML' },
                  { name: 'PyTorch', icon: '🔥', desc: 'AI/ML' },
                ].map((tech) => (
                  <div
                    key={tech.name}
                    className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-all"
                  >
                    <div className="text-2xl mb-1">{tech.icon}</div>
                    <h4 className="font-medium text-sm">{tech.name}</h4>
                    <p className="text-xs text-gray-500">{tech.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Programming Roadmap © 2024 - راهنمای کامل یادگیری برنامه‌نویسی</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
