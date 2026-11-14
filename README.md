# Khôi LMS - Hệ Thống Quản Lý Gia Sư & Luyện Thi (Google Form 8/10 Rule)

Hệ thống quản lý học tập (LMS) dành riêng cho mô hình gia sư / kèm 1-1, tối ưu hóa quy trình kiểm tra trắc nghiệm bằng **Google Form**, lưu trữ dữ liệu trên **MongoDB**, và áp dụng chặt chẽ **Quy tắc điểm chuẩn 8/10 (The 8/10 Rule)** để mở khóa lời giải chi tiết.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

* **Backend:** Node.js (v20+), Express.js (REST API, JWT Authentication, Webhooks).
* **Database & ORM:** **MongoDB** + **Mongoose** (tự động hỗ trợ cả MongoDB Atlas / Local MongoDB và chế độ In-Memory Database `MongoMemoryServer` để chạy ngay không cần cài đặt phức tạp).
* **Frontend:** React 18 (Vite 6) + Tailwind CSS + Lucide Icons + Canvas Confetti.
* **Tự động hóa:** Google Apps Script Webhook (`onFormSubmit`) đẩy điểm thi thời gian thực về LMS.

---

## 🔑 Logic Cốt Lõi: Quy Tắc Điểm Chuẩn 8/10 (The 8/10 Rule)

1. **Học viên làm bài trên Google Form:** Mỗi ngày học có 1 đường link Google Form tương ứng (ví dụ: Day 1: Async/Await, Day 2: React Hooks).
2. **Kiểm tra kết quả:**
   - **Tự động qua Webhook:** Google Form được cài đặt Google Apps Script kích hoạt sự kiện `onFormSubmit`, tự động gửi `{ studentEmail, score, maxScore, formId }` về endpoint `POST /api/webhooks/google-form`.
   - **Tự kiểm tra qua giao diện LMS:** Học sinh bấm nút **"Kiểm tra điểm Google Form"** trên LMS để đối soát điểm.
   - **Bộ mô phỏng (Simulator):** Tích hợp sẵn hộp công cụ mô phỏng nộp điểm (thử điểm 6/10 vs 8.5/10) để gia sư và học sinh kiểm thử quy tắc ngay lập tức.
3. **Đánh giá điều kiện:**
   - **Nếu Điểm >= 8/10:**
     - Trạng thái: `isPassed = true`.
     - **Mở khóa lời giải chi tiết (Unlocked Solution)**, mã nguồn mẫu và thư mục Google Drive bài giải.
     - Tự động đánh dấu hoàn thành mục tiêu ngày (`DailyGoal`) và tăng chuỗi học tập (`streakDays`).
     - Mở khóa quyền truy cập ngày học tiếp theo trong lộ trình.
   - **Nếu Điểm < 8/10:**
     - Trạng thái: `isPassed = false`.
     - Lời giải chi tiết và đáp án **tiếp tục bị khóa** để học sinh tự ôn tập và làm lại form.

---

## 👥 Tài Khoản Trải Nghiệm (Demo Accounts)

Trên màn hình đăng nhập có sẵn nút **Đăng nhập 1-Click** hoặc dùng tài khoản sau:

| Vai trò | Email | Mật khẩu | Mô tả trạng thái |
| :--- | :--- | :--- | :--- |
| **Gia sư / Quản trị** | `admin@lms.com` | `admin123` | Toàn quyền quản lý giáo trình, xem tiến độ học viên, lấy code Apps Script |
| **Học viên 1** | `nguyen@student.com` | `student123` | Đã hoàn thành Ngày 1 (Điểm 9/10 - Đã mở khóa), Ngày 2 đang làm (6/10) |
| **Học viên 2** | `linh@student.com` | `student123` | Học viên mới bắt đầu giáo trình |

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Khởi động Backend

```bash
cd backend
npm install
npm run dev
```

* Backend chạy tại: `http://localhost:5001`
* Endpoint Webhook Google Form: `http://localhost:5001/api/webhooks/google-form`
* *(Nếu máy bạn chưa bật MongoDB, backend sẽ tự động khởi tạo cơ sở dữ liệu in-memory để chạy ngay lập tức mà không báo lỗi!)*

### 2. Khởi động Frontend

```bash
cd frontend
npm install
npm run dev
```

* Frontend chạy tại: `http://localhost:5173`

---

## 📋 Thiết Lập Google Form Apps Script (2 Phút)

1. Mở bài trắc nghiệm Google Form của bạn.
2. Nhấp vào dấu 3 chấm góc phải &rarr; Chọn **Trình chỉnh sửa tập lệnh** (Apps Script).
3. Dán toàn bộ mã mẫu (lấy trực tiếp từ tab **Tích hợp Google Form** trên LMS).
4. Thay đổi `FORM_ID` theo mã bài học (ví dụ: `DAY_1_FORM`, `DAY_2_FORM`).
5. Tạo Trigger loại **Khi gửi biểu mẫu (On form submit)** trỏ đến hàm `onFormSubmitTrigger`.
