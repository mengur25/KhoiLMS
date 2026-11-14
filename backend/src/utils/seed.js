import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Lesson } from '../models/Lesson.js';
import { Submission } from '../models/Submission.js';
import { DailyGoal } from '../models/DailyGoal.js';
import { GoogleFormLog } from '../models/GoogleFormLog.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    // Clear existing data
    await User.deleteMany({});
    await Lesson.deleteMany({});
    await Submission.deleteMany({});
    await DailyGoal.deleteMany({});
    await GoogleFormLog.deleteMany({});

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const studentPassword = await bcrypt.hash('student123', salt);

    // Create Users
    const admin = await User.create({
      name: 'Thầy Khôi (Gia sư / Quản trị viên)',
      email: 'admin@lms.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      phone: '0987654321',
      avatar: 'K',
    });

    const student1 = await User.create({
      name: 'Nguyễn Văn A',
      email: 'nguyen@student.com',
      passwordHash: studentPassword,
      role: 'STUDENT',
      phone: '0912345678',
      avatar: 'A',
      streakDays: 3,
    });

    const student2 = await User.create({
      name: 'Trần Thị Linh',
      email: 'linh@student.com',
      passwordHash: studentPassword,
      role: 'STUDENT',
      phone: '0909888999',
      avatar: 'L',
      streakDays: 1,
    });

    // Create Lessons (Clean plain-text formatting, no markdown hashtags or emojis)
    const lessonsData = [
      {
        dayNumber: 1,
        title: 'Javascript Hiện Đại (ES6+), Async/Await & Event Loop',
        description: 'Nắm vững tư duy bất đồng bộ, Promise chaining và cách Javascript Engine xử lý tác vụ.',
        content: `Mục tiêu bài học Ngày 1:
1. Hiểu bản chất Event Loop, Call Stack, Web APIs, Microtask và Macrotask.
2. Sử dụng thành thạo Promise, async/await và xử lý lỗi chuyên sâu với try/catch.
3. Phân biệt Scope, Closure và Context (this).

Hướng dẫn học tập:
- Đọc kỹ tài liệu đính kèm bên dưới.
- Thực hành lại các ví dụ về Promise.all vs Promise.allSettled.
- Sau khi hoàn thành phần lý thuyết, bấm nút "Làm bài Form" để làm bài quiz 10 câu trắc nghiệm.

Quy tắc đạt chuẩn (The 8/10 Rule):
Bạn cần đạt tối thiểu 8/10 điểm trên Google Form để hệ thống tự động mở khóa Lời giải chi tiết bài tập và tài liệu nâng cao của ngày học này.`,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_FORM_DAY_1/viewform',
        formId: 'DAY_1_FORM',
        passingScore: 8,
        maxScore: 10,
        unlockedSolution: `LỜI GIẢI CHI TIẾT & PHÂN TÍCH CHUYÊN SÂU:
Chúc mừng bạn đã xuất sắc vượt qua mốc 8/10 điểm trên Google Form!

Câu 1: Thứ tự thực thi của Event Loop
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');

Đáp án đúng: A -> D -> C -> B
Giải thích: console.log('A') và 'D' chạy trong Call Stack đồng bộ. Promise.then được đưa vào Microtask Queue (ưu tiên cao). setTimeout được đưa vào Macrotask Queue. Event Loop sẽ dọn sạch Microtask Queue trước khi lấy tác vụ từ Macrotask.

Câu 2: Async/Await Error Handling
Khi gọi nhiều API độc lập, không nên await tuần tự từng hàm nếu không phụ thuộc dữ liệu. Hãy sử dụng Promise.all([fetch1(), fetch2()]) để tối ưu thời gian phản hồi.`,
        unlockedDriveLink: 'https://drive.google.com/drive/folders/khoi_lms_day1_exclusive_solutions',
        resources: [
          { title: 'MDN: JavaScript Visualized Event Loop', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop' },
          { title: 'CheatSheet: ES6 Destructuring & Spread', url: 'https://github.com/mbeaudru/modern-js-cheatsheet' },
        ],
        isPublished: true,
      },
      {
        dayNumber: 2,
        title: 'React State Lifecycle, Hooks & Tối Ưu Render',
        description: 'Làm chủ useState, useEffect, useMemo, useCallback và tư duy Component Composition.',
        content: `Mục tiêu bài học Ngày 2:
1. Phân biệt State vs Props, batching update trong React 18.
2. Hiểu rõ Dependency Array trong useEffect và cách tránh Infinite Loop.
3. Kỹ thuật memoization: khi nào nên và không nên dùng useMemo / useCallback.

Hướng dẫn học tập:
- Đọc kỹ tài liệu React docs mới.
- Hoàn thành bài trắc nghiệm trên Google Form để kiểm tra khả năng bắt lỗi render thừa!

Quy tắc đạt chuẩn:
Cần đạt từ 8/10 điểm trở lên để mở khóa Lời giải chi tiết Ngày 2.`,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_FORM_DAY_2/viewform',
        formId: 'DAY_2_FORM',
        passingScore: 8,
        maxScore: 10,
        unlockedSolution: `LỜI GIẢI CHI TIẾT NGÀY 2 (REACT HOOKS):
Phân tích lỗi Stale Closure trong useEffect:
- Khi useEffect tham chiếu tới biến state nhưng không khai báo trong dependency array, callback sẽ ghi nhớ giá trị cũ ở thời điểm khởi tạo component (stale closure).
- Cách khắc phục: Sử dụng functional state update: setCount(prev => prev + 1) thay vì setCount(count + 1).`,
        unlockedDriveLink: 'https://drive.google.com/drive/folders/khoi_lms_day2_solutions',
        resources: [
          { title: 'React Official Docs: Synchronizing with Effects', url: 'https://react.dev/learn/synchronizing-with-effects' },
        ],
        isPublished: true,
      },
      {
        dayNumber: 3,
        title: 'Node.js & Express RESTful API Kiến Trúc Chuẩn',
        description: 'Xây dựng cấu trúc thư mục Controller-Service-Repository, Error Middleware và JWT Authentication.',
        content: `Mục tiêu bài học Ngày 3:
1. Cấu trúc thư mục dự án Express production-ready.
2. Xử lý middleware xác thực JWT và phân quyền Role-Based Access Control (RBAC).
3. Chuẩn hóa format response và Global Error Handler.

Quy tắc đạt chuẩn:
Cần đạt từ 8/10 điểm để xem lời giải và boilerplate code hoàn chỉnh.`,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_FORM_DAY_3/viewform',
        formId: 'DAY_3_FORM',
        passingScore: 8,
        maxScore: 10,
        unlockedSolution: `LỜI GIẢI CHI TIẾT NGÀY 3 (EXPRESS & JWT):
- Mã nguồn boilerplate bảo mật với Helmet, Rate Limiter và HttpOnly Cookie.
- Cách thiết kế Refresh Token rotation để bảo vệ phiên đăng nhập người dùng.`,
        unlockedDriveLink: 'https://drive.google.com/drive/folders/khoi_lms_day3_solutions',
        resources: [
          { title: 'Express Security Best Practices', url: 'https://expressjs.com/en/advanced/best-practice-security.html' },
        ],
        isPublished: true,
      },
      {
        dayNumber: 4,
        title: 'MongoDB & Mongoose Thiết Kế Schema Thực Chiến',
        description: 'Tư duy Embedding vs Referencing, tạo Index tối ưu query và Aggregate Pipeline.',
        content: `Mục tiêu bài học Ngày 4:
1. Khi nào nên nhúng (Embed) document và khi nào nên tham chiếu (Reference).
2. Tạo Single Index & Compound Index để tăng tốc độ truy vấn gấp 100 lần.
3. Kỹ thuật viết MongoDB Aggregation Framework phân tích dữ liệu học viên.

Quy tắc đạt chuẩn:
Cần đạt từ 8/10 điểm để xem lời giải chi tiết và sơ đồ Collection.`,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_FORM_DAY_4/viewform',
        formId: 'DAY_4_FORM',
        passingScore: 8,
        maxScore: 10,
        unlockedSolution: `LỜI GIẢI CHI TIẾT NGÀY 4 (MONGODB & MONGOOSE):
- Sơ đồ tối ưu Collection cho tính năng LMS và hệ thống nộp bài thi.
- Kỹ thuật sharding và indexing phân tán cho bài thi quy mô lớn.`,
        unlockedDriveLink: 'https://drive.google.com/drive/folders/khoi_lms_day4_solutions',
        resources: [
          { title: 'MongoDB Indexing Strategies Guide', url: 'https://www.mongodb.com/docs/manual/indexes/' },
        ],
        isPublished: true,
      },
    ];

    const createdLessons = await Lesson.insertMany(lessonsData);

    // Create sample submissions for student1 (Nguyễn Văn A)
    // Day 1: Passed with 9/10
    await Submission.create({
      studentId: student1._id,
      studentEmail: student1.email,
      lessonId: createdLessons[0]._id,
      dayNumber: 1,
      formId: 'DAY_1_FORM',
      score: 9,
      maxScore: 10,
      isPassed: true,
      source: 'GOOGLE_FORM_WEBHOOK',
      notes: 'Đã hoàn thành kiểm tra trên Google Form đạt 9/10',
    });

    // Day 2: Attempted with 6/10 (Not passed yet, so Day 2 solution is locked!)
    await Submission.create({
      studentId: student1._id,
      studentEmail: student1.email,
      lessonId: createdLessons[1]._id,
      dayNumber: 2,
      formId: 'DAY_2_FORM',
      score: 6,
      maxScore: 10,
      isPassed: false,
      source: 'GOOGLE_FORM_WEBHOOK',
      notes: 'Lần 1 đạt 6/10, chưa đủ điểm 8 để mở khóa lời giải',
    });

    // Create Daily Goals for today
    const today = new Date().toISOString().split('T')[0];
    await DailyGoal.insertMany([
      {
        studentId: student1._id,
        title: 'Hoàn thành bài tập trắc nghiệm Ngày 1 trên Google Form',
        date: today,
        dayNumber: 1,
        isCompleted: true,
        completedAt: new Date(),
      },
      {
        studentId: student1._id,
        title: 'Đọc lời giải chi tiết và review câu sai Ngày 1',
        date: today,
        dayNumber: 1,
        isCompleted: true,
        completedAt: new Date(),
      },
      {
        studentId: student1._id,
        title: 'Làm lại bài kiểm tra Ngày 2 để đạt trên 8/10',
        date: today,
        dayNumber: 2,
        isCompleted: false,
      },
    ]);

    // Sample Google Form Log
    await GoogleFormLog.create({
      formId: 'DAY_1_FORM',
      studentEmail: student1.email,
      score: 9,
      maxScore: 10,
      formTitle: 'Bài kiểm tra Ngày 1: Javascript ES6',
      processed: true,
    });

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin: admin@lms.com / admin123');
    console.log('🎓 Student: nguyen@student.com / student123');
    console.log('🎓 Student: linh@student.com / student123');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
};

// If run directly via node src/utils/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}
